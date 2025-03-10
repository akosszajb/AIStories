import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken, getUserIdFromToken } from "../loginAndGetToken.js";
import UserModel from "../../server/src/models/user.model.js";
import PlotCharacterModel from "../../server/src/models/plotCharacter.model.js";

test("generatePlotStoryAndPicture_test_01_should return the selected plot story", async () => {
  const token = await loginAndGetToken();
  const testInput = "Green apple with yellow banana";
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];

  const response = await supertest(app)
    .post("/generate-plotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ plotCharacterID: firstPlotCharacterId, input: testInput });

  expect(response.body.text).toBeDefined();
  expect(response.body.generatedPicture).toBeDefined();
  expect(response.body.buttonText1).toBeDefined();
  expect(response.body.buttonText1).not.toBe("testOption1");
  expect(response.body.buttonText2).toBeDefined();
  expect(response.body.buttonText2).not.toBe("testOption2");
  expect(response.body.buttonText3).toBeDefined();
  expect(response.body.buttonText3).not.toBe("testOption3");
  expect(response.body.buttonText4).toBeDefined();
  expect(response.body.buttonText4).not.toBe("testOption4");
});

test("generatePlotStoryAndPicture_test_02_should be updated: plotCharacter: selectedUserOptions, fullStories, pictureKeywords, aiPictureUrls", async () => {
  const token = await loginAndGetToken();
  const testInput = "Green apple with yellow banana";
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];
  const firstPlotCharacter = await PlotCharacterModel.findById(
    firstPlotCharacterId
  );
  const selectedUserOptions = firstPlotCharacter.selectedUserOptions;
  const fullStories = firstPlotCharacter.fullStories;
  const pictureKeywords = firstPlotCharacter.pictureKeywords;
  const aiPictureUrls = firstPlotCharacter.aiPictureUrls;

  const response = await supertest(app)
    .post("/generate-plotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ plotCharacterID: firstPlotCharacterId, input: testInput });

  const updatedFirstPlotCharacter = await PlotCharacterModel.findById(
    firstPlotCharacterId
  );

  const updatedSelectedUserOptions =
    updatedFirstPlotCharacter.selectedUserOptions;
  const updatedFullStories = updatedFirstPlotCharacter.fullStories;
  const updatedPictureKeywords = updatedFirstPlotCharacter.pictureKeywords;
  const updatedAiPictureUrls = updatedFirstPlotCharacter.aiPictureUrls;

  const isSelectedUserOptionsUpdated =
    JSON.stringify(selectedUserOptions) !==
    JSON.stringify(updatedSelectedUserOptions);
  const isFullStoriesUpdated =
    JSON.stringify(fullStories) !== JSON.stringify(updatedFullStories);
  const isPictureKeywordsUpdated =
    JSON.stringify(pictureKeywords) !== JSON.stringify(updatedPictureKeywords);
  const isAiPictureUrlsUpdated =
    JSON.stringify(aiPictureUrls) !== JSON.stringify(updatedAiPictureUrls);

  const expectedKeys = [
    "text",
    "generatedPicture",
    "buttonText1",
    "buttonText2",
    "buttonText3",
    "buttonText4",
  ];

  expect(Object.keys(response.body)).toEqual(
    expect.arrayContaining(expectedKeys)
  );
  expect(response.body.text).toBeDefined();
  expect(response.body.generatedPicture).toBeDefined();
  expect(response.body.buttonText1).toBeDefined();
  expect(response.body.buttonText1).not.toBe("testOption1");
  expect(response.body.buttonText2).toBeDefined();
  expect(response.body.buttonText2).not.toBe("testOption2");
  expect(response.body.buttonText3).toBeDefined();
  expect(response.body.buttonText3).not.toBe("testOption3");
  expect(response.body.buttonText4).toBeDefined();
  expect(response.body.buttonText4).not.toBe("testOption4");
  expect(isSelectedUserOptionsUpdated).toBe(true);
  expect(isFullStoriesUpdated).toBe(true);
  expect(isPictureKeywordsUpdated).toBe(true);
  expect(isAiPictureUrlsUpdated).toBe(true);
});

test("generatePlotStoryAndPicture_test_03_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();
  const testInput = "Green apple with yellow banana";
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];

  const response = await supertest(app)
    .post("/generate-plotstory")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send({ plotCharacterID: firstPlotCharacterId, input: testInput });

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("generatePlotStoryAndPicture_test_04_plot character not found should return 404", async () => {
  const token = await loginAndGetToken();
  const testInput = "Green apple with yellow banana";
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);

  const response = await supertest(app)
    .post("/generate-plotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ plotCharacterID: "11cdafa11da11111e31b1111", input: testInput });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("plotCharacter not found!");
});

test("generatePlotStoryAndPicture_test_05_plot character missing should return 400", async () => {
  const token = await loginAndGetToken();
  const testInput = "Green apple with yellow banana";
  const userId = await getUserIdFromToken(token);

  const response = await supertest(app)
    .post("/generate-plotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ plotCharacterID: "", input: testInput });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("plotCharacterID is missing.");
});

test("generatePlotStoryAndPicture_test_06_input/prompt not found should return 400", async () => {
  const token = await loginAndGetToken();
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];

  const response = await supertest(app)
    .post("/generate-plotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ plotCharacterID: firstPlotCharacterId, input: "" });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Prompt is missing.");
});
