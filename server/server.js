import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import ClassModel from "./db/class.model.js";
import CharacterModel from "./db/character.model.js";
import UserModel from "./db/user.model.js";

const router = express.Router();

dotenv.config();

const { MONGO_URL, PORT, JWTKEY } = process.env;

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

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "This email address is already associated with another user!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: username,
      email: email,
      password: hashedPassword,
    };

    const saved = await UserModel.create(newUser);
    console.log("Saved user:", saved.username);

    return res.status(201).json({
      status: "success",
      message: `Registration of ${username} is successful!`,
    });
  } catch (error) {
    console.error("Error creating new user:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Email or username already exists!",
      });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete user endpoint
app.delete("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ message: "All fields are required to delete a user!" });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({
        message: "This user is not registered!",
      });
    }
    const isPswMatch = await bcrypt.compare(password, existingUser.password);

    if (!isPswMatch) {
      return res.status(400).json({ message: "Password is incorrect." });
    } else {
      const deleted = await UserModel.findOneAndDelete({ email });
      console.log("Deleted user:", deleted.username);

      return res.status(200).json({
        status: "success",
        message: `${username} - user is deleted!`,
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required!" });
  }

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Username is not found!" });
    }

    const isPswMatch = await bcrypt.compare(password, user.password);

    if (!isPswMatch) {
      return res.status(400).json({ message: "Password is incorrect." });
    }

    const token = jsonwebtoken.sign(
      { userid: user._id, username: user.username },
      JWTKEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      status: "success",
      message: `Login with ${username} username was successful!`,
    });
  } catch (error) {
    console.error("Error with login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

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
