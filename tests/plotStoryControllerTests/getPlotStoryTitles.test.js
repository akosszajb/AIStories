import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

test("getPlotStoryTitles_test_01_should return the titles array", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  expect(response.body).toBeDefined();
  expect(response.body[0]._id).toBeDefined();
  expect(response.body[1]._id).toBeDefined();
  expect(response.body[0].title).toBeDefined();
  expect(response.body[1].title).toBeDefined();
});

test("getPlotStoryTitles_test_02_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});
