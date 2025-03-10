import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

const testData = {
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

test("createPlotStory_test_01_stroy created succesful", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send(testData);

  const resultStructure = ["status", "message"];

  expect(Object.keys(response.body)).toEqual(
    expect.arrayContaining(resultStructure)
  );
  expect(response.status).toBe(201);
  expect(response.body.message).toBe(
    `${testData.title} plot story is created!`
  );
  expect(typeof response.body.status).toBe("string");
  expect(typeof response.body.message).toBe("string");
});

test("createPlotStory_test_02_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .post("/createplotstory")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send(testData);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("createPlotStory_test_03_title is missing, should return 400", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
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
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("All fields are required!");
});

test("createPlotStory_test_04_storyKeywords are missing, should return 400", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "testTitle",
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
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("All fields are required!");
});

test("createPlotStory_test_05_starterFullStories are missing, should return 400", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "testTitle",
      storyKeywords: ["test1", "test2", "test3"],
      StarterFullStories: "",
      firstChoiceOptions: [
        "firstChoiceOptionstest1",
        "firstChoiceOptionstest2",
        "firstChoiceOptionstest3",
        "firstChoiceOptionstest4",
      ],
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("All fields are required!");
});

test("createPlotStory_test_06_firstChoiceOptions are missing, should return 400", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/createplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "testTitle",
      storyKeywords: ["test1", "test2", "test3"],
      StarterFullStories: [
        "StarterFullStoriestest1",
        "StarterFullStoriestest2",
        "StarterFullStoriestest3",
      ],
      firstChoiceOptions: "",
    });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("All fields are required!");
});
