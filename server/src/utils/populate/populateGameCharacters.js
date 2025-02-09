import GameCharacterModel from "../../models/gameCharacter.model.js";
import GameClassModel from "../../models/gameClass.model.js";

const pick = (from) => from[Math.floor(Math.random() * from.length)];

export const createGameElminsterCharacter = async () => {
  await GameCharacterModel.deleteMany({});
  const gameClasses = await GameClassModel.find();

  const gameCharacter = {
    gamecharactername: "Elminster Aumar ",
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
  console.log("Game Character - Elminster Aumar is created!");
};

export const createGameSkywalkerCharacter = async () => {
  const gameClasses = await GameClassModel.find();

  const gameCharacter = {
    gamecharactername: "Idiot Skywalker",
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
  console.log("Game Character - Idiot Skywalker is created!");
};
