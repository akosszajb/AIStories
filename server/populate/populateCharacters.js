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

const createCharacter = async () => {
  await CharacterModel.deleteMany({});
  const classes = await ClassModel.find();

  const character = {
    name: "First example character",
    class: pick(classes),
    weapon: "staff",
    cloth: "robe",
    personality: 99,
  };

  await CharacterModel.create(character);
  console.log("Character created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createCharacter();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
