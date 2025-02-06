import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import PlotStoryModel from "../../models/plotStory.model.js";

const router = express.Router();

dotenv.config({ path: "../../../.env" });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const createPlotStoryMedieval = async () => {
  await PlotStoryModel.deleteMany({});
  const plotStory = {
    title: "1. The Floating Tower",
  };

  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Medieval created!");
};

const createPlotStoryScifi = async () => {
  const plotStory = {
    title: "2. Galaxy Quest",
    StarterFullStories: [
      "Deep beneath the crimson dunes of Mars, Captain Eira Solis uncovered an ancient doorway glowing with unearthly symbols.",
      "As she pressed her hand to the cold metal, it hummed and opened, revealing a vast chamber filled with floating, crystalline orbs.",
      "Her AI companion, Delta, warned of an energy surge, but curiosity drove her forward, reaching for the largest orb",
      "In an instant, she was transported to a starship brimming with alien lifeforms, all staring at her with a mix of awe and suspicion",
      "Their leader, a towering figure of light, declared, “You are the chosen navigator of the lost Nexus, destined to save our galaxy from the Void.",
    ],
    firstChoiceOptions: [
      "Explore the galaxy",
      "Activate hyperspace jump",
      "Launch the rocket",
      "Initiate alien contact",
    ],
  };
  await PlotStoryModel.create(plotStory);
  console.log("PlotStory - Scifi created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createPlotStoryMedieval();
  await createPlotStoryScifi();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
