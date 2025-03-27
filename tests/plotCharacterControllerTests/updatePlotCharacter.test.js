import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

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

const invalidID = "11cdafa11da11111e31b1111";

test("updatePlotCharacter_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send(testPlotCharacterData);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("updatePlotCharacter_test_02_invalid plotcharacter id", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post(`/plotcharacter/${invalidID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("Plot character not found");
});

test("updatePlotCharacter_test_03_missing data: plotcharactername ", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      charStoryKeywords: ["test", "test2"],
      personality: 2,
      pictureKeywords: ["test", "test2", "test3"],
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_04_missing data: charStoryKeywords ", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "test",
      personality: 2,
      pictureKeywords: ["test", "test2", "test3"],
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_05_missing data: personality ", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "test",
      charStoryKeywords: ["test", "test2"],
      pictureKeywords: ["test", "test2", "test3"],
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_06_missing data: pictureKeywords ", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "test",
      charStoryKeywords: ["test", "test2"],
      personality: 2,
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_07_wrong data format: charStoryKeywords is a string", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "test",
      charStoryKeywords: "testtest2",
      personality: 2,
      pictureKeywords: ["test", "test2", "test3"],
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_08_wrong data format: pictureKeywords is a string", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "test",
      charStoryKeywords: ["test", "test2"],
      personality: 2,
      pictureKeywords: "testtest2test3",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_08_wrong data format: plotcharactername is a null", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: null,
      charStoryKeywords: ["test", "test2"],
      personality: 2,
      pictureKeywords: "testtest2test3",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Invalid input data");
});

test("updatePlotCharacter_test_10_plotCharacter updated successfully", async () => {
  const token = await loginAndGetToken();
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const response = await supertest(app)
    .post(`/plotcharacter/${getresponse.body[0]._id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotCharacterName = response.body.plotcharactername;
  const updatedplotCharacterPersonality = response.body.personality;
  const updatedplotCharactercharStoryKeywords1 =
    response.body.charStoryKeywords[0];
  const updatedplotCharactercharStoryKeywords2 =
    response.body.charStoryKeywords[1];
  const updatedplotCharacterpictureKeywords1 = response.body.pictureKeywords[0];
  const updatedplotCharacterpictureKeywords2 = response.body.pictureKeywords[1];

  expect(updatedplotCharacterName).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(updatedplotCharacterPersonality).toBe(
    testPlotCharacterData.personality
  );
  expect(updatedplotCharactercharStoryKeywords1).toBe(
    testPlotCharacterData.charStoryKeywords[0]
  );
  expect(updatedplotCharactercharStoryKeywords2).toBe(
    testPlotCharacterData.charStoryKeywords[1]
  );
  expect(updatedplotCharacterpictureKeywords1).toBe(
    testPlotCharacterData.pictureKeywords[0]
  );
  expect(updatedplotCharacterpictureKeywords2).toBe(
    testPlotCharacterData.pictureKeywords[1]
  );
});
