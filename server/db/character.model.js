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
  items: {
    type: Array,
    required: true,
    default: [],
  },
  story: {
    type: Array,
    required: true,
    default: [
      "szöveges kalandjáték",
      "Forgotten Realms",
      "D&D",
      "Ondil Tornya",
      "Pengék",
    ],
    // címszavak a LLM prompthoz
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const CharacterModel = mongoose.model("Character", CharacterSchema);

export default CharacterModel;
