import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./src/routes/userRoutes.js";
import classRoutes from "./src/routes/gameClassRoutes.js";
import plotCharacterRoutes from "./src/routes/plotCharacterRoutes.js";
import storyRoutes from "./src/routes/plotStoryRoutes.js";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
dotenv.config({ path: envPath });

const app = express();
const { MONGO_URL, PORT, GEMINIKEY } = process.env;

if (!MONGO_URL) {
  console.error("Server.js :Missing MONGO_URL environment varible!");
  process.exit(1);
}

if (!GEMINIKEY) {
  console.error("Server.js :Missing GEMINIKEY environment varible!");
  process.exit(1);
}

app.use(express.json());
app.use(
  cors({ origin: "http://localhost:5173", methods: "GET,POST,PUT,DELETE" })
);

app.get("/", async (req, res) => {
  res.status(200).send("Backend is working! - / endpoint");
});

//use routes
app.use("/api", userRoutes);
app.use("/api", classRoutes);
app.use("/api", plotCharacterRoutes);
app.use("/api", storyRoutes);

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
