import gameClassNames from "../../models/exampleData/gameClassNames.json" assert { type: "json" };
import GameClassModel from "../../models/gameClass.model.js";

const attackTypes = ["melee", "ranged", "magic"];
const pick = (from) => from[Math.floor(Math.random() * from.length)];

export const populateGameClasses = async () => {
  await GameClassModel.deleteMany({});

  const gameClasses = gameClassNames.map((gameClassname) => ({
    gameclassname: gameClassname,
    attackType: pick(attackTypes),
    attack: 10,
    defense: 10,
  }));

  await GameClassModel.create(gameClasses);
  console.log("GameClasses - created");
};
