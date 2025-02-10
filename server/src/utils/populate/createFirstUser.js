import PlotCharacterModel from "../../models/plotCharacter.model.js";
import GameCharacterModel from "../../models/gameCharacter.model.js";
import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";
import { defaultPlotCharacters } from "../../models/exampleData/defaultPlotCharacters.js";

const pick = (from) => from[Math.floor(Math.random() * from.length)];

export const createUser = async () => {
  await UserModel.deleteMany({});
  const psw = "something";
  const hashedPassword = await bcrypt.hash(psw, 10);

  await PlotCharacterModel.deleteMany({});

  const createdPlotCharacters = await PlotCharacterModel.insertMany(
    defaultPlotCharacters.map((character) => ({
      ...character,
    }))
  );

  const plotCharacterIds = createdPlotCharacters.map((char) => char._id);

  const gameCharacters = await GameCharacterModel.find();

  const firstUser = {
    username: "first",
    email: "email@email.com",
    password: hashedPassword,
    plotCharacter: plotCharacterIds,
    gameCharacter: gameCharacters,
  };

  await UserModel.create(firstUser);
  console.log("First user created!");
};
