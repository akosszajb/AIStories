import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken, getUserIdFromToken } from "../loginAndGetToken.js";

const invalidID = "11cdafa11da11111e31b1111";

test("deletePlotCharacter_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .delete(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("deletePlotCharacter_test_02_invalid plotcharacter id", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .delete(`/plotcharacter/${invalidID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("Plot character is not found!");
});

test("deletePlotCharacter_test_03_successful delete", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const characterId = getresponse.body[0]._id;

  const response = await supertest(app)
    .delete(`/plotcharacter/${characterId}`)
    .set("Authorization", `Bearer ${token}`);

  const checkResponse = await supertest(app)
    .get(`/plotcharacter/${characterId}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(410);
  expect(checkResponse.status).toBe(404);
});
