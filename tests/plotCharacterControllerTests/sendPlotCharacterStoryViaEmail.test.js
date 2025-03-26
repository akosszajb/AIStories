import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";
import { loginAndGetToken } from "../loginAndGetToken.js";
import nodemailer from "nodemailer";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ response: "Success" }),
  }),
}));

const invalidID = "11cdafa11da11111e31b1111";

test("sendPlotCharacterStoryViaEmail_test_01_success", async () => {
  const mockSendMail = nodemailer.createTransport().sendMail;

  const token = await loginAndGetToken();

  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  mockSendMail.mockResolvedValueOnce({
    response: "Success",
  });

  const response = await supertest(app)
    .post(`/send-email/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Email sent successfully!");
  expect(mockSendMail).toHaveBeenCalled();
});

test("sendPlotCharacterStoryViaEmail_test_02_invalid token", async () => {
  const invalidToken = "invalid_token";

  const response = await supertest(app)
    .post(`/send-email/${invalidID}`)
    .set("Authorization", `Bearer ${invalidToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});

test("sendPlotCharacterStoryViaEmail_test_03_character not found", async () => {
  const token = await loginAndGetToken();

  const response = await supertest(app)
    .post(`/send-email/${invalidID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(404);
  expect(response.body.message).toBe(
    "sendPlotCharacterStoryViaEmail: Character not found."
  );
});

test("sendPlotCharacterStoryViaEmail_test_04_email send fails", async () => {
  const token = await loginAndGetToken();

  const mockSendMail = nodemailer.createTransport().sendMail;
  const getresponse = await supertest(app)
    .get("/plotcharacterlist")
    .set("Authorization", `Bearer ${token}`);

  const firstCharacterID = getresponse.body[0]._id;

  mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

  const response = await supertest(app)
    .post(`/send-email/${firstCharacterID}`)
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(500);
  expect(response.body.error).toBe(
    "sendPlotCharacterStoryViaEmail: Internal server error"
  );
});
