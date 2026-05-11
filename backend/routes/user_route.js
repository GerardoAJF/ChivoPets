import express from "express"

import user_entity from "../entities/user_entity.js"

const user_router = express.Router()

user_router.route("/")
.get(user_entity.get)

user_router.route("/register").post(user_entity.register);
user_router.route("/verifyEmail").post(user_entity.verify_email)

user_router.route("/login").post(user_entity.login);
user_router.route("/logout").post(user_entity.logout)

user_router.route("/forgot").post(user_entity.forgot_password)
user_router.route("/verifyCode").post(user_entity.verify_email_password);
user_router.route("/updatePassword").post(user_entity.update_password)

export default user_router;