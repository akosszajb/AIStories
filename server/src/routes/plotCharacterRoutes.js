import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  createPlotCharacter,
  updatePlotCharacter,
  deletePlotCharacter,
  getUserAllPlotCharacters,
} from "../controllers/plotCharacterController.js";

const router = express.Router();

router.post("/plotcharactercreator", createPlotCharacter);
router.patch("/plotcharacter/:id", updatePlotCharacter);
router.delete("/plotcharacter/:id", deletePlotCharacter);
router.get("/plotcharacterlist", verifyToken, getUserAllPlotCharacters);

export default router;
