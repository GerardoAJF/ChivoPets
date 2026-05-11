import express from "express";
import service_entity from "../entities/service_entity.js";

const service_router = express.Router();

service_router
  .route("/")
  .get(service_entity.get)
  .post(service_entity.insert);

service_router
  .route("/:id")
  .put(service_entity.update)
  .delete(service_entity.delete);

export default service_router;
