import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import {
  loginAndGetToken,
  registrateBeforeLogin,
} from "./setupLoginAndGetToken.js";

import bcrypt from "bcrypt";
import { newUserProfilePictureGenerator } from "../../server/src/controllers/userController.js";

const defaultTestUser = {
  username: "testuser",
  email: "test@test.hu",
  password: "password1",
};

async function updateUserRequest(token, updateData) {
  return supertest(app)
    .post("/updateuserdata")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify(updateData));
}

async function comparePasswords(newPassword, hasedPassword) {
  return bcrypt.compare(newPassword, hasedPassword);
}

test("updateUser_test_01_User should be updated with valid username, email and password", async () => {
  const token = await loginAndGetToken();
  const response = await updateUserRequest(token, defaultTestUser);

  const isPasswordCorrect = await comparePasswords(
    defaultTestUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(defaultTestUser.username);
  expect(response.body.email).toBe(defaultTestUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_02_should update with valid username", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: "newUsername",
    email: defaultTestUser.email,
    password: defaultTestUser.password,
  };
  const response = await updateUserRequest(token, newUser);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_03_should update with valid email", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: defaultTestUser.username,
    email: "newemail@email.com",
    password: defaultTestUser.password,
  };
  const response = await updateUserRequest(token, newUser);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_04_should update with valid password", async () => {
  const token = await loginAndGetToken();

  const newUser = {
    username: defaultTestUser.username,
    email: defaultTestUser.email,
    password: "newTestPsw",
  };
  const response = await updateUserRequest(token, newUser);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_05_should update with valid username and email", async () => {
  const token = await loginAndGetToken();

  const newUser = {
    username: "newusername",
    email: "newemail@email.com",
    password: defaultTestUser.password,
  };
  const response = await updateUserRequest(token, newUser);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_06_should update with valid username and password", async () => {
  const token = await loginAndGetToken();

  const newUser = {
    username: "newUsername",
    email: "newPassword",
    password: defaultTestUser.password,
  };
  const response = await updateUserRequest(token, newUser);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_07_should update with valid email and password", async () => {
  const token = await loginAndGetToken();

  const newUser = {
    username: defaultTestUser.username,
    email: "newPassword",
    password: "newEmail",
  };
  const response = await updateUserRequest(token, newUser);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.password
  );

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(newUser.username);
  expect(response.body.email).toBe(newUser.email);
  expect(isPasswordCorrect).toBe(true);
});

test("updateUser_test_08_failed update for non-existent user", async () => {
  const token = await loginAndGetToken();

  const newUser = {
    username: "new_testuser",
    email: "new_ppsw1",
    password: "new@test.hu",
  };

  const deleteResponse = await supertest(app).delete("/register").send({
    username: "01_testuser",
    password: "password1",
    email: "test@test.hu",
  });

  const response = await supertest(app)
    .post("/updateuserdata")
    .set("Content-Type", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .send(JSON.stringify(newUser));

  console.log(response.body);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe("User not found.");
});

test("updateUser_test_09_failed update bc username is missing", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    email: defaultTestUser.email,
    password: defaultTestUser.password,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "All fields are required! - username is missing"
  );
});

test("updateUser_test_10_failed update bc email is missing", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: defaultTestUser.username,
    password: defaultTestUser.password,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "All fields are required! - email is missing"
  );
});

test("updateUser_test_11_failed update bc password is missing", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: defaultTestUser.username,
    email: defaultTestUser.email,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "All fields are required! - password is missing"
  );
});

test("updateUser_test_12_failed update bc username is too short - 0", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: "",
    email: defaultTestUser.email,
    password: defaultTestUser.password,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "All fields are required! - username is missing"
  );
});

test("updateUser_test_13_failed update bc username is too long - 16", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: "tooLongUsername1100101",
    email: defaultTestUser.email,
    password: defaultTestUser.password,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "updateUser: username length must be between 1 and 15."
  );
});

test("updateUser_test_14_failed update bc password is too short - 0", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: defaultTestUser.username,
    email: defaultTestUser.email,
    password: "",
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "All fields are required! - password is missing"
  );
});

test("updateUser_test_15_failed update bc password is too long - 16", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: defaultTestUser.username,
    email: defaultTestUser.email,
    password: "tooLongPassword10011000",
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "updateUser: password length must be between 1 and 15."
  );
});

test("updateUser_test_16_failed update bc email is too short - 0", async () => {
  const token = await loginAndGetToken();
  const newUser = {
    username: defaultTestUser.username,
    email: "",
    password: defaultTestUser.password,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "All fields are required! - email is missing"
  );
});

test("updateUser_test_17_failed update bc email is too long - 101", async () => {
  const token = await loginAndGetToken();
  let result = "";

  for (let i = 0; i < 101; i++) {
    result += "a";
  }

  const newUser = {
    username: defaultTestUser.username,
    email: result,
    password: defaultTestUser.password,
  };

  const response = await updateUserRequest(token, newUser);

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "updateUser: email length must be between 1 and 100."
  );
});

test("updateUser_test_18_userNotFound", async () => {
  const invalidUserIdToken = "invalid_token";

  const newUser = {
    username: defaultTestUser.username,
    email: defaultTestUser.email,
    password: defaultTestUser.password,
  };
  const response = await updateUserRequest(invalidUserIdToken, newUser);
  console.log(response.body);

  const isPasswordCorrect = await comparePasswords(
    newUser.password,
    response.body.message
  );

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
  expect(isPasswordCorrect).toBe(false);
});
