import mongoose from "mongoose";

const { Schema } = mongoose;

const GameCharacterSchema = new Schema({
  charactername: {
    type: String,
    required: true,
    default: "Default character name",
  },
  gameClass: {
    type: Schema.Types.ObjectId,
    ref: "GameClass",
    required: true,
  },
  weapon: {
    type: String,
    required: true,
    enum: ["sword", "bow", "staff", "lightsaber"],
    default: "sword",
  },
  cloth: {
    type: String,
    required: true,
    enum: ["heavy armor", "light armor", "robe", "naked"],
    default: "heavy armor",
  },
  personality: {
    type: Number,
    required: true,
    default: 50,
  },
  charStoryKeywords: {
    type: Array,
    required: true,
    default: [],
  },
  aiPictureUrls: {
    type: Array,
    required: true,
    default: [],
  },
  pictureKeywords: {
    type: Array,
    required: true,
    default: [],
  },
  fullStories: {
    type: Array,
    required: true,
    default: [],
  },
  choiceOptions: {
    type: Array,
    required: true,
    default: [],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const GameCharacterModel = mongoose.model("GameCharacter", GameCharacterSchema);

export default GameCharacterModel;
