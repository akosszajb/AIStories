import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

const newClass = {
  gameclassname: "Bingo",
  attackType: "melee",
  attack: 0,
  defense: 1,
  created: new Date("2024-02-26T12:00:00Z"),
};

const getFakeClassId = async (indexNumber) => {
  const response = await supertest(app).get("/gameclass");

  return response.body[indexNumber]._id;
};

test("updateGameClass_test_01_successful update, return the updated class in JSON", async () => {
  const getFirstResponse = await supertest(app).get("/gameclass");
  const firstElementId = await getFakeClassId(0);

  const updateResponse = await supertest(app)
    .patch(`/gameclass/${firstElementId}`)
    .send(newClass);

  const getResponse = await supertest(app).get("/gameclass");

  expect(updateResponse.status).toBe(200);
  expect(updateResponse.body.gameclassname).toBe(newClass.gameclassname);
  expect(updateResponse.headers["content-type"]).toMatch("application/json");
  expect(getResponse.status).toBe(200);
  expect(getFirstResponse.body.length).toBe(getResponse.body.length);
});

test("updateGameClass_test_02_should respond within acceptable time", async () => {
  const start = Date.now();
  const firstElementId = await getFakeClassId(0);

  const updateResponse = await supertest(app)
    .patch(`/gameclass/${firstElementId}`)
    .send(newClass);

  const duration = Date.now() - start;

  expect(duration).toBeLessThan(201);
  expect(updateResponse.body).toBeDefined();
  expect(updateResponse.status).toBe(200);
  expect(updateResponse.headers["content-type"]).toMatch("application/json");
});

test("updateGameClass_test_03_should return 404 with wrong htttp method ", async () => {
  const firstElementId = await getFakeClassId(0);

  const updateResponse = await supertest(app)
    .post(`/gameclass/${firstElementId}`)
    .send(newClass);

  expect(updateResponse.status).toBe(404);
  expect(updateResponse.ok).toBe(false);
});

test("updateGameClass_test_04_duplicated class (not unique classname), should return 500", async () => {
  const firstElementId = await getFakeClassId(0);
  const secondElementId = await getFakeClassId(1);

  const updateResponse = await supertest(app)
    .patch(`/gameclass/${firstElementId}`)
    .send(newClass);

  const updateResponse2 = await supertest(app)
    .patch(`/gameclass/${secondElementId}`)
    .send(newClass);

  console.log(updateResponse2.body);
  expect(updateResponse2.status).toBe(500);
  expect(updateResponse2.ok).toBe(false);
});

test("updateGameClass_test_05_invalid data format - empty -  should return 500", async () => {
  const firstElementId = await getFakeClassId(0);

  const updateResponse = await supertest(app)
    .patch(`/gameclass/${firstElementId}`)
    .send({});

  const getResponse = await supertest(app).get("/gameclass");
  console.log(updateResponse.body);
  console.log(getResponse.body);

  expect(updateResponse.status).toBe(400);
  expect(updateResponse.body.message).toBe(
    "At least one field is required to update!"
  );
  expect(updateResponse.ok).toBe(false);
});
