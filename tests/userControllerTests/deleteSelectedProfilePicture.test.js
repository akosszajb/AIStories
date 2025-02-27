import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "./setupLoginAndGetToken.js";

const username = "01_testuser";

const email = "test@test.hu";
const prompt = ["test", "exclamation mark", "red", "sign"];

test("deleteSelectedProfilePicture_test_01_Successful profile picture deletion", async () => {
  const token = await loginAndGetToken();

  const createNewImgResponse = await supertest(app)
    .post("/generatenewuserprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ prompt }));

  const deleteSecondImgResponse = await supertest(app)
    .delete("/deleteprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(
      JSON.stringify({ profilePictureToDelete: createNewImgResponse.body[1] })
    );

  const firstAndOnlyPicutreUrlResponse = await supertest(app)
    .get("/userprofilepictures")
    .set("Authorization", `Bearer ${token}`);

  expect(deleteSecondImgResponse.status).toBe(200);
  expect(deleteSecondImgResponse.body).toBeDefined();
  expect(deleteSecondImgResponse.body.username).toBe(username);
  expect(deleteSecondImgResponse.body.email).toBe(email);
  expect(firstAndOnlyPicutreUrlResponse.body).toBeDefined();
  expect(firstAndOnlyPicutreUrlResponse.body[0]).toBe(
    "https://image.pollinations.ai/prompt/avatarboy%20picture%20default?width=500&height=500&seed=1234&enhance=true&model=flux"
  );
});

test("deleteSelectedProfilePicture_test_02_Empty profile picture list after deletion", async () => {
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

  expect(deleteImgResponse.status).toBe(200);
  expect(deleteImgResponse.body).toBeDefined();
  expect(deleteImgResponse.body.username).toBe(username);
  expect(deleteImgResponse.body.email).toBe(email);
  expect(deleteImgResponse.body.profilepictureURL.length).toBe(0);
});

test("deleteSelectedProfilePicture_test_03_Missing profile picture to delete - 0 length", async () => {
  const token = await loginAndGetToken();

  const deleteImgResponse = await supertest(app)
    .delete("/deleteprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(
      JSON.stringify({
        profilePictureToDelete: "",
      })
    );

  expect(deleteImgResponse.status).toBe(400);
  expect(deleteImgResponse.body).toBeDefined();
  expect(deleteImgResponse.body.message).toBe(
    "profilePictureToDelete required to delete a picture!"
  );
});

test("deleteSelectedProfilePicture_test_04_Missing profile picture to delete - undefined", async () => {
  const token = await loginAndGetToken();

  const deleteImgResponse = await supertest(app)
    .delete("/deleteprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({}));

  expect(deleteImgResponse.status).toBe(400);
  expect(deleteImgResponse.body).toBeDefined();
  expect(deleteImgResponse.body.message).toBe(
    "profilePictureToDelete required to delete a picture!"
  );
});

test("deleteSelectedProfilePicture_test_05_user not found - invalid token", async () => {
  const token = await loginAndGetToken();
  const invalidUserIdToken = "invalid_token";

  const firstAndOnlyPicutreUrlResponse = await supertest(app)
    .get("/userprofilepictures")
    .set("Authorization", `Bearer ${token}`);

  const deleteSecondImgResponse = await supertest(app)
    .delete("/deleteprofilepicture")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .set("Content-Type", "application/json")
    .send(
      JSON.stringify({
        profilePictureToDelete: firstAndOnlyPicutreUrlResponse.body[0],
      })
    );

  expect(deleteSecondImgResponse.status).toBe(403);
  expect(deleteSecondImgResponse.body.message).toBe(
    "Failed to authenticate token!!!!"
  );
});

test("deleteSelectedProfilePicture_test_06_Profile picture not found in the user's list (no change in profilepictureURL)", async () => {
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
        profilePictureToDelete:
          firstAndOnlyPicutreUrlResponse.body[0] + "mistake",
      })
    );

  expect(deleteImgResponse.status).toBe(200);
  expect(deleteImgResponse.body).toBeDefined();
  expect(deleteImgResponse.body.username).toBe(username);
  expect(deleteImgResponse.body.email).toBe(email);
  expect(deleteImgResponse.body.profilepictureURL[0]).toBe(
    firstAndOnlyPicutreUrlResponse.body[0]
  );
  expect(deleteImgResponse.body.profilepictureURL.length).toBe(1);
});

test("deleteSelectedProfilePicture_test_07_Profile picture is the current profile picture : currentProfilepicture is null (update currentProfilePicture)", async () => {
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

  const getUserCurrentProfilePictureResponse = await supertest(app)
    .get("/usercurrentprofilepicture")
    .set("Authorization", `Bearer ${token}`);

  expect(deleteImgResponse.status).toBe(200);
  expect(deleteImgResponse.body).toBeDefined();
  expect(deleteImgResponse.body.username).toBe(username);
  expect(deleteImgResponse.body.email).toBe(email);
  expect(getUserCurrentProfilePictureResponse.body).toBe(null);
});

test("deleteSelectedProfilePicture_test_08_user does not have profile pictures", async () => {
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

  const deleteImgResponse2 = await supertest(app)
    .delete("/deleteprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(
      JSON.stringify({
        profilePictureToDelete: firstAndOnlyPicutreUrlResponse.body[0],
      })
    );

  expect(deleteImgResponse2.status).toBe(200);
  expect(deleteImgResponse2.body).toBeDefined();
  expect(deleteImgResponse2.body.message).toBe(
    "This user does not have profile picture!"
  );
});
