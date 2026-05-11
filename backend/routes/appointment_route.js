import express from "express"
import appointment_entity from "../entities/appointment_entity.js"

const appointment_router = express.Router();

appointment_router.route("/")
.get(appointment_entity.get)
.post(appointment_entity.insert)

appointment_router.route("/:id")
.put(appointment_entity.update)
.delete(appointment_entity.delete)

export default appointment_router;