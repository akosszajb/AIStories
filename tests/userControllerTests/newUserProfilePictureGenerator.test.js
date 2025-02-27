import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import {
  loginAndGetToken,
  registrateBeforeLogin,
} from "./setupLoginAndGetToken.js";
import { userProfilePictureCreator } from "../../server/src/utils/imageCreator.js";

const prompt = ["test", "exclamation mark", "red", "sign"];

test("newUseProfilePictureGenerator_test_01_the new url is saved to the user.profilepictureURL array", async () => {
  const token = await loginAndGetToken();
  const response = await supertest(app)
    .post("/generatenewuserprofilepicture")
    .set("Authorization", `Bearer ${token}`)
    .set("Content-Type", "application/json")
    .send(JSON.stringify({ prompt }));

  const expectedBaseUrl =
    "https://pollinations.ai/p/test%2Cexclamation%20mark%2Cred%2Csign";

  const baseUrl = response.body[1].split("?")[0];
  expect(response.status).toBe(200);
  expect(response.body).toBeDefined();
  expect(response.body).toHaveLength(2);
  expect(baseUrl).toBe(expectedBaseUrl);
});
