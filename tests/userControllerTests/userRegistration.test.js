import "./setupEnv.js";
import supertest from "supertest";
import app from "./userTestsSetup.js";

test("userRegistration_test_01_User should be created with valid username, email and password", async () => {
  const username = "01_testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_02_Should return 400 if all reg field are missing", async () => {
  const response = await supertest(app).post("/register").send({});

  expect(response.status).toBe(400);
});

// Username tests
// BVA username  - 0, 1, 2, 8, 14, 15, 16 (username.length)

test("userRegistration_test_03_Should return 400 if the username is missing", async () => {
  const response = await supertest(app).post("/register").send({
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "All fields are required! - username is missing"
  );
});

test("userRegistration_test_04_Should return 400 if the username is too short (0)", async () => {
  const response = await supertest(app).post("/register").send({
    username: "",
    email: "test@test.hu",
    password: "testpassword1",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "All fields are required! - username is missing"
  );
});

test("userRegistration_test_05_Should return 201 if the username has a correct length (1) - minimum", async () => {
  const username = "b";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_06_Should return 201 if the username has a correct length (2)", async () => {
  const username = "te";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_07_Should return 201 if the username has a correct length (8)", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_08_Should return 201 if the username has a correct length (14)", async () => {
  const username = "07_testuser_14";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_09_Should return 201 if the username has a correct length (15) - maximum", async () => {
  const username = "08_testuser__15";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: "password123",
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_10_Should return 400 if the username is too long (16)", async () => {
  const response = await supertest(app).post("/register").send({
    username: "09_wrongtestuser",
    email: "test@test.hu",
    password: "testpassword1",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "username length must be between 1 and 15."
  );
});

// Password tests
// BVA password - 0, 1, 5, 10, 13, 14, 15 (pasword.length)

test("userRegistration_test_11_Should return 400 if password is missing", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "All fields are required! - password is missing"
  );
});

test("userRegistration_test_12_Should return 400 if the password is too short (0)", async () => {
  const password = "";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "All fields are required! - password is missing"
  );
});

test("userRegistration_test_13_Should return 201 if the password has a correct length (1) - minimum", async () => {
  const password = "b";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_14_Should return 201 if the password has a correct length (2)", async () => {
  const password = "te";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_15_Should return 201 if the password has a correct length (8)", async () => {
  const password = "password";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_16_Should return 201 if the password has a correct length (14)", async () => {
  const password = "correctpasswor";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_17_Should return 201 if the password has a correct length (15) - maximum", async () => {
  const password = "correctpassword";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_18_Should return 400 if the password is too long (16)", async () => {
  const password = "wrongpassword_16";
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@test.hu",
    password: password,
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "password length must be between 1 and 15."
  );
});

// Email tests
// BVA email.length - registerUser validation
// Email characters - mongoose validation

// mongoDB validation tests

test("userRegistration_test_19_User should be created with valid simple email - test@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "test@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_20_User should be created with valid email - first.last@example.co.uk", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "first.last@example.co.uk",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_21_User should be created with valid email - user+label@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "user+label@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_22_User should be created with valid email - 123user@domain.org", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "123user@domain.org",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_23_User should be created with valid email - user@sub.domain.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "user@sub.domain.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_24_User should be created with valid email - user@domain.name", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "user@domain.name",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_25_User should not be created with invalid email - plainaddress", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "plainaddress",
      password: "password123",
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

test("userRegistration_test_26_User should not be created with invalid email - @missinguser.com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "@missinguser.com",
      password: "password123",
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

test("userRegistration_test_27_User should not be created with invalid email - missingdomain@", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "missingdomain@",
      password: "password123",
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

test("userRegistration_test_27_User should not be created with invalid email - user@.com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@.com",
      password: "password123",
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

test("userRegistration_test_29_User should not be created with invalid email - user@com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@com",
      password: "password123",
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

test("userRegistration_test_30_User should not be created with invalid email - user@domain..com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@com",
      password: "password123",
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

test("userRegistration_test_31_User should not be created with invalid email - user@domain,com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@domain,com",
      password: "password123",
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

test("userRegistration_test_32_User should not be created with invalid email - user@domain!.com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@domain!.com",
      password: "password123",
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

test("userRegistration_test_33_User should not be created with invalid email - user@ domain.com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@ domain.com",
      password: "password123",
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

test("userRegistration_test_34_User should not be created with invalid email - user@domain..sub.com", async () => {
  try {
    const username = "testuser";
    const response = await supertest(app).post("/register").send({
      username: username,
      email: "user@domain..sub.com",
      password: "password123",
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

test("userRegistration_test_35_Should return 400 if email is missing", async () => {
  const response = await supertest(app).post("/register").send({
    username: "testUsername",
    password: "password123",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "All fields are required! - email is missing"
  );
});

test("userRegistration_test_36_Should return 400 if email is already used", async () => {
  const username = "testuser";
  const email = "test@test.hu";
  const password = "password123";
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

// registerUser function validation tests

test("userRegistration_test_37_User should be created with valid email - a@b.c", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "a@b.c",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_38_User should be created with valid email - simple@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "simple@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_39_User should be created with valid email - very.common@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "very.common@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_40_User should be created with valid email - disposable.style.email.with+symbol@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "disposable.style.email.with+symbol@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_41_User should be created with valid email - other.email-with-dash@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "other.email-with-dash@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_42_User should be created with valid email - user@sub.domain.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "user@sub.domain.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_43_User should be created with valid email - user@domain.co.uk", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "user@domain.co.uk",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_44_User should be created with valid email - user@domain.name", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "user@domain.name",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_45_User should be created with valid email - username_with_underscores@example.com", async () => {
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: "username_with_underscores@example.com",
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_46_User should be created with valid email - 100 char", async () => {
  const email = `a@${"a".repeat(94)}.com`;
  const username = "testuser";
  const response = await supertest(app).post("/register").send({
    username: username,
    email: email,
    password: "password123",
  });
  expect(response.status).toBe(201);
  expect(response.body.status).toBe("success");
  expect(response.body.message).toBe(
    `Registration of ${username} is successful!`
  );
});

test("userRegistration_test_47_Should return 400 if email is missing", async () => {
  const response = await supertest(app).post("/register").send({
    email: "",
    username: "testUsername",
    password: "password123",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe(
    "All fields are required! - email is missing"
  );
});

test("userRegistration_test_48_Should return 400 if email is too long 101", async () => {
  const email = `a@${"a".repeat(95)}.com`;

  const response = await supertest(app).post("/register").send({
    email: email,
    username: "testUsername",
    password: "password123",
  });

  expect(response.status).toBe(400);
  expect(response.body.message).toBe("email length must be between 1 and 100.");
});

test("userRegistration_test_49_Should return 400 if email in wrong format: user@.sub.domain.com", async () => {
  try {
    const response = await supertest(app).post("/register").send({
      email: "user@.sub.domain.com",
      username: "testUsername",
      password: "password123",
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

test("userRegistration_test_50_Should return 400 if email in wrong format: user @example.com", async () => {
  try {
    const response = await supertest(app).post("/register").send({
      email: "user @example.com",
      username: "testUsername",
      password: "password123",
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

test("userRegistration_test_51_Should return 400 if email in wrong format: user@example..com", async () => {
  try {
    const response = await supertest(app).post("/register").send({
      email: "user@example..com",
      username: "testUsername",
      password: "password123",
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
