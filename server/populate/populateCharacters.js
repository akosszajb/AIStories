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
    name: "Gandalf the Debugger ",
    class: pick(classes),
    weapon: "staff",
    cloth: "robe",
    personality: 99,
    storykeywords: [
      "text adventure",
      "Forgotten Realms",
      "D&D",
      "Dungeon and Dragons",
      "Baldur's Gate",
      "Tower of Ondil",
      "The Floating Tower",
      "Member of the Blades",
      "Wizards",
      "Dragons",
      "Tombs",
      "Fate",
      "Enchantment",
      "Prophecy",
      "Secrets",
      "Adventure",
      "Bright Shields",
      "Rising Rope",
      "Forbidden Relic",
      "Cursed Kingdom",
      "Lost Civilization",
      "Shadow Assassins",
      "Draconic Pact",
      "Feywild Intrigue",
      "Strategic Search",
      "Spells",
      "Magical Sacrifice",
      "Flight",
      "Historical Magic",
      "Power",
      "Blue Flame",
      "Tomb Secrets",
      "Dragons",
      "Gods & Temples",
      "Illusions",
      "Crypts",
      "Dark",
    ],
    picturekeywords: [
      ["medievalfantasy", "TheFloatingTower", "adventure", "story"],
    ],
    fullStories: [
      `It was a cold, clear day still early in Marpenoth, in the Year of Many Brews.
    All around, the trees' leaves had already been touched by golden and fiery-orange hues when the Brave Blades arrived at the place they had sought for so long.
    Their goal loomed dark and silent above them: the Floating Tower, the lifeless fortress of the long-dead Ondil, hidden deep within a chasm somewhere west of the Horn Hills. Ondil's tower hovered patiently, as it had for centuries, under the protection of a dreaded wizard.`,
      `Become an adventurer in the The Floating Tower Story. Be a wizard, rouge or fighter! Explore the Forgotten Realms while you meet warlocks and bandits and become a renowned Adventurer across the world! You are a newly appointed member in the "The Blades"`,
    ],
    firstChoiceOptions: [
      "Teleport to the tower",
      "Lockpicking the gate",
      "Drink a big glass of beer",
      "Build a campfire",
    ],
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
