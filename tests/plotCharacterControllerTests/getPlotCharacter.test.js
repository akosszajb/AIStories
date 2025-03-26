import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken, getUserIdFromToken } from "../loginAndGetToken.js";

const invalidID = "11cdafa11da11111e31b1111";

test("getPlotCharacter_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .get(`/selectedplotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("getPlotCharacter_test_02_plotCharacter id is invalid", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get(`/selectedplotcharacter/${invalidID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("plotCharacter not found.");
});

test("getPlotCharacter_test_03_valid plotCharacter id should return the plotCharacter", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .get(`/selectedplotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body._id).toBe(firstCharacterID);
});
