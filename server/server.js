import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jsonwebtoken from "jsonwebtoken";
import ClassModel from "./db/class.model.js";
import CharacterModel from "./db/character.model.js";
import UserModel from "./db/user.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

dotenv.config();

const { MONGO_URL, PORT, JWTKEY, GEMINIKEY } = process.env;

if (!MONGO_URL) {
  console.error("Missing MONGO_URL environment varible!");
  process.exit(1);
}

if (!GEMINIKEY) {
  console.error("Missing GEMINIKEY environment varible!");
  process.exit(1);
}

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
};

const genAI = new GoogleGenerativeAI(GEMINIKEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
app.use(express.json());
app.use(cors(corsOptions));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided!" });
  }

  jsonwebtoken.verify(token, JWTKEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token." });
    }
    req.userId = decoded.userid;
    next();
  });
};

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
  } catch (error) {
    console.error(`Error with /api/class/${id} DELETE endpoint:`, error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Character endpoints
app.get("/api/characterlist", verifyToken, async (req, res) => {
  const userId = req.userId;

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const character = await CharacterModel.findById(user.character);

    return res.status(200).json(character);
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
        message: "Username already exists!",
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
      token: token,
      status: "success",
      message: `Login with ${username} username was successful!`,
    });
  } catch (error) {
    console.error("Error with login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// AI generated stories and pictures endpoints

// AI generated text by gemini with user input
app.post("/api/generate-story", verifyToken, async (req, res) => {
  const userId = req.userId;
  const input = req.body.prompt;
  console.log(input);

  try {
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing." });
    }
    if (!input) {
      return res.status(400).json({ message: "Prompt is missing." });
    }
    const user = await UserModel.findById(userId);

    const character = await CharacterModel.findById(user.character[0]);

    let story = "";
    character.fullStories.forEach((element) => {
      story += element;
    });

    const AIprompt =
      "This is just a starter prompt, I am learning the communication with you. I created a text-adventure game with the starter story: " +
      story +
      "And these are some headlines to help you to create the next part of the story" +
      character.storyheadlines.join() +
      "After this scene the player give you this direction to move his character: " +
      input +
      "Can you give short answer, continue this story? (max 40 words) As a book.";

    const result = await model.generateContent(AIprompt);
    console.log("Result from AI:", result);

    const generatedText = result.response.text();

    if (!generatedText) {
      throw new Error("AI did not return any response.");
    }

    character.fullStories.push(generatedText);
    await character.save();
    res.status(200).json({ text: generatedText });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
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
