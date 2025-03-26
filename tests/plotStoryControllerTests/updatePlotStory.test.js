import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

test("updatePlotStory_test_01_should update the selected plot story", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: id_0 });

  const defaultData = getSelectedPlotStoryToModifyResponse.body;

  const updateData = {
    _id: id_0,
    title: "testTitle",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const updatedPlotStoryTitle = updateResponse.body.title;
  const updatedPlotStoryStoryKeywords = updateResponse.body.storyKeywords;
  const updatedPlotStoryStarterFullStories =
    updateResponse.body.StarterFullStories;
  const updatedPlotStoryFirstChoiceOptions =
    updateResponse.body.firstChoiceOptions;

  const isTitleUpdated = updatedPlotStoryTitle !== defaultData.title;
  const isStoryStoryKeywordsUpdated =
    JSON.stringify(updatedPlotStoryStoryKeywords) !==
    JSON.stringify(defaultData.storyKeywords);
  const isStarterFullStoriesUpdated =
    JSON.stringify(updatedPlotStoryStarterFullStories) !==
    JSON.stringify(defaultData.StarterFullStories);
  const isFirstChoiceOptionsUpdated =
    JSON.stringify(updatedPlotStoryFirstChoiceOptions) !==
    JSON.stringify(defaultData.firstChoiceOptions);

  const resultStructure = [
    "_id",
    "title",
    "storyKeywords",
    "StarterFullStories",
    "firstChoiceOptions",
    "created",
  ];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );

  expect(isTitleUpdated).toBe(true);
  expect(isStoryStoryKeywordsUpdated).toBe(true);
  expect(isStarterFullStoriesUpdated).toBe(true);
  expect(isFirstChoiceOptionsUpdated).toBe(true);
});

test("updatePlotStory_test_02_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();
  const updateData = {
    _id: "id_0",
    title: "testTitle",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send(updateData);

  expect(updateResponse.status).toBe(403);
  expect(updateResponse.body.message).toBe("Failed to authenticate token!!!!");
});

test("updatePlotStory_test_03_plot story _id is missing, should return 400", async () => {
  const token = await loginAndGetToken();

  const updateData = {
    _id: "",
    title: "testTitle",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const resultStructure = ["message"];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );

  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.message).toBe(
    "Plot Story _id is required (updatePlotStory)"
  );
});

test("updatePlotStory_test_04_plot story title is missing, should return 400", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: id_0 });

  const updateData = {
    _id: id_0,
    title: "",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const resultStructure = ["message"];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );
  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.message).toBe("Plot Story title is required");
});

test("updatePlotStory_test_05_plot story storyKeywords are missing, should return 400", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: id_0 });

  const updateData = {
    _id: id_0,
    title: "test",
    storyKeywords: "",
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const resultStructure = ["message"];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );

  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.message).toBe(
    "Plot Story storyKeywords are required"
  );
});

test("updatePlotStory_test_06_plot story StarterFullStories are missing, should return 400", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: id_0 });

  const updateData = {
    _id: id_0,
    title: "test",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: "",
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const resultStructure = ["message"];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );
  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.message).toBe(
    "Plot Story StarterFullStories are required"
  );
});

test("updatePlotStory_test_07_plot story firstChoiceOptions are missing, should return 400", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorytitles")
    .set("Authorization", `Bearer ${token}`);

  const id_0 = response.body[0]._id;

  const getSelectedPlotStoryToModifyResponse = await supertest(app)
    .post("/selectedplotstorytomodify")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: id_0 });

  const updateData = {
    _id: id_0,
    title: "test",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: "",
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const resultStructure = ["message"];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );
  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.message).toBe(
    "Plot Story firstChoiceOptions are required"
  );
});

test("updatePlotStory_test_07_plot story _id is wrond, should return 404", async () => {
  const token = await loginAndGetToken();

  const updateData = {
    _id: "11cdafa11da11111e31b1111",
    title: "test",
    storyKeywords: ["test1", "test2", "test3"],
    StarterFullStories: [
      "StarterFullStoriestest1",
      "StarterFullStoriestest2",
      "StarterFullStoriestest3",
    ],
    firstChoiceOptions: [
      "firstChoiceOptionstest1",
      "firstChoiceOptionstest2",
      "firstChoiceOptionstest3",
      "firstChoiceOptionstest4",
    ],
  };

  const updateResponse = await supertest(app)
    .post("/updateselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(updateData);

  const resultStructure = ["message"];

  expect(Object.keys(updateResponse.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );

  expect(updateResponse.status).toBe(404);
  expect(updateResponse.body.message).toBe("plot Story is not found!");
});
