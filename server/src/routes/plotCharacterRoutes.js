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

const plotCharacterRouter = express.Router();

plotCharacterRouter.post(
  "/createplotcharacter",
  verifyToken,
  createPlotCharacter
);
plotCharacterRouter.post(
  "/plotcharacter/:id",
  verifyToken,
  updatePlotCharacter
);
plotCharacterRouter.delete(
  "/plotcharacter/:id",
  verifyToken,
  deletePlotCharacter
);
plotCharacterRouter.get(
  "/plotcharacterlist",
  verifyToken,
  getUserAllPlotCharacters
);
plotCharacterRouter.get(
  "/selectedplotcharacter/:id",
  verifyToken,
  getPlotCharacter
);
plotCharacterRouter.post(
  "/rebootcharacter/:id",
  verifyToken,
  rebootPlotCharacter
);
plotCharacterRouter.post(
  "/send-email/:id",
  verifyToken,
  sendPlotCharacterStoryViaEmail
);

export default plotCharacterRouter;
