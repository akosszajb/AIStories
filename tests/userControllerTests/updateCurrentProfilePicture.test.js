import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "./setupLoginAndGetToken.js";

const username = "01_testuser";
const email = "test@test.hu";

test("updateCurrentProfilePicture_test_01_Successful current profile picture update", async () => {
  const token = await loginAndGetToken();
  const newPictureUrl = "https://pollinations.ai/";

  const response = await supertest(app)
    .post("/updatecurrentprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ currentProfilePicture: newPictureUrl }));

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body.username).toBe(username);
  expect(response.body.email).toBe(email);
  expect(response.body.currentProfilePicture).toBe(newPictureUrl);
});

test("updateCurrentProfilePicture_test_02_userNotFound", async () => {
  const invalidUserIdToken = "invalid_token";
  const newPictureUrl = "https://pollinations.ai/";

  const response = await supertest(app)
    .post("/updatecurrentprofilepicture")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ currentProfilePicture: newPictureUrl }));

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("updateCurrentProfilePicture_test_03_failed update bc currentProfilePicture missing from req - length 0", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/updatecurrentprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ currentProfilePicture: "" }));

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "currentProfilePicture required to update a profile picture!"
  );
});

test("updateCurrentProfilePicture_test_04_failed update bc currentProfilePicture missing from req - length undefined", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post("/updatecurrentprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({}));

  expect(response.status).toBe(400);
  expect(response.body).toBeDefined();
  expect(response.body.message).toBe(
    "currentProfilePicture required to update a profile picture!"
  );
});
