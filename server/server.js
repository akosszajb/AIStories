import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import ClassModel from "./db/class.model.js";

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

//ENDPOINTS
app.get("/", async (req, res) => {
  res.send("Backend is working! - / endpoint");
});

app.get("/api/classes", async (req, res) => {
  const classes = await ClassModel.find().sort({ created: "desc" });
  return res.json(classes);
});

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
