import supertest from "supertest";
import mongoose from "mongoose";
import app from "../setupTests.js";
import "../setupEnv.js";

describe("Server tests", () => {
  it("should return 'Backend is working!' at root endpoint", async () => {
    await mongoose.connection.once("open", async () => {
      const response = await supertest(app).get("/");

      expect(response.status).toBe(200);
      expect(response.text).toBe("Backend is working! - / endpoint");
    });
  });

  it("should return a 404 status for unknown endpoints", async () => {
    const response = await supertest(app).get("/non-existing-endpoint");
    expect(response.status).toBe(404);
  });
});

test("Check if necessary environment variables are set", () => {
  expect(process.env.MONGO_URL).toBeDefined();
  expect(process.env.GEMINIKEY).toBeDefined();
});

test("should connect to MongoDB", async () => {
  expect(mongoose.connection.readyState).toBe(1); // 1: connected
});

describe("API routes", () => {
  it("should return user data for /api/user endpoint", async () => {
    await mongoose.connection.once("open", async () => {
      const response = await supertest(app).get("/api/user");
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("data");
    });
  });
});
