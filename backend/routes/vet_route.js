import express from "express";

import vet_entity from "../entities/vet_entity.js";

const vet_router = express.Router();

vet_router.route("/").get(vet_entity.get);

vet_router.route("/register").post(vet_entity.register);
vet_router.route("/verifyEmail").post(vet_entity.verify_email);

vet_router.route("/login").post(vet_entity.login);
vet_router.route("/logout").post(vet_entity.logout);

vet_router.route("/forgot").post(vet_entity.forgot_password);
vet_router.route("/verifyCode").post(vet_entity.verify_email_password);
vet_router.route("/updatePassword").post(vet_entity.update_password);

export default vet_router;
