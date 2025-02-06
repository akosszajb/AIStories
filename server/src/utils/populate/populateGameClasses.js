import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import gameClassNames from "../../models/exampleData/gameClassNames.json" assert { type: "json" };
import GameClassModel from "../../models/gameClass.model.js";

dotenv.config({ path: "../../../.env" });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible! - populateClasses.js");
  process.exit(1);
}

const attackTypes = ["melee", "ranged", "magic"];
const pick = (from) => from[Math.floor(Math.random() * from.length)];

const populateGameClasses = async () => {
  await GameClassModel.deleteMany({});

  const gameClasses = gameClassNames.map((gameClassname) => ({
    gameclassname: gameClassname,
    attackType: pick(attackTypes),
    attack: 10,
    defense: 10,
  }));

  await GameClassModel.create(gameClasses);
  console.log("GameClasses created");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await populateGameClasses();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
