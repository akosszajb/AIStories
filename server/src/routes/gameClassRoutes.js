import express from "express";
import {
  getAllGameClasses,
  createGameClass,
  updateGameClass,
  deleteGameClass,
} from "../controllers/gameClassController.js";

const router = express.Router();

router.get("/gameclass", getAllGameClasses);
router.post("/gameclasscreator", createGameClass);
router.patch("/gameclass/:id", updateGameClass);
router.delete("/gameclass/:id", deleteGameClass);

export default router;
