import mongoose from "mongoose";

const { Schema } = mongoose;

const PlotStorySchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "1. The Floating Tower",
  },
  // storykeywords for prompt
  storyKeywords: {
    type: Array,
    required: true,
    default: [
      "text adventure",
      "The Floating Tower",
      "Forgotten Realms",
      "DandD",
      "Dungeon and Dragons",
      "Baldur's Gate",
      "Tower of Ondil",
    ],
  },
  StarterFullStories: {
    type: Array,
    required: true,
    default: [
      `Embark on an epic adventure in The Floating Tower—a tale of mystery, danger, and boundless imagination. Will you master the arcane arts as a wizard, strike from the shadows as a rogue, or wield unyielding strength as a fearless fighter?  You are a newly appointed member in the "The Blades". With the power of GEMINI and POLLINATION AI, you can craft a story uniquely your own. Every choice you make shapes the journey ahead—step into a world where your imagination knows no limits!`,
      `It was a cold, clear day still early in Marpenoth, in the Year of Many Brews.
All around, the trees' leaves had already been touched by golden and fiery-orange hues when the Brave Blades arrived at the place they had sought for so long.
Their goal loomed dark and silent above them: the Floating Tower, the lifeless fortress of the long-dead Ondil, hidden deep within a chasm somewhere west of the Horn Hills.`,
    ],
  },
  firstChoiceOptions: {
    type: Array,
    required: true,
    default: [
      "Teleport to the tower",
      "Sing a song with the Blades",
      "Drink a big glass of beer",
      "Build a campfire",
    ],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const PlotStoryModel = mongoose.model("PlotStory", PlotStorySchema);

export default PlotStoryModel;
