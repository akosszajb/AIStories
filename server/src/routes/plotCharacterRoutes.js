import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  createPlotCharacter,
  updatePlotCharacter,
  deletePlotCharacter,
  getUserAllPlotCharacters,
  getPlotCharacter,
  rebootPlotCharacter,
} from "../controllers/plotCharacterController.js";

const router = express.Router();

router.post("/createplotcharacter", verifyToken, createPlotCharacter);
router.post("/plotcharacter/:id", updatePlotCharacter);
router.delete("/plotcharacter/:id", deletePlotCharacter);
router.get("/plotcharacterlist", verifyToken, getUserAllPlotCharacters);
router.get("/selectedplotcharacter/:id", verifyToken, getPlotCharacter);
router.post("/rebootcharacter/:id", verifyToken, rebootPlotCharacter);

export default router;
