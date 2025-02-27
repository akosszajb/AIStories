import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import {
  loginAndGetToken,
  registrateBeforeLogin,
} from "./setupLoginAndGetToken.js";

const username = "01_testuser";
const password = "password1";
const email = "test@test.hu";

test("getUserData_test_01_valid_userdata", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/userdata")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.username).toBe(username);
  expect(response.body.email).toBe(email);
});

test("getUserData_test_02_invalid_userdata", async () => {
  await registrateBeforeLogin();

  const loginResponse = await supertest(app).post("/login").send({
    username: "wronguser",
    password: "password1",
  });

  expect(loginResponse.status).toBe(404);
  expect(loginResponse.body.message).toBe("Username is not found!");
});
