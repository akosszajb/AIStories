import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

test("getPlotStoryList_test_01_should return title-_id list", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const isListNotEmpty = response.body.length > 0;

  expect(response.body).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.headers["content-type"]).toMatch("application/json");
  expect(isListNotEmpty).toBe(true);
});

test("getPlotStoryList_test_02_should return 404 if no plot stories", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const delete1 = await supertest(app)
    .delete("/deleteselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: response.body[0]._id });

  const delete2 = await supertest(app)
    .delete("/deleteselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: response.body[1]._id });

  const emptyResponse = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  expect(emptyResponse.status).toBe(404);
  expect(emptyResponse.body.message).toBe("Plot stories not found!");
});

test("getPlotStoryList_test_04_should return 404 if no plot stories", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});
