import express from "express";
import pet_entity from "../entities/pet_entity.js";

const pet_router = express.Router();

pet_router.route("/").get(pet_entity.get).post(pet_entity.insert);

pet_router.route("/:id").put(pet_entity.update).delete(pet_entity.delete);

export default pet_router;
