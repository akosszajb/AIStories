import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

const username = "01_testuser";
const password = "password1";
const email = "test@test.hu";

const registrateBeforeDelete = async () => {
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

test("userDelete_test_01_username_present_password_present_email_present", async () => {
  await registrateBeforeDelete();
  const response = await supertest(app).delete("/register").send({
    username: username,
    password: password,
    email: email,
  });

  expect(response.status).toBe(200);
  expect(response.body.message).toBe(`${username} - user is deleted!`);
});

test("userDelete_test_02_username_present_password_present_email_missing", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({
    username: username,
    password: password,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_03_username_present_password_missing_email_present", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({
    username: username,
    email: email,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_04_username_present_password_missing_email_missing", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({
    username: username,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_05_username_missing_password_present_email_present", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({
    password: password,
    email: email,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_06_username_missing_password_present_email_missing", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({
    password: password,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_07_username_missing_password_missing_email_present", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({
    email: email,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_08_username_missing_password_missing_email_missing", async () => {
  await registrateBeforeDelete();

  const response = await supertest(app).delete("/register").send({});

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    `All fields are required to delete a user!`
  );
});

test("userDelete_test_09_username_present_password_present_email_wrong", async () => {
  await registrateBeforeDelete();
  const response = await supertest(app).delete("/register").send({
    username: username,
    password: password,
    email: "wrongemail",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("This user is not registered!");
});

test("userDelete_test_10_username_present_password_wrong_email_present", async () => {
  await registrateBeforeDelete();
  const response = await supertest(app).delete("/register").send({
    username: username,
    password: "wrongPassword",
    email: email,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("Password is incorrect.");
});

test("userDelete_test_11_username_present_password_present_email_present", async () => {
  await registrateBeforeDelete();
  const response = await supertest(app).delete("/register").send({
    username: username,
    password: password,
    email: email,
  });

  expect(response.status).toBe(200);
  expect(response.body.message).toBe(`${username} - user is deleted!`);
});
