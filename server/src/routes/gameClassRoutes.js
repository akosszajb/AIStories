import express from "express";
import {
  getAllGameClasses,
  createGameClass,
  updateGameClass,
  deleteGameClass,
} from "../controllers/gameClassController.js";

const gameClassControllerRouter = express.Router();

gameClassControllerRouter.get("/gameclass", getAllGameClasses);
gameClassControllerRouter.post("/gameclasscreator", createGameClass);
gameClassControllerRouter.patch("/gameclass/:id", updateGameClass);
gameClassControllerRouter.delete("/gameclass/:id", deleteGameClass);

export default gameClassControllerRouter;
