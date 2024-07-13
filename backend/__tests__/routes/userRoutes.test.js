// capstone/backend/__tests__/routes/userRoutes.test.js

const request = require("supertest");
const express = require("express");
const userRoutes = require("../../routes/userRoutes");
const User = require("../../models/User");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

jest.mock("../../models/User");

describe("User Routes", () => {
  it("should register a new user", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ username: "newuser" });

    const res = await request(app)
      .post("/api/users/register")
      .send({ username: "newuser", password: "password123" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered successfully.");
  });

  it("should login a user", async () => {
    const mockUser = {
      id: 1,
      username: "testuser",
      validPassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post("/api/users/login")
      .send({ username: "testuser", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
