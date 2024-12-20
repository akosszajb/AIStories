import mongoose from "mongoose";

const { Schema } = mongoose;

const ClassSchema = new Schema({
  name: {
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
  items: { type: Array, required: true, default: [] },
  created: {
    type: Date,
    default: Date.now,
  },
});

const ClassModel = mongoose.model("Class", ClassSchema);

export default ClassModel;
