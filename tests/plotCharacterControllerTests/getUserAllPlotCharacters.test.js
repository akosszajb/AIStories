import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken, getUserIdFromToken } from "../loginAndGetToken.js";

const invalidID = "11cdafa11da11111e31b1111";

test("getUserAllPlotCharacters_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .get(`/plotcharacterlist`)
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("getUserAllPlotCharacters_test_01_should return all plot characters", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get(`/plotcharacterlist`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.length).toBe(5);
  expect(Array.isArray(response.body)).toBe(true);
});
