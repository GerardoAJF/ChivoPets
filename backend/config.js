import dotenv from "dotenv";

dotenv.configDotenv();

const config = {
  JWT: {
    secret: process.env.JWT_SECRET,
  },
  MAIL: {
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
  },
};

export default config;
