import mongoose from "mongoose";

const { Schema } = mongoose;

const GameClassSchema = new Schema({
  gameclassname: {
    type: String,
    required: true,
  },
  attackType: {
    type: String,
    required: true,
  },
  attack: {
    type: Number,
    required: true,
  },
  defense: {
    type: Number,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const GameClassModel = mongoose.model("GameClass", GameClassSchema);

export default GameClassModel;
