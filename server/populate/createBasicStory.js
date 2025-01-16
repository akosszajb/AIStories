import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import BasicStoryModel from "../db/basicStory.model.js";

const router = express.Router();

dotenv.config({ path: "../.env" });

const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];

const createBasicStoryMedieval = async () => {
  await BasicStoryModel.deleteMany({});
  const stories = await BasicStoryModel.find();

  const basicStory = {
    name: "1. The Floating Tower",
  };

  await BasicStoryModel.create(basicStory);
  console.log("BasicStoryMedieval created!");
};

const createBasicStoryScifi = async () => {
  const stories = await BasicStoryModel.find();

  const basicStory = {
    name: "2. Galaxy Quest",
    StarterFullStories: [
      "Galaxy",
      "scifi",
      "story",
      "Space",
      "Star",
      "funny",
      "laser",
    ],
    firstChoiceOptions: [
      "Explore the galaxy",
      "Activate hyperspace jump",
      "Launch the rocket",
      "Initiate alien contact",
    ],
  };

  await BasicStoryModel.create(basicStory);
  console.log("BasicStoryScifi created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createBasicStoryMedieval();
  await createBasicStoryScifi();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
