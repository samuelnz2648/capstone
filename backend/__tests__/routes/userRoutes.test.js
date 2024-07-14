// capstone/backend/__tests__/routes/userRoutes.test.js

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const userRoutes = require("../../routes/userRoutes");
const User = require("../../models/User");
const authMiddleware = require("../../middleware/authMiddleware");

jest.mock("../../models/User");
jest.mock("../../middleware/authMiddleware");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ username: "newuser" });

      const res = await request(app)
        .post("/api/users/register")
        .send({ username: "newuser", password: "password123" });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registered successfully.");
    });

    it("should not register a user with an existing username", async () => {
      User.findOne.mockResolvedValue({ username: "existinguser" });

      const res = await request(app)
        .post("/api/users/register")
        .send({ username: "existinguser", password: "password123" });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("User already registered.");
    });

    it("should not register a user with invalid input", async () => {
      const res = await request(app)
        .post("/api/users/register")
        .send({ username: "ab", password: "short" });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe("POST /login", () => {
    it("should login a user with correct credentials", async () => {
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
      expect(res.body).toHaveProperty("userId");
      expect(res.body).toHaveProperty("username");
    });

    it("should not login a user with incorrect password", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        validPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post("/api/users/login")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid credentials.");
    });

    it("should not login a non-existent user", async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post("/api/users/login")
        .send({ username: "nonexistentuser", password: "password123" });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Invalid credentials.");
    });
  });

  describe("POST /refresh-token", () => {
    it("should refresh the token for an authenticated user", async () => {
      const mockUser = { userId: 1, username: "testuser" };
      authMiddleware.mockImplementation((req, res, next) => {
        req.user = mockUser;
        next();
      });

      const res = await request(app)
        .post("/api/users/refresh-token")
        .set("Authorization", "Bearer mocktoken");

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should not refresh token for unauthenticated user", async () => {
      authMiddleware.mockImplementation((req, res, next) => {
        return res.status(401).json({ message: "Unauthorized" });
      });

      const res = await request(app)
        .post("/api/users/refresh-token")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Unauthorized");
    });
  });
});
