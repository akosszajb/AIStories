import mongoose from "mongoose";

const { Schema } = mongoose;

const CharacterSchema = new Schema({
  name: {
    type: String,
    required: true,
    default: "Default character name",
  },
  class: {
    type: Schema.Types.ObjectId,
    ref: "Class",
    required: true,
  },
  weapon: {
    type: String,
    required: true,
    enum: ["sword", "bow", "staff"],
    default: "sword",
  },
  cloth: {
    type: String,
    required: true,
    enum: ["heavy armor", "light armor", "robe"],
    default: "heavy armor",
  },
  personality: {
    type: Number,
    required: true,
    default: 50,
  },
  storyheadlines: {
    type: Array,
    required: true,
    default: [
      "text adventure game",
      "Forgotten Realms",
      "D&D",
      "Dungeon and Dragons",
      "Baldur's Gate",
      "Tower of Ondil",
      "The Floating Tower",
      "Member of the Blades",
      "Magic",
      "Wizards",
      "Dragons",
      "Tombs",
      "Resurrection",
      "Fate",
      "Enchantment",
      "Prophecy",
      "Secrets",
      "Adventure",
      "Floating Tower",
      "Brave Blades",
      "Elmara",
      "Winter Studies",
      "Bright Shields",
      "Mystra's Priestess",
      "Summer Adventures",
      "Griffon Fortress",
      "Tower's Wait",
      "Rising Rope",
      "Tarthe's Resolve",
      "Ithym's Sarcasm",
      "Magic Orbs",
      "Priest's Determination",
      "Gralkyn's Cynicism",
      "Strategic Search",
      "Spells",
      "Magical Sacrifice",
      "Flight",
      "Historical Magic",
      "Mage's Power",
      "Blades' Loyalty",
      "Blue Flame",
      "Tomb Secrets",
      "Dragons",
      "Wizards' Ethics",
      "Resurrection Rites",
      "Magic Books",
      "Sword & Magic",
      "Gods & Temples",
      "Illusions",
      "Magic Evolution",
      "Time Manipulation",
      "Magical Weapons",
      "Spirit Realm",
      "Crypts",
      "Wizard's Learning",
      "Light vs Dark",
      "Adventurer's Tales",
    ],
    // címszavak a LLM prompthoz
  },
  fullStories: {
    type: Array,
    required: true,
    default: [
      `It was a cold, clear day still early in Marpenoth, in the Year of Many Brews.
    All around, the trees' leaves had already been touched by golden and fiery-orange hues when the Brave Blades arrived at the place they had sought for so long.
    Their goal loomed dark and silent above them: the Floating Tower, the lifeless fortress of the long-dead Ondil, hidden deep within a chasm somewhere west of the Horn Hills. Ondil's tower hovered patiently, as it had for centuries, under the protection of a dreaded wizard.`,
      `The Blades looked up, then away into the distance — except for "player's name," who stood with a "first item - weapon" raised defiantly and sized up the silently waiting   tower from beneath their "second item (e.g., hat).`,
      `Become an adventurer in the The Floating Tower Story. Be a wizard, rouge or fighter! Explore the Forgotten Realms while you meet monsters and bandits and become a renowned Adventurer across the world! You are a newly appointed member in the "The Blades"`,
    ],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const CharacterModel = mongoose.model("Character", CharacterSchema);

export default CharacterModel;
