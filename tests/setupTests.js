import "./setupEnv.js";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import router from "../server/src/routes/userRoutes.js";
import { verifyToken } from "../server/src/middlewares/authMiddleware.js";

let mongoServer;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

afterEach(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

const app = express();
app.use(express.json());

app.use("", router);

// fake endpoint
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted!", userId: req.userId });
});

export default app;
