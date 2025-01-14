import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import classNames from "../db/classNames.json" assert { type: "json" };
import ClassModel from "../db/class.model.js";

const router = express.Router();

dotenv.config({ path: "../.env" });

const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const attackTypes = ["melee", "ranged", "magic"];
const pick = (from) => from[Math.floor(Math.random() * from.length)];

const populateClasses = async () => {
  await ClassModel.deleteMany({});

  const classes = classNames.map((classname) => ({
    name: classname,
    attackType: pick(attackTypes),
    attack: 10,
    defense: 10,
  }));

  await ClassModel.create(classes);
  console.log("Classes created");
};

const app = express();
app.use(express.json());

const main = async () => {
  await mongoose.connect(MONGO_URL);
  await populateClasses();
  await mongoose.disconnect();
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});