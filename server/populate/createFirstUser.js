import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import CharacterModel from "../db/character.model.js";
import UserModel from "../db/user.model.js";
import bcrypt from "bcrypt";

const router = express.Router();

dotenv.config({ path: "../.env" });

const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const pick = (from) => from[Math.floor(Math.random() * from.length)];

const createUser = async () => {
  await UserModel.deleteMany({});
  const psw = "something";
  const hashedPassword = await bcrypt.hash(psw, 10);
  const characters = await CharacterModel.find();

  const firstUser = {
    username: "first",
    email: "email@email.com",
    password: hashedPassword,
    character: characters,
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
