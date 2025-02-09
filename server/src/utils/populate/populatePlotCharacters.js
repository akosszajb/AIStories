import PlotCharacterModel from "../../models/plotCharacter.model.js";

export const createPlotGandalfCharacter = async () => {
  await PlotCharacterModel.deleteMany({});

  const plotCharacterGandalf = {
    plotcharactername: "Gandalf the Debugger ",
    personality: 99,
    charStoryKeywords: [
      "The Floating Tower",
      "Member of the Blades",
      "Wizards",
      "Fate",
      "Adventure",
      "Magic",
    ],
    pictureKeywords: [
      "medievalfantasy",
      "story",
      "adventure",
      "TheFloatingTower",
    ], // from the first 4 keyword one will be added to the picture generation prompt
  };
  await PlotCharacterModel.create(plotCharacterGandalf);
  console.log("Plot Character - Gandalf is created!");
};

export const createPlotSpaceMarineCharacter = async () => {
  const plotCharacter = {
    plotcharactername: "Peter Quincy Taggart",
    personality: 50,
    charStoryKeywords: [
      "Space",
      "Sci-fi",
      "Comedy",
      "Starship",
      "Science",
      "Humour",
    ],
    pictureKeywords: [
      "scifi",
      "story",
      "space",
      "stars", // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await PlotCharacterModel.create(plotCharacter);
  console.log("Plot Character - Peter Quincy Taggart is created!");
};

export const createPlotCharcterDetective = async () => {
  const plotCharacter = {
    plotcharactername: "Detective Harper Blythe",
    personality: 85,
    charStoryKeywords: [
      "The Silent Witness",
      "Mystery",
      "Detective",
      "Secrets",
      "Suspense",
      "Puzzle",
    ],
    pictureKeywords: [
      "noir",
      "detective",
      "modern",
      "city", // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await PlotCharacterModel.create(plotCharacter);
  console.log("Plot Character - Detective Harper Blythe is created!");
};

export const createPlotCharacterFunny = async () => {
  const plotCharacter = {
    plotcharactername: "Dave 'The Schemer' Reynolds",
    personality: 75,
    charStoryKeywords: [
      "The Great Couch Caper",
      "Comedy",
      "Chaos",
      "Friendship",
      "Ridiculous Plans",
      "Talking animals",
    ],
    pictureKeywords: [
      "comedy",
      "adventure",
      "modern",
      "funny", // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await PlotCharacterModel.create(plotCharacter);
  console.log("Plot Character - Dave 'The Schemer' Reynolds is created!");
};

export const createPlotCharacterMilitary = async () => {
  const plotCharacter = {
    plotcharactername: "Major Elena 'Shadow' Carter",
    personality: 12,
    charStoryKeywords: [
      "Operation Shadow Strike",
      "Military",
      "Action",
      "Covert Mission",
      "High Stakes",
      "Combat",
    ],
    pictureKeywords: [
      "military",
      "action",
      "tactical",
      "intense", // from the first 4 keyword one will be added to the picture generation prompt
    ],
  };

  await PlotCharacterModel.create(plotCharacter);
  console.log("Plot Character - Major Elena 'Shadow' Carter is created!");
};
