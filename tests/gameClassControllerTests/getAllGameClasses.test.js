import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

test("getAllGameClasses_test_01_get all game classes", async () => {
  const response = await supertest(app).get("/gameclass");

  let notZeroLength;

  if (response.body.length > 0) {
    notZeroLength = true;
  } else {
    notZeroLength = false;
  }

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(notZeroLength).toBe(true);
});

test("getAllGameClasses_test_02_get all game classes in right order", async () => {
  const response = await supertest(app).get("/gameclass");

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body[0].gameclassname).toBe("Fighter");
  expect(response.body[1].gameclassname).toBe("Wizard");
});

test("getAllGameClasses_test_03_should return 404 with wrong htttp method ", async () => {
  const response = await supertest(app).post("/gameclass");

  expect(response.status).toBe(404);
  expect(response.ok).toBe(false);
});

test("getAllGameClasses_test_04_should return in JSON format", async () => {
  const response = await supertest(app).get("/gameclass");

  expect(response.status).toBe(200);
  expect(response.ok).toBe(true);
  expect(response.headers["content-type"]).toMatch("application/json");
});

test("getAllGameClasses_test_05_should respond within acceptable time", async () => {
  const start = Date.now();
  const response = await supertest(app).get("/gameclass");
  const duration = Date.now() - start;

  expect(response.status).toBe(200);
  expect(duration).toBeLessThan(200);
});
