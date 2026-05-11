import BasicEntity from "./basic_entity.js";

import config from "../../config.js";

import nodemailer from "nodemailer";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

class CredentialsEntity extends BasicEntity {
  insert = async (req, res) => {
    throw new Error(
      "You can't create a credentials entity. You need to register it",
    );
  };

  register = async (req, res) => {
    try {
      const { password, ...payload} = req.body;

      if (await this.model.findOne({ email: payload.email })) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashed_password = await bcrypt.hash(password, 10);

      const randomCode = crypto.randomBytes(3).toString("hex");

      const token_data = await {
        ...payload,
        password: hashed_password,
        randomCode,
      };

      const token = jsonwebtoken.sign(token_data, config.JWT.secret, {
        expiresIn: "15m",
      });

      res.cookie(this.name + "RegisterCookie", token, {
        maxAge: 15 * 60 * 1000,
      });

      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: config.MAIL.user,
          pass: config.MAIL.password,
        },
      });
      transport.sendMail(
        {
          to: payload.email,
          from: config.MAIL.user,
          subject: "Código de verificación para correo electrónico",
          text:
            "Su código de verificación de correo electrónico es: " + randomCode,
        },
        (error) => {
          if (error) {
            console.error(error);
            return res.status(500).json("Email can't be sended");
          }
          return res.status(200).json("Email sended");
        },
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  verify_email = async (req, res) => {
    try {
      const { verifyCode } = req.body;

      const token = req.cookies[this.name + "RegisterCookie"];
      const { randomCode, ...payload } = jsonwebtoken.verify(
        token,
        config.JWT.secret,
      );

      if (verifyCode !== randomCode) {
        return res.status(400).json({ message: "Invalid verify code" });
      }

      res.clearCookie(this.name + "RegisterCookie");

      const new_entity = new this.model({ ...payload, isVerified: true });
      await new_entity.save();

      return res
        .status(200)
        .json({ message: this.name + " registered", data: new_entity});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  login = async (req, res) => {
    try {
      const { email, clientPassword } = req.body;

      const saved_entity = await this.model.findOne({ email });
      if (!saved_entity) {
        return res.status(400).json({ message: "Email isn't registered" });
      }
      let { password, loginAttempts, timeOut } = saved_entity;

      if (Date.now() < (timeOut || 0)) {
        return res
          .status(400)
          .json({ message: "Account is temporary blocked. Wait" });
      }

      if (!(await bcrypt.compare(clientPassword, password))) {
        if (loginAttempts >= 5) {
          loginAttempts = 0;
          timeOut = Date.now() + 7 * 60 * 1000;

          await this.model.findOneAndUpdate(
            { email },
            { loginAttempts, timeOut },
          );
          return res
            .status(400)
            .json({ message: "Account blocked by to many failed attempts" });
        }

        loginAttempts = loginAttempts + 1 || 1;
        await this.model.findOneAndUpdate({ email }, { loginAttempts });
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      const login_token = jsonwebtoken.sign(
        { email, userType: this.name },
        config.JWT.secret,
        { expiresIn: "2h" },
      );
      res.cookie(this.name + "LoginCookie", login_token, {
        maxAge: 2 * 60 * 60 * 1000,
      });

      return res.status(200).json({ message: "Login successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = async (req, res) => {
    try {
        if (req.cookies[this.name + "LoginCookie"]) {
            res.clearCookie(this.name + "LoginCookie");
            return res.status(200).json({message: "Logout successfully"})
        }
        return res.status(400).json({message: "You aren't logged"})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
  }

  forgot_password = async (req, res) => {
    try {
        const { email } = req.body;
        const saved_entity = await this.model.findOne({email})

        if (!saved_entity) return res.status(400).json({ message: "Email isn't registered" });

        const randomCode = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign(
            {email, randomCode, userType: this.name},
            config.JWT.secret,
            {expiresIn:"15m"}
        )
        res.cookie(this.name + "ForgotCookie", token, {maxAge: 15*60*1000})

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                "user": config.MAIL.user,
                "pass": config.MAIL.password
            }
        })
        transport.sendMail({
            to: email,
            from: config.MAIL.user,
            subject: "Código de recuperación de contraseña",
            text: "Su código de recuperación de contraseña es: " + randomCode
        }, (error) => {
           if (error) {
             console.error(error);
             return res.status(500).json("Email can't be sended");
           }
           return res.status(200).json("Email sended");
        })        

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error"})
    }
  }

  verify_email_password = async (req, res) => {
    try {
        const {verifyCode} = req.body;

        const token = req.cookies[this.name + "ForgotCookie"]
        const {email, randomCode, userType} = jsonwebtoken.verify(token, config.JWT.secret)

        if (verifyCode !== randomCode) return res.status(400).json({message: "Invalid verify code"})

        res.clearCookie(this.name + "ForgotCookie")

        const new_token = jsonwebtoken.sign(
            {email, userType, verify: true},
            config.JWT.secret,
            {expiresIn: "15m"}
        )
        res.cookie(this.name + "UpdatePasswordCookie", new_token);
        return res.status(200).json({message: "Valid verify code"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({message: "Internal server error"})
    }
  }

  update_password = async (req, res) => {
    try {
        const {password, confirmPassword} = req.body;

        const token = req.cookies[this.name + "UpdatePasswordCookie"]
        const {email, verify} = jsonwebtoken.verify(token, config.JWT.secret)

        if (!verify) return res.status(400).json({message: "Email isn't verified"})

        if (password !== confirmPassword)
          return res.status(400).json({ message: "Password doesn't match" });
        
        res.clearCookie(this.name + "UpdatePasswordCookie")

        await this.model.findOneAndUpdate(
            {email}, 
            {password: await bcrypt.hash(password, 10)})

        return res.status(200).json({message: "Password updated successfully"})

    } catch (error) {
        console.error(error)
        return res.status(500).json({message: "Internal server error"})
    }
  }
}

export default CredentialsEntity;
