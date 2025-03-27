import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

test("getSelectedPlotStoryToModify_test_01_should return the selected plot story", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;
  const title_0 = response.body[0].title;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: id_0 });

  expect(getSelectedPlotStoryToModifyResponse.body.title).toBe(title_0);
  expect(getSelectedPlotStoryToModifyResponse.body._id).toBe(id_0);
  expect(getSelectedPlotStoryToModifyResponse.body).toHaveProperty("_id");
  expect(getSelectedPlotStoryToModifyResponse.body).toHaveProperty("title");
  expect(getSelectedPlotStoryToModifyResponse.body).toHaveProperty(
    "storyKeywords"
  );
  expect(getSelectedPlotStoryToModifyResponse.body).toHaveProperty(
    "StarterFullStories"
  );
  expect(getSelectedPlotStoryToModifyResponse.body).toHaveProperty(
    "firstChoiceOptions"
  );
  expect(getSelectedPlotStoryToModifyResponse.body).toHaveProperty("created");
});

test("getSelectedPlotStoryToModify_test_02_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send({ _id: id_0 });

  expect(getSelectedPlotStoryToModifyResponse.status).toBe(403);
  expect(getSelectedPlotStoryToModifyResponse.body.message).toBe(
    "Failed to authenticate token!!!!"
  );
});

test("getSelectedPlotStoryToModify_test_02_plot story _id is missing should return 400", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: "" });

  expect(getSelectedPlotStoryToModifyResponse.body.message).toBe(
    "Plot Story _id is required (getSelectedPlotStoryToModify)"
  );
  expect(getSelectedPlotStoryToModifyResponse.status).toBe(400);
});

test("getSelectedPlotStoryToModify_test_02_plot story _id is wrong should return 404", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: "11cdafa11da11111e31b1111" });

  expect(getSelectedPlotStoryToModifyResponse.body.message).toBe(
    "Plot story not found"
  );
  expect(getSelectedPlotStoryToModifyResponse.status).toBe(404);
});
