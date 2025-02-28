import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

const getFakeClassId = async (indexNumber) => {
  const response = await supertest(app).get("/gameclass");

  return response.body[indexNumber]._id;
};

test("deleteGameClass_test_01_successful delete", async () => {
  const firstElementId = await getFakeClassId(0);

  const deleteResponse = await supertest(app).delete(
    `/gameclass/${firstElementId}`
  );
  const getResponse = await supertest(app).get("/gameclass");

  expect(deleteResponse.status).toBe(410);
  expect(deleteResponse.headers["content-type"]).toMatch("application/json");
  expect(getResponse.status).toBe(200);
  expect(getResponse.body.length).toBe(1);
});

test("deleteGameClass_test_02_should respond within acceptable time", async () => {
  const start = Date.now();
  const firstElementId = await getFakeClassId(0);

  const deleteResponse = await supertest(app).delete(
    `/gameclass/${firstElementId}`
  );

  const duration = Date.now() - start;

  expect(duration).toBeLessThan(201);
  expect(deleteResponse.body).toBeDefined();
  expect(deleteResponse.status).toBe(410);
  expect(deleteResponse.headers["content-type"]).toMatch("application/json");
});

test("deleteGameClass_test_03_should return 404 with wrong htttp method ", async () => {
  const firstElementId = await getFakeClassId(0);

  const deleteResponse = await supertest(app).post(
    `/gameclass/${firstElementId}`
  );

  expect(deleteResponse.status).toBe(404);
  expect(deleteResponse.ok).toBe(false);
});

test("deleteGameClass_test_04_no id provided in the req - should return 500", async () => {
  const starterGetResponse = await supertest(app).get("/gameclass");
  const nonExistingId = "62c71b3f7f42b93b4108b7a2";
  const deleteResponse = await supertest(app).delete(
    `/gameclass/${nonExistingId}`
  );

  const getResponse = await supertest(app).get("/gameclass");

  expect(deleteResponse.status).toBe(404);
  expect(deleteResponse.body.message).toBe("Class not found");
  expect(deleteResponse.ok).toBe(false);
  expect(starterGetResponse.body.length).toBe(getResponse.body.length);
});
