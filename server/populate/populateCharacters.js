import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import CharacterModel from "../db/character.model.js";
import ClassModel from "../db/class.model.js";

const router = express.Router();

dotenv.config({ path: "../.env" });

const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];

const createGandalfCharacter = async () => {
  await CharacterModel.deleteMany({});
  const classes = await ClassModel.find();

  const character = {
    name: "Gandalf the Debugger ",
    class: pick(classes),
    weapon: "staff",
    cloth: "robe",
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

  await CharacterModel.create(character);
  console.log("GandalfCharacter created!");
};

const createSpaceMarineCharacter = async () => {
  const classes = await ClassModel.find();

  const character = {
    name: "Peter Quincy Taggart",
    class: pick(classes),
    weapon: "sword",
    cloth: "light armor",
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
      ["scifi", "story", "adventure", "TheFloatingTower"], // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await CharacterModel.create(character);
  console.log("Peter Quincy Taggart created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createGandalfCharacter();
  await createSpaceMarineCharacter();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
