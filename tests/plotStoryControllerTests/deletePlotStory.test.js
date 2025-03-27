import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

test("deletePlotStory_test_01_should delete plot story from plot stories", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const deleted = await supertest(app)
    .delete("/deleteselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: response.body[0]._id });

  const response2 = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const isStoryDeleted = response.body.length === response2.body.length;

  expect(response.body).toBeDefined();
  expect(response.status).toBe(200);
  expect(response.headers["content-type"]).toMatch("application/json");
  expect(isStoryDeleted).toBe(false);

  expect(response2.body).toBeDefined();
  expect(response2.status).toBe(200);
  expect(response2.headers["content-type"]).toMatch("application/json");
  expect(response2.body.length).toBe(1);
});

test("deletePlotStory_test_02_should return 400 error msg when _id not provided", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const delete1 = await supertest(app)
    .delete("/deleteselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: "" });

  const response2 = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const isStoryNotDeleted = response.body.length === response2.body.length;

  expect(delete1.body.message).toBe(
    "Plot Story _id is required (deletePlotStory)"
  );
  expect(delete1.status).toBe(400);
  expect(delete1.headers["content-type"]).toMatch("application/json");
  expect(isStoryNotDeleted).toBe(true);

  expect(response2.body).toBeDefined();
  expect(response2.status).toBe(200);
  expect(response2.headers["content-type"]).toMatch("application/json");
  expect(response2.body.length).toBe(2);
});

test("deletePlotStory_test_03_should return 404 error msg when wrong _id provided", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const delete1 = await supertest(app)
    .delete("/deleteselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: "11cdafa11da11111e31b1111" });

  const response2 = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const isStoryNotDeleted = response.body.length === response2.body.length;

  expect(delete1.body.message).toBe("Plot Story is not found.");
  expect(delete1.status).toBe(404);
  expect(delete1.headers["content-type"]).toMatch("application/json");
  expect(isStoryNotDeleted).toBe(true);

  expect(response2.body).toBeDefined();
  expect(response2.status).toBe(200);
  expect(response2.headers["content-type"]).toMatch("application/json");
  expect(response2.body.length).toBe(2);
});

test("deletePlotStory_test_04_should return 500 error msg when _id provided in wrong format", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const delete1 = await supertest(app)
    .delete("/deleteselectedplotstory")
    .set("Authorization", `Bearer ${token}`)
    .send({ _id: "wrongidformat" });

  const response2 = await supertest(app)
    .get("/plotstorieslist")
    .set("Authorization", `Bearer ${token}`);

  const isStoryNotDeleted = response.body.length === response2.body.length;

  expect(delete1.body.message).toBe("Internal Server Error");
  expect(delete1.status).toBe(500);
  expect(delete1.headers["content-type"]).toMatch("application/json");
  expect(isStoryNotDeleted).toBe(true);

  expect(response2.body).toBeDefined();
  expect(response2.status).toBe(200);
  expect(response2.headers["content-type"]).toMatch("application/json");
  expect(response2.body.length).toBe(2);
});
