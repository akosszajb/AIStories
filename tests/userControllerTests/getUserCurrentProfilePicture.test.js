import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

const defaultProfielPicture =
  "https://image.pollinations.ai/prompt/avatarboy%20picture%20default?width=500&height=500&seed=1234&enhance=true&model=flux";

test("getUserCurrentProfilePicture_test_01_Successfully get the current profile picture", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .get("/usercurrentprofilepicture")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body).toBe(defaultProfielPicture);
});

test("getUserCurrentProfilePicture_test_02_userNotFound", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .get("/usercurrentprofilepicture")
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("getUserCurrentProfilePicture_test_03_UserHasNoProfilePicture", async () => {
  const token = await loginAndGetToken();

  const firstAndOnlyPicutreUrlResponse = await supertest(app)
    .get("/userprofilepictures")
    .set("Authorization", `Bearer ${token}`);

  const deleteImgResponse = await supertest(app)
    .delete("/deleteprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(
      JSON.stringify({
        profilePictureToDelete: firstAndOnlyPicutreUrlResponse.body[0],
      })
    );

  const response = await supertest(app)
    .get("/usercurrentprofilepicture")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body).toBe(null);
});
