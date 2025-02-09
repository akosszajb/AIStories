import mongoose from "mongoose";

const { Schema } = mongoose;

const PlotStorySchema = new Schema({
  title: {
    type: String,
    required: true,
    default: "Default story title",
  },
  // storykeywords for prompt
  storyKeywords: {
    type: Array,
    required: true,
    default: [],
  },
  StarterFullStories: {
    type: Array,
    required: true,
    default: [],
  },
  firstChoiceOptions: {
    type: Array,
    required: true,
    default: [],
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const PlotStoryModel = mongoose.model("PlotStory", PlotStorySchema);

export default PlotStoryModel;
