import jwt from "jsonwebtoken";
import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

const { JWTKEY } = process.env;

const generateTestToken = (userId) => {
  return jwt.sign({ userid: userId }, JWTKEY, { expiresIn: "1h" });
};

test("verifyToken_test_01_ShouldAuthenticateWithValidToken", async () => {
  const token = generateTestToken("testUser123");

  const response = await supertest(app)
    .get("/protected")
    .set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe("Access granted!");
  expect(response.body.userId).toBe("testUser123");
});

test("verifyToken_test_02_ShouldRejectRequestWithoutToken", async () => {
  const response = await supertest(app).get("/protected");

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("No token provided!");
});

test("verifyToken_test_03_ShouldRejectRequestWithInvalidToken", async () => {
  const invalidToken = "invalid_token";

  const response = await supertest(app)
    .get("/protected")
    .set("Authorization", `Bearer ${invalidToken}`);

  expect(response.status).toBe(403);
  expect(response.body.message).toBe("Failed to authenticate token!!!!");
});
