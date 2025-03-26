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
  deletePlotStory,
} from "../controllers/PlotStoryController.js";

const plotStoryRouter = express.Router();

plotStoryRouter.get("/plotstorieslist", verifyToken, getPlotStoryList);
plotStoryRouter.post("/selectedplotstory", verifyToken, getSelectedPlotStory);
plotStoryRouter.post(
  "/generate-plotstory",
  verifyToken,
  generatePlotStoryAndPicture
);
plotStoryRouter.get("/plotstorytitles", verifyToken, getPlotStoryTitles);
plotStoryRouter.post("/createplotstory", verifyToken, createPlotStory);
plotStoryRouter.post(
  "/selectedplotstorytomodify",
  verifyToken,
  getSelectedPlotStoryToModify
);
plotStoryRouter.post("/updateselectedplotstory", verifyToken, updatePlotStory);
plotStoryRouter.delete(
  "/deleteselectedplotstory",
  verifyToken,
  deletePlotStory
);

export default plotStoryRouter;
