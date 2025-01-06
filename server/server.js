import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ClassModel from "./db/class.model.js";
import CharacterModel from "./db/character.model.js";

const router = express.Router();

dotenv.config();

const { MONGO_URL, PORT } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(cors());

//ENDPOINTS ---------------------------
app.get("/", async (req, res) => {
  res.send("Backend is working! - / endpoint");
});

// Class endpoints
app.get("/api/class", async (req, res) => {
  try {
    const classes = await ClassModel.find().sort({ created: "desc" });
    return res.status(200).json(classes);
  } catch (error) {
    console.error("Error with class GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/classcreator", async (req, res) => {
  const newClass = req.body;
  try {
    const saved = await ClassModel.create(newClass);
    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating new class:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/class/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedClass = await ClassModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.status(204).json(updatedClass);
  } catch (error) {
    console.error(`Error with /api/class/${id} PATCH endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("api/class/:id", async (req, res) => {
  try {
    const deleted = await ClassModel.deleteOne({ _id: req.params.id });
    return res.status(410).json(deleted);
    return;
  } catch (error) {
    console.error(`Error with /api/class/${id} DELETE endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Character endpoints
app.get("/api/charachter", async (req, res) => {
  try {
    const characters = await CharacterModel.find().sort({ created: "desc" });
    return res.status(200).json(characters);
  } catch (error) {
    console.error("Error with character GET endpoint:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/charactercreator", async (req, res) => {
  const newCharacter = req.body;
  try {
    const saved = await CharacterModel.create(newCharacter);
    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating new character:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/api/character/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const updatedCharacter = await CharacterModel.findOneAndUpdate(
      { _id: id },
      { $set: { ...req.body } },
      { new: true }
    );
    return res.status(204).json(updatedCharacter);
  } catch (error) {
    console.error(`Error with /api/character/${id} PATCH endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("api/character/:id", async (req, res) => {
  try {
    const deleted = await CharacterModel.deleteOne({ _id: req.params.id });
    return res.status(410).json(deleted);
    return;
  } catch (error) {
    console.error(`Error with /api/character/${id} DELETE endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Registration endpoint

// app.post("/api/registration", async (req, res) => {
//   const newCharacter = req.body;
//   try {
//     const saved = await CharacterModel.create(newCharacter);
//     return res.status(201).json(saved);
//   } catch (error) {
//     console.error("Error creating new character:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//ENDPOINTS ---------------------------
const main = async () => {
  await mongoose.connect(MONGO_URL);

  app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
    console.log("Try / endpoint right now!");
  });
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
