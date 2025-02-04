import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import PlotCharacterModel from "../../models/plotCharacter.model.js";
import GameCharacterModel from "../../models/gameCharacter.model.js";
import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

dotenv.config({ path: "../../../.env" });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];

const createUser = async () => {
  await UserModel.deleteMany({});
  const psw = "something";
  const hashedPassword = await bcrypt.hash(psw, 10);
  const plotCharacters = await PlotCharacterModel.find();
  const gameCharacters = await GameCharacterModel.find();

  const firstUser = {
    username: "first",
    email: "email@email.com",
    password: hashedPassword,
    plotCharacter: plotCharacters,
    gameCharacter: gameCharacters,
  };

  await UserModel.create(firstUser);
  console.log("First user created!");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await createUser();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
