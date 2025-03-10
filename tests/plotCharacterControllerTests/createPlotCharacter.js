import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";
const data = {
  _id: {
    $oid: "67adf69f3cc58e528228b97b",
  },
  plotcharactername: "Major Elena 'Shadow' Carter",
  personality: 12,
  charStoryKeywords: [
    "Operation Shadow Strike",
    "Military",
    "Action",
    "Covert Mission",
    "High Stakes",
    "Combat",
  ],
  aiPictureUrls: [],
  pictureKeywords: ["military", "action", "tactical", "intense"],
  fullStories: [],
  selectedUserOptions: [],
  created: {
    $date: "2025-02-13T13:41:51.205Z",
  },
  __v: 0,
};

test("createPlotCharacter_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";

  const response = await supertest(app)
    .post("/createplotcharacter")
    .set("Authorization", `Bearer ${invalidUserIdToken}`)
    .send(data);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});
