import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";

import {
  getPlotStoryList,
  getSelectedPlotStory,
  generatePlotStoryAndPicture,
  getPlotStoryTitles,
  createPlotStory,
  getSelectedPlotStoryToModify,
  updatePlotStory,
} from "../controllers/PlotStoryController.js";

const router = express.Router();

router.get("/plotstorieslist", verifyToken, getPlotStoryList);
router.post("/selectedplotstory", verifyToken, getSelectedPlotStory);
router.post("/generate-plotstory", verifyToken, generatePlotStoryAndPicture);
router.get("/plotstorytitles", verifyToken, getPlotStoryTitles);
router.post("/createplotstory", verifyToken, createPlotStory);
router.post(
  "/selectedplotstorytomodify",
  verifyToken,
  getSelectedPlotStoryToModify
);
router.post("/updateselectedplotstory", verifyToken, updatePlotStory);

export default router;
