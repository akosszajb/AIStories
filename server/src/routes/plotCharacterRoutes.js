import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  createPlotCharacter,
  updatePlotCharacter,
  deletePlotCharacter,
  getUserAllPlotCharacters,
  getPlotCharacter,
  rebootPlotCharacter,
  sendPlotCharacterStoryViaEmail,
} from "../controllers/plotCharacterController.js";

const router = express.Router();

router.post("/createplotcharacter", verifyToken, createPlotCharacter);
router.post("/plotcharacter/:id", verifyToken, updatePlotCharacter);
router.delete("/plotcharacter/:id", verifyToken, deletePlotCharacter);
router.get("/plotcharacterlist", verifyToken, getUserAllPlotCharacters);
router.get("/selectedplotcharacter/:id", verifyToken, getPlotCharacter);
router.post("/rebootcharacter/:id", verifyToken, rebootPlotCharacter);
router.post("/send-email/:id", verifyToken, sendPlotCharacterStoryViaEmail);

export default router;
