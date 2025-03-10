import "./setupEnv.js";
import express from "express";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import router from "../server/src/routes/userRoutes.js";
import gameClassControllerRouter from "../server/src/routes/gameClassRoutes.js";
import { verifyToken } from "../server/src/middlewares/authMiddleware.js";
import plotStoryRouter from "../server/src/routes/plotStoryRoutes.js";
import { fakeDataBaseCreator } from "./fakeDataBaseCreator.js";

let mongoServer;

const app = express();
app.use(express.json());

app.use("", router);
app.use("", gameClassControllerRouter);
app.use("", plotStoryRouter);

// fake endpoint
app.get("/protected", verifyToken, (req, res) => {
  res.status(200).json({ message: "Access granted!", userId: req.userId });
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await fakeDataBaseCreator();

  console.error = jest.fn();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }

  await fakeDataBaseCreator();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();

  // turn on console.error-s
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }
});

export default app;
