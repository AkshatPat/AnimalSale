import express from "express";
import userController from '../controllers/animals'

const routes = express.Router();

routes.post("/create-animal", userController.createAnimal)

routes.get("/animals-list", userController.getAnimal)

routes.post("/search-animal", userController.searchAnimal)

export = routes;