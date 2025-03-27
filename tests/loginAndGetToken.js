import "./setupEnv.js";
import supertest from "supertest";
import app from "./setupTests.js";
import jwt from "jsonwebtoken";

const username = "01_testuser";
const password = "password1";
const email = "test@test.hu";

export const registrateBeforeLogin = async () => {
  const regResponse = await supertest(app).post("/register").send({
    username: username,
    email: email,
    password: password,
  });

  expect(regResponse.status).toBe(201);
  expect(regResponse.body.status).toBe("success");
  expect(regResponse.body.message).toBe(
    `Registration of ${username} is successful!`
  );
  return regResponse;
};

export const loginAndGetToken = async () => {
  await registrateBeforeLogin();

  const loginResponse = await supertest(app).post("/login").send({
    username: username,
    password: password,
  });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.message).toBe(
    `Login with ${username} username was successful!`
  );

  const token = loginResponse.body.token;
  return token;
};

export const getUserIdFromToken = async (token) => {
  const decodedToken = jwt.decode(token);
  return decodedToken ? decodedToken.userid : null;
};
