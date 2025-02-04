import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import GameCharacterModel from "../../models/gameCharacter.model.js";
import GameClassModel from "../../models/gameClass.model.js";

dotenv.config({ path: "../../../.env" });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];

const createGameElminsterCharacter = async () => {
  await GameCharacterModel.deleteMany({});
  const gameClasses = await GameClassModel.find();

  const gameCharacter = {
    name: "Elminster Aumar ",
    gameClass: pick(gameClasses),
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

  await GameCharacterModel.create(gameCharacter);
  console.log("Elminster Aumar Game Character is created!");
};

const createGameSkywalkerCharacter = async () => {
  const gameClasses = await GameClassModel.find();

  const gameCharacter = {
    name: "Idiot Skywalker",
    gameClass: pick(gameClasses),
    weapon: "lightsaber",
    cloth: "naked",
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
      ["scifi", "story", "adventure", "space&stars"], // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await GameCharacterModel.create(gameCharacter);
  console.log("Idiot Skywalker Game Character is created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createGameElminsterCharacter();
  await createGameSkywalkerCharacter();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
