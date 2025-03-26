import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken, getUserIdFromToken } from "../loginAndGetToken.js";
import UserModel from "../../server/src/models/user.model.js";
import PlotCharacterModel from "../../server/src/models/plotCharacter.model.js";

test("getSelectedPlotStory_test_01_should return the selected plot story", async () => {
  const token = await loginAndGetToken();
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];

  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const firstPlotStoryID = response.body[0]._id;

  const selectedPlotStoryResponse = await supertest(app)
    .post("/selectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotCharacterID: firstPlotCharacterId,
      selectedPlotStoryID: firstPlotStoryID,
    });

  console.log(selectedPlotStoryResponse.body);

  expect(selectedPlotStoryResponse.body).toBeDefined();
  expect(selectedPlotStoryResponse.body.plotstories).toBeDefined();
  expect(selectedPlotStoryResponse.body.buttonText1).toBe("testOption1");
  expect(selectedPlotStoryResponse.body.buttonText2).toBe("testOption2");
  expect(selectedPlotStoryResponse.body.buttonText3).toBe("testOption3");
  expect(selectedPlotStoryResponse.body.buttonText4).toBe("testOption4");
});

test("getSelectedPlotStory_test_02_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("getSelectedPlotStory_test_03_plot character not found should return 404", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const firstPlotStoryID = response.body[0]._id;

  const selectedPlotStoryResponse = await supertest(app)
    .post("/selectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotCharacterID: "11cdafa11da11111e31b1111",
      selectedPlotStoryID: firstPlotStoryID,
    });
  expect(selectedPlotStoryResponse.status).toBe(404);
  expect(selectedPlotStoryResponse.body.message).toBe(
    "Plot character not found"
  );
});

test("getSelectedPlotStory_test_04_plot story not found should return 404", async () => {
  const token = await loginAndGetToken();
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];

  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const firstPlotStoryID = response.body[0]._id;

  const selectedPlotStoryResponse = await supertest(app)
    .post("/selectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotCharacterID: firstPlotCharacterId,
      selectedPlotStoryID: "11cdafa11da11111e31b1111",
    });

  expect(selectedPlotStoryResponse.status).toBe(404);
  expect(selectedPlotStoryResponse.body.message).toBe("Plot story not found");
});

test("getSelectedPlotStory_test_05_user's fullStories should be updated", async () => {
  const token = await loginAndGetToken();
  const userId = await getUserIdFromToken(token);
  const user = await UserModel.findById(userId);
  const firstPlotCharacterId = user.plotCharacter[0];
  const plotCharacter = await PlotCharacterModel.findById(firstPlotCharacterId);
  const originalFullstories = plotCharacter.fullStories.join("");

  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const firstPlotStoryID = response.body[0]._id;

  const selectedPlotStoryResponse = await supertest(app)
    .post("/selectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotCharacterID: firstPlotCharacterId,
      selectedPlotStoryID: firstPlotStoryID,
    });

  const updatedUser = await UserModel.findById(userId);
  const updatedfirstPlotCharacterId = updatedUser.plotCharacter[0];
  const updatedplotCharacter = await PlotCharacterModel.findById(
    updatedfirstPlotCharacterId
  );
  const updatedFullstories = updatedplotCharacter.fullStories.join("");

  const isNotEqual = updatedFullstories === originalFullstories;
  console.log("originalFullstories" + originalFullstories);
  console.log("updatedFullstories" + updatedFullstories);
  console.log("isNotEqual: " + isNotEqual);

  expect(isNotEqual).toBe(false);
  expect(originalFullstories).toBe("");
  expect(updatedFullstories).toBe("Starter story1Starter story 2");
});
