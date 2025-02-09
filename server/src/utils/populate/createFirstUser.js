import PlotCharacterModel from "../../models/plotCharacter.model.js";
import GameCharacterModel from "../../models/gameCharacter.model.js";
import UserModel from "../../models/user.model.js";
import bcrypt from "bcrypt";

const pick = (from) => from[Math.floor(Math.random() * from.length)];

export const createUser = async () => {
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
