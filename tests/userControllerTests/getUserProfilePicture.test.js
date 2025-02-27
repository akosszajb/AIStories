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

test("getUserProfilePicture_test_01_valid request", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/userprofilepictures")
    .set("Authorization", `Bearer ${token}`);

  const defaultPictureURL =
    "https://image.pollinations.ai/prompt/avatarboy%20picture%20default?width=500&height=500&seed=1234&enhance=true&model=flux";
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body[0]).toBe(defaultPictureURL);
});

test("getUserProfilePicture_test_02_user not found bc wrong token", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .get("/userprofilepictures")
    .set("Authorization", `Bearer ${token + "wrong"}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});
