import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { createUser } from "./createFirstUser.js";
import {
  createPlotStoryMedieval,
  createPlotStoryScifi,
  createPlotStoryCrime,
  createPlotStoryComedy,
  createPlotStoryMilitary,
} from "./createPlotStory.js";

import {
  createGameElminsterCharacter,
  createGameSkywalkerCharacter,
} from "./populateGameCharacters.js";
import { populateGameClasses } from "./populateGameClasses.js";
import {
  createPlotGandalfCharacter,
  createPlotSpaceMarineCharacter,
  createPlotCharcterDetective,
  createPlotCharacterFunny,
  createPlotCharacterMilitary,
} from "./populatePlotCharacters.js";

dotenv.config({ path: "../../../.env" });

const { MONGO_URL } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const app = express();
app.use(express.json());

const main = async () => {
  try {
    await mongoose.connect(MONGO_URL);

    // plot stories
    await createPlotStoryMedieval();
    await createPlotStoryScifi();
    await createPlotStoryCrime();
    await createPlotStoryComedy();
    await createPlotStoryMilitary();

    //game classes
    await populateGameClasses();

    // game characters
    await createGameElminsterCharacter();
    await createGameSkywalkerCharacter();

    // plot characters
    await createPlotGandalfCharacter();
    await createPlotSpaceMarineCharacter();
    await createPlotCharcterDetective();
    await createPlotCharacterFunny();
    await createPlotCharacterMilitary();

    // admin user
    await createUser();
  } catch (err) {
    console.error("Error with populateDB main:", err);
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
