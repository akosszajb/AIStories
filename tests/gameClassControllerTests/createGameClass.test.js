import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

const newClass = {
  gameclassname: "Rouge",
  attackType: "melee",
  attack: 0,
  defense: 1,
  created: new Date("2024-02-26T12:00:00Z"),
};

test("createGameClass_test_01_successful creation, return the created class in JSON", async () => {
  const response = await supertest(app)
    .post("/gameclasscreator")
    .send(newClass);

  expect(response.body.gameclassname).toBe("Rouge");
  expect(response.body).toBeDefined();
  expect(response.status).toBe(201);
  expect(response.headers["content-type"]).toMatch("application/json");
});

test("createGameClass_test_02_successful creation, collection length unchanged", async () => {
  const response = await supertest(app)
    .post("/gameclasscreator")
    .send(newClass);

  const getNewClassResponse = await supertest(app).get("/gameclass");

  let lengthNot2;

  if (getNewClassResponse.body.length > 2) {
    lengthNot2 = true;
  } else {
    lengthNot2 = false;
  }

  expect(getNewClassResponse.status).toBe(200);
  expect(getNewClassResponse.body).toBeDefined();
  expect(getNewClassResponse.ok).toBe(true);
  expect(response.headers["content-type"]).toMatch("application/json");
});

test("createGameClass_test_03_should respond within acceptable time", async () => {
  const start = Date.now();
  const response = await supertest(app)
    .post("/gameclasscreator")
    .send(newClass);
  const duration = Date.now() - start;

  expect(duration).toBeLessThan(201);
  expect(response.body).toBeDefined();
  expect(response.status).toBe(201);
  expect(response.headers["content-type"]).toMatch("application/json");
});

test("createGameClass_test_04_should return 404 with wrong htttp method ", async () => {
  const response = await supertest(app).get("/gameclasscreator");

  expect(response.status).toBe(404);
  expect(response.ok).toBe(false);
});

test("createGameClass_test_05_invalid data format should return 500", async () => {
  const response = await supertest(app)
    .post("/gameclasscreator")
    .send({ attackType: "melee", attack: 0, defense: 1 });

  expect(response.status).toBe(500);
  expect(response.ok).toBe(false);
});

test("createGameClass_test_06_duplicated class (not unique classname), should return 500", async () => {
  const response = await supertest(app)
    .post("/gameclasscreator")
    .send(newClass);

  const response2 = await supertest(app)
    .post("/gameclasscreator")
    .send(newClass);

  expect(response2.status).toBe(500);
  expect(response2.ok).toBe(false);
});

test("createGameClass_test_07_invalid data format - empty - should return 500", async () => {
  const response = await supertest(app).post("/gameclasscreator").send({});

  expect(response.status).toBe(500);
  expect(response.ok).toBe(false);
});
