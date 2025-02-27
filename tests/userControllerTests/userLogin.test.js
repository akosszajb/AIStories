import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import jwt from "jsonwebtoken";

const registrateBeforeLogin = async () => {
  const username = "01_testuser";
  const password = "password1";
  const regResponse = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(regResponse.status).toBe(201);
  expect(regResponse.body.status).toBe("success");
  expect(regResponse.body.message).toBe(
    `Registration of ${username} is successful!`
  );
  return regResponse;
};

// database tests
test("userLogin_test_01_Valid username and password - successful login", async () => {
  await registrateBeforeLogin();

  const loginResponse = await supertest(app).post("/login").send({
    username: "01_testuser",
    password: "password1",
  });
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.message).toBe(
    `Login with 01_testuser username was successful!`
  );
});

test("userLogin_test_02_Wrong password", async () => {
  await registrateBeforeLogin();

  const loginResponse = await supertest(app).post("/login").send({
    username: "01_testuser",
    password: "wrongpassword",
  });

  expect(loginResponse.status).toBe(400);
  expect(loginResponse.body.message).toBe(`Password is incorrect.`);
});

// input validation tests
test("userLogin_test_03_Username is missing", async () => {
  const password = "password123";
  const response = await supertest(app).post("/login").send({
    password: password,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(`Username is required!`);
});

test("userLogin_test_04_Password is missing", async () => {
  const username = "nonexistentuser";

  const response = await supertest(app).post("/login").send({
    username: username,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(`Password is required!`);
});

test("userLogin_test_05_Username and password are missing", async () => {
  const response = await supertest(app).post("/login").send({});

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(`Username is required!`);
});

test("userLogin_test_06_username is not found", async () => {
  const username = "nonexistentuser";
  const password = "password1";

  const response = await supertest(app).post("/login").send({
    username: username,
    password: password,
  });

  expect(response.status).toBe(404);
  expect(response.body.message).toBe(`Username is not found!`);
});

// token tests
test("userLogin_test_07_Token generation", async () => {
  await registrateBeforeLogin();

  const loginResponse = await supertest(app).post("/login").send({
    username: "01_testuser",
    password: "password1",
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.status).toBe("success");
  expect(loginResponse.body.message).toBe(
    `Login with 01_testuser username was successful!`
  );

  const token = loginResponse.body.token;
  expect(token).toBeDefined();

  const decodedToken = jwt.decode(token);
  expect(decodedToken).toHaveProperty("userid");
  expect(decodedToken).toHaveProperty("username");

  const currentTime = Math.floor(Date.now() / 1000);
  const expirationTime = decodedToken.exp;
  expect(expirationTime).toBeGreaterThan(currentTime);
  expect(expirationTime - currentTime).toBeLessThanOrEqual(3600);
});
