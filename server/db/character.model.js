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
  // storykeywords for prompt
  storykeywords: {
    type: Array,
    required: true,
    default: [
      "text adventure",
      "The Floating Tower",
      "The Floating Tower",
      "The Floating Tower",
      "Forgotten Realms",
      "D&D",
      "Dungeon and Dragons",
      "Baldur's Gate",
      "Tower of Ondil",
      "The Floating Tower",
    ],
  },
  aipictureurls: {
    type: Array,
    required: true,
    default: [],
  },
  picturekeywords: {
    type: Array,
    required: true,
    default: [],
  },
  fullStories: {
    type: Array,
    required: true,
    default: [],
  },
  firstChoiceOptions: {
    type: Array,
    required: true,
    default: ["option1", "option2", "option3", "option4"],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const CharacterModel = mongoose.model("Character", CharacterSchema);

export default CharacterModel;
