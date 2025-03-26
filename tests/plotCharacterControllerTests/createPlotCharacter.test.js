import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken, getUserIdFromToken } from "../loginAndGetToken.js";

const testPlotCharacterData = {
  plotcharactername: "Test Character",
  personality: 12,
  charStoryKeywords: [
    "Test",
    "Testing",
    "Unit test",
    "Coverage",
    "Green",
    "Jest",
  ],
  aiPictureUrls: [],
  pictureKeywords: ["test", "green", "computer", "jest"],
  fullStories: [],
  selectedUserOptions: [],
};

test("createPlotCharacter_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .post("/createplotcharacter")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send(testPlotCharacterData);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("createPlotCharacter_test_02_successful creation", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotcharacter")
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const defaultPlotCharacterArrayLengthIncreased =
    6 === response.body.plotCharacter.length;

  expect(defaultPlotCharacterArrayLengthIncreased).toBe(true);
  expect(response.status).toBe(201);
  expect(response.body).toBeDefined();
  expect(response.body.plotCharacter).toBeDefined();
});

test("reatePlotCharacter_test_03_unsuccessful creation - no data provided", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotcharacter")
    .set("Authorization", `Bearer ${token}`)
    .send("");

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const defaultCharacter = getresponse.body.find(
    (character) => character.plotcharactername === "Default character name"
  );

  expect(defaultCharacter).toBeDefined();
  expect(defaultCharacter.plotcharactername).toBe("Default character name");
});

test("createPlotCharacter_test_04_invalid data format", async () => {
  const token = await loginAndGetToken();

  const invalidData = {
    personality: 12,
    charStoryKeywords: ["Test", "Invalid"],
  };

  const response = await supertest(app)
    .post("/createplotcharacter")
    .set("Authorization", `Bearer ${token}`)
    .send(invalidData);

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const defaultCharacter = getresponse.body.find(
    (character) => character.plotcharactername === "Default character name"
  );
  expect(response.status).toBe(201);
  expect(defaultCharacter).toBeDefined();
  expect(defaultCharacter.plotcharactername).toBe("Default character name");
});
