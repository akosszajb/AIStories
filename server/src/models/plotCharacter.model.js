import mongoose from "mongoose";

const { Schema } = mongoose;

const PlotCharacterSchema = new Schema({
  plotcharactername: {
    type: String,
    required: true,
    default: "Default character name",
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
  selectedUserOptions: {
    type: Array,
    required: true,
    default: [],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const PlotCharacterModel = mongoose.model("PlotCharacter", PlotCharacterSchema);

export default PlotCharacterModel;
