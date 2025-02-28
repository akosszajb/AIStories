import "./setupEnv.js";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import router from "../server/src/routes/userRoutes.js";
import gameClassControllerRouter from "../server/src/routes/gameClassRoutes.js";
import { verifyToken } from "../server/src/middlewares/authMiddleware.js";
import GameClassModel from "../server/src/models/gameClass.model.js";

let mongoServer;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);

  // fake game class DB
  await GameClassModel.create([
    {
      gameclassname: "Fighter",
      attackType: "melee",
      attack: 50,
      defense: 50,
      created: new Date("2024-02-28T12:00:00Z"),
    },
    {
      gameclassname: "Wizard",
      attackType: "magic",
      attack: 100,
      defense: 0,
      created: new Date("2024-02-27T12:00:00Z"),
    },
  ]);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

const app = express();
app.use(express.json());

app.use("", router);
app.use("", gameClassControllerRouter);

// fake endpoint
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted!", userId: req.userId });
});

export default app;
