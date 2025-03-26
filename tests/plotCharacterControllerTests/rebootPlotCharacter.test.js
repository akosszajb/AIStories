import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";

const testPlotCharacterData = {
  plotcharactername: "Test Character",
  personality: 12,
  charStoryKeywords: [
    "Test",
    "Testing",
    "Unit test",
    "Coverage",
    "Green",
    "Jest",
  ],
  aiPictureUrls: [],
  pictureKeywords: ["test", "green", "computer", "jest"],
  fullStories: [],
  selectedUserOptions: [],
};

const rebootPlotCharacterData = {
  plotcharactername: "reboot1",
  charStoryKeywords: ["reboot1", "reboot2"],
  personality: 1,
  pictureKeywords: ["reboot1", "reboot2"],
  aiPictureUrls: ["reboot1", "reboot2"],
  fullStories: ["reboot1", "reboot2"],
  selectedUserOptions: ["reboot1", "reboot2"],
};

test("rebootPlotCharacter_test_01_invalid token", async () => {
  const invalidUserIdToken = "invalid_token";
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/rebootcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${invalidUserIdToken}`);

  expect(response.status).toBe(403);

  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("rebootPlotCharacter_test_02_plotCharacter updated and rebooted successfully", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;
  const updatedplotCharacterName = response.body.plotcharactername;
  const updatedplotCharacterPersonality = response.body.personality;
  const updatedplotCharactercharStoryKeywords1 =
    response.body.charStoryKeywords[0];
  const updatedplotCharactercharStoryKeywords2 =
    response.body.charStoryKeywords[1];
  const updatedplotCharacterpictureKeywords1 = response.body.pictureKeywords[0];
  const updatedplotCharacterpictureKeywords2 = response.body.pictureKeywords[1];

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(rebootPlotCharacterData);

  console.log(rebootResponse.body);
  expect(updatedplotCharacterName).not.toBe(
    rebootResponse.body.plotcharactername
  );
  expect(updatedplotCharacterPersonality).not.toBe(
    rebootResponse.body.personality
  );
  expect(updatedplotCharactercharStoryKeywords1).not.toBe(
    rebootResponse.body.charStoryKeywords[0]
  );
  expect(updatedplotCharactercharStoryKeywords2).not.toBe(
    rebootResponse.body.charStoryKeywords[1]
  );
  expect(updatedplotCharacterpictureKeywords1).not.toBe(
    rebootResponse.body.pictureKeywords[0]
  );
  expect(updatedplotCharacterpictureKeywords2).not.toBe(
    rebootResponse.body.pictureKeywords[1]
  );
});

test("rebootPlotCharacter_test_03_plotCharacter updated but not rebooted: missing data - plotcharactername", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      charStoryKeywords: ["reboot1", "reboot2"],
      personality: 1,
      pictureKeywords: ["reboot1", "reboot2"],
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_04_plotCharacter updated but not rebooted: missing data - charStoryKeywords", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      personality: 1,
      pictureKeywords: ["reboot1", "reboot2"],
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_05_plotCharacter updated but not rebooted: missing data - personality", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: ["reboot1", "reboot2"],
      pictureKeywords: ["reboot1", "reboot2"],
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_06_plotCharacter updated but not rebooted: missing data - pictureKeywords", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: ["reboot1", "reboot2"],
      personality: 1,
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_07_plotCharacter updated but not rebooted: missing data - aiPictureUrls", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: ["reboot1", "reboot2"],
      personality: 1,
      pictureKeywords: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_08_plotCharacter updated but not rebooted: missing data - fullStories", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: ["reboot1", "reboot2"],
      personality: 1,
      pictureKeywords: ["reboot1", "reboot2"],
      aiPictureUrls: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_09_plotCharacter updated but not rebooted: missing data - selectedUserOptions", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: ["reboot1", "reboot2"],
      personality: 1,
      pictureKeywords: ["reboot1", "reboot2"],
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_10_plotCharacter updated but not rebooted: wrong data format - charStoryKeywords", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: "reboot1",
      personality: 1,
      pictureKeywords: ["reboot1", "reboot2"],
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
      selectedUserOptions: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});

test("rebootPlotCharacter_test_05_plotCharacter updated but not rebooted: wrong data format - pictureKeywords", async () => {
  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  const response = await supertest(app)
    .post(`/plotcharacter/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send(testPlotCharacterData);

  const updatedplotChararacterID = response.body._id;

  const rebootResponse = await supertest(app)
    .post(`/rebootcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      plotcharactername: "reboot1",
      charStoryKeywords: ["reboot1", "reboot2"],
      personality: 1,
      pictureKeywords: "reboot1reboot2",
      aiPictureUrls: ["reboot1", "reboot2"],
      fullStories: ["reboot1", "reboot2"],
    });

  const getUpdatedButNotRebootedPlotCharacterData = await supertest(app)
    .get(`/selectedplotcharacter/${updatedplotChararacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(rebootResponse.body.message).toBe("Invalid input data");
  expect(rebootResponse.status).toBe(400);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername
  ).not.toBe(rebootPlotCharacterData.plotcharactername);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).not.toBe(rebootPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).not.toBe(
    rebootPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).not.toBe(rebootPlotCharacterData.pictureKeywords[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]
  ).not.toBe(rebootPlotCharacterData.aiPictureUrls[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]
  ).not.toBe(rebootPlotCharacterData.fullStories[0]);
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).not.toBe(rebootPlotCharacterData.selectedUserOptions[0]);

  expect(getUpdatedButNotRebootedPlotCharacterData.body.plotcharactername).toBe(
    testPlotCharacterData.plotcharactername
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.charStoryKeywords[0]
  ).toBe(testPlotCharacterData.charStoryKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.personality).toBe(
    testPlotCharacterData.personality
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.pictureKeywords[0]
  ).toBe(testPlotCharacterData.pictureKeywords[0]);
  expect(getUpdatedButNotRebootedPlotCharacterData.body.aiPictureUrls[0]).toBe(
    testPlotCharacterData.aiPictureUrls[0]
  );
  expect(getUpdatedButNotRebootedPlotCharacterData.body.fullStories[0]).toBe(
    testPlotCharacterData.fullStories[0]
  );
  expect(
    getUpdatedButNotRebootedPlotCharacterData.body.selectedUserOptions[0]
  ).toBe(testPlotCharacterData.selectedUserOptions[0]);
});
