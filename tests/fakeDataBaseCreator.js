import GameClassModel from "../server/src/models/gameClass.model";
import PlotStoryModel from "../server/src/models/plotStory.model";

//fake DB
export const fakeDataBaseCreator = async () => {
  const gameClasses = await GameClassModel.create([
    {
      gameclassname: "Fighter",
      attackType: "melee",
      attack: 50,
      defense: 50,
      created: new Date("2024-02-28T12:00:00Z"),
    },
    {
      gameclassname: "Wizard",
      attackType: "magic",
      attack: 100,
      defense: 0,
      created: new Date("2024-02-27T12:00:00Z"),
    },
  ]);

  const plotStories = await PlotStoryModel.create([
    {
      title: "Test title 1",
      storyKeywords: ["test", "red", "error"],
      StarterFullStories: ["Starter story1", "Starter story 2"],
      firstChoiceOptions: [
        "testOption1",
        "testOption2",
        "testOption3",
        "testOption4",
      ],
      created: new Date("2024-02-10T12:00:00Z"),
    },
    {
      created: new Date("2024-02-11T12:00:00Z"),
    },
  ]);

  return { gameClasses, plotStories };
};
