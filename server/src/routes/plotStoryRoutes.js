import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  getPlotStoryList,
  getSelectedPlotStory,
  generatePlotStoryAndPicture,
} from "../controllers/PlotStoryController.js";

const router = express.Router();

router.get("/plotstorieslist", verifyToken, getPlotStoryList);
router.post("/selectedplotstory", verifyToken, getSelectedPlotStory);
router.post("/generate-plotstory", verifyToken, generatePlotStoryAndPicture);

export default router;
