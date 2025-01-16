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

const CharacterModel = mongoose.model("Character", CharacterSchema);

export default CharacterModel;
