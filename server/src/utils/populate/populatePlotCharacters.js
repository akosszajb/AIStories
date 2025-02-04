import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import PlotCharacterModel from "../../models/plotCharacter.model.js";

dotenv.config({ path: "../../../.env" });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const createPlotGandalfCharacter = async () => {
  await PlotCharacterModel.deleteMany({});

  const plotCharacter = {
    name: "Gandalf the Debugger ",
    personality: 99,
    charStoryKeywords: [
      "The Floating Tower",
      "Member of the Blades",
      "Wizards",
      "Fate",
      "Enchantment",
      "Prophecy",
      "Secrets",
      "Adventure",
      "Feywild Intrigue",
      "Strategic Search",
      "Spells",
      "Magical Sacrifice",
      "Flight",
      "Historical Magic",
      "Power",
      "Blue Flame",
      "Tomb Secrets",
      "Gods & Temples",
    ],
    pictureKeywords: [
      ["medievalfantasy", "story", "adventure", "TheFloatingTower"], // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await PlotCharacterModel.create(plotCharacter);
  console.log("Gandalf Plot Character is created!");
};

const createPlotSpaceMarineCharacter = async () => {
  const plotCharacter = {
    name: "Peter Quincy Taggart",
    personality: 1,
    charStoryKeywords: [
      "Space",
      "Sci-fi",
      "Comedy",
      "Starship",
      "Battle",
      "humour",
      "Alien",
      "Adventure",
      "Rescue",
    ],
    pictureKeywords: [
      ["scifi", "story", "space", "stars"], // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await PlotCharacterModel.create(plotCharacter);
  console.log("Peter Quincy Taggart Plot Character is created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createPlotGandalfCharacter();
  await createPlotSpaceMarineCharacter();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
