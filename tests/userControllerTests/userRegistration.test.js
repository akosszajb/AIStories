import "../setupEnv.js";
import supertest from "supertest";
import app from "../setupTests.js";

const username = "testuser";
const email = "test@test.com";
const password = "password123";
const email100 = `a@${"a".repeat(94)}.com`;
const email101 = `a@${"a".repeat(95)}.com`;

test("userRegistration_test_01_User should be created with valid username, email and password", async () => {
  const response = await supertest(app).post("/register").send({
    username: username,
    email: email,
    password: password,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

describe("User Registration", () => {
  const testCases = [
    [
      "userRegistration_test_02: Should return 400 if all reg field are missing",
      undefined,
      undefined,
      undefined,
      400,
      "All fields are required! - username is missing",
    ],
    [
      "userRegistration_test_03: Should return 400 if the username is missing",
      undefined,
      email,
      password,
      400,
      "All fields are required! - username is missing",
    ],
    [
      "userRegistration_test_04: Should return 400 if the username is too short (0)",
      "",
      email,
      password,
      400,
      "All fields are required! - username is missing",
    ],
    [
      "userRegistration_test_05: Should return 201 if the username has a correct length (1) - minimum",
      "b",
      email,
      password,
      201,
      "Registration of b is successful!",
    ],
    [
      "userRegistration_test_06: Should return 201 if the username has a correct length (2)",
      "te",
      email,
      password,
      201,
      "Registration of te is successful!",
    ],
    [
      "userRegistration_test_07: Should return 201 if the username has a correct length (8)",
      username,
      email,
      password,
      201,
      "Registration of testuser is successful!",
    ],
    [
      "userRegistration_test_08: Should return 201 if the username has a correct length (14)",
      "07_testuser_14",
      email,
      password,
      201,
      "Registration of 07_testuser_14 is successful!",
    ],
    [
      "userRegistration_test_09: Should return 201 if the username has a correct length (15) - maximum",
      "08_testuser__15",
      email,
      password,
      201,
      "Registration of 08_testuser__15 is successful!",
    ],
    [
      "userRegistration_test_10: Should return 400 if the username is too long (16) - maximum",
      "09_wrongtestuser",
      email,
      password,
      400,
      "registerUser: username length must be between 1 and 15.",
    ],
    [
      "userRegistration_test_11: Should return 400 if password is missing",
      username,
      email,
      undefined,
      400,
      "All fields are required! - password is missing",
    ],
    [
      "userRegistration_test_12: Should return 400 if the password is too short (0)",
      username,
      email,
      undefined,
      400,
      "All fields are required! - password is missing",
    ],
    [
      "userRegistration_test_13: Should return 201 if the password has a correct length (1) - minimum",
      username,
      email,
      "p",
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_14:Should return 201 if the password has a correct length (2)",
      username,
      email,
      "pa",
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_15: Should return 201 if the password has a correct length (8)",
      username,
      email,
      "password",
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_16: Should return 201 if the password has a correct length (14)",
      username,
      email,
      "correctpasswor",
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_17: Should return 201 if the password has a correct length (15) - maximum",
      username,
      email,
      "correctpassword",
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_18: Should return 400 if the password is too long (16)",
      username,
      email,
      "wrongpassword_16",
      400,
      `registerUser: password length must be between 1 and 15.`,
    ],
    [
      "userRegistration_test_19: User should be created with valid simple email - test@example.com",
      username,
      "test@example.com",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_20: User should be created with valid email - first.last@example.co.uk",
      username,
      "first.last@example.co.uk",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_21: User should be created with valid email - user+label@example.com",
      username,
      "user+label@example.com",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_22: User should be created with valid email - 123user@domain.org",
      username,
      "123user@domain.org",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_23: User should be created with valid email - user@sub.domain.com",
      username,
      "user@sub.domain.com",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_24: User should be created with valid email - user@domain.name",
      username,
      "user@domain.name",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_25: Should return 400 if email is missing",
      username,
      undefined,
      password,
      400,
      "All fields are required! - email is missing",
    ],
    [
      "userRegistration_test_26: User should be created with valid email - a@b.c",
      username,
      "a@b.c",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_27: User should be created with valid email - username_with_underscores@example.com",
      username,
      "username_with_underscores@example.com",
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_28: User should be created with valid email - 100 char",
      username,
      email100,
      password,
      201,
      `Registration of ${username} is successful!`,
    ],
    [
      "userRegistration_test_29: Should return 400 if email is too long 101",
      username,
      email101,
      password,
      400,
      `registerUser: email length must be between 1 and 100.`,
    ],
    [
      "userRegistration_test_30: Should return 400 if the email is too short (0)",
      username,
      "",
      password,
      400,
      "All fields are required! - email is missing",
    ],
  ];

  testCases.forEach(
    ([
      testTitle,
      username,
      email,
      password,
      expectedStatus,
      expectedMessage,
    ]) => {
      it(`${testTitle}`, async () => {
        const response = await supertest(app).post("/register").send({
          username,
          email,
          password,
        });

        expect(response.status).toBe(expectedStatus);
        expect(response.body.message).toBe(expectedMessage);
      });
    }
  );
});

describe("User Registration - database validation", () => {
  const testCases = [
    [
      "userRegistration_test_31: User should not be created with invalid email - plainaddress",
      username,
      "plainaddress",
      password,
    ],
    [
      "userRegistration_test_32: User should not be created with invalid email - @missinguser.com",
      username,
      "@missinguser.com",
      password,
    ],
    [
      "userRegistration_test_33: User should not be created with invalid email - missingdomain@",
      username,
      "missingdomain@",
      password,
    ],
    [
      "userRegistration_test_34: User should not be created with invalid email - user@.com",
      username,
      "user@.com",
      password,
    ],
    [
      "userRegistration_test_35: User should not be created with invalid email - user@com",
      username,
      "user@com",
      password,
    ],
    [
      "userRegistration_test_36: User should not be created with invalid email - user@domain..com",
      username,
      "user@domain..com",
      password,
    ],
    [
      "userRegistration_test_37: User should not be created with invalid email - user@domain,com",
      username,
      "user@domain,com",
      password,
    ],
    [
      "userRegistration_test_38: User should not be created with invalid email - user@domain!.com",
      username,
      "user@domain!.com",
      password,
    ],
    [
      "userRegistration_test_39: User should not be created with invalid email - user@ domain.com",
      username,
      "user@ domain.com",
      password,
    ],
    [
      "userRegistration_test_40: User should not be created with invalid email - user@domain..sub.com",
      username,
      "user@domain..sub.com",
      password,
    ],
    [
      "userRegistration_test_41: Should return 400 if email in wrong format: user@.sub.domain.com",
      username,
      "user@.sub.domain.com",
      password,
    ],
  ];

  testCases.forEach(([testTitle, username, email, password]) => {
    it(`${testTitle}`, async () => {
      try {
        const response = await supertest(app).post("/register").send({
          username,
          email,
          password,
        });
      } catch (error) {
        expect(error).toMatchObject({
          name: "ValidationError",
          errors: {
            email: {
              message: "Please use a valid email address. (xyz@example.com)",
              kind: "regexp",
              path: "email",
              value: "invalidemail",
            },
          },
        });
      }
    });
  });
});

test("userRegistration_test_42_Should return 400 if email is already used", async () => {
  const response1 = await supertest(app).post("/register").send({
    username: username,
    email: email,
    password: password,
  });

  const response2 = await supertest(app).post("/register").send({
    username: username,
    email: email,
    password: password,
  });

  expect(response2.status).toBe(400);
  expect(response2.body.message).toBe(
    "This email address is already associated with another user!"
  );
});
