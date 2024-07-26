// capstone/backend/__tests__/userRoutes.test.js

const request = require("supertest");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const userRoutes = require("../routes/userRoutes");

// Set up JWT secret for testing
process.env.JWT_SECRET = "test-secret-key";

// Mock the User model
jest.mock("../models/User");

// Mock the Authentication Middleware
jest.mock("../middleware/authMiddleware", () => (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  if (token === "validtoken") {
    req.user = { userId: 1, username: "testuser" };
    next();
  } else {
    res.status(401).json({ message: "Invalid token." });
  }
});

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ username: "testuser" });

      const response = await request(app)
        .post("/api/users/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully.");
    });

    it("should return 400 if username is too short", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({ username: "te", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveProperty("username");
    });

    it("should return 400 if password is too short", async () => {
      const response = await request(app)
        .post("/api/users/register")
        .send({ username: "testuser", password: "pass" });

      expect(response.status).toBe(400);
      expect(response.body.errors).toHaveProperty("password");
    });

    it("should return 400 if user already exists", async () => {
      User.findOne.mockResolvedValue({ username: "existinguser" });

      const response = await request(app)
        .post("/api/users/register")
        .send({ username: "existinguser", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already registered.");
    });
  });

  describe("POST /login", () => {
    it("should login successfully with correct credentials", async () => {
      const mockUser = {
        id: 1,
        username: "testuser",
        password: await bcrypt.hash("password123", 10),
        validPassword: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/users/login")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("userId", 1);
      expect(response.body).toHaveProperty("username", "testuser");
    });

    it("should return 401 for invalid credentials", async () => {
      const mockUser = {
        username: "testuser",
        validPassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post("/api/users/login")
        .send({ username: "testuser", password: "wrongpassword" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials.");
    });

    it("should return 401 if user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/users/login")
        .send({ username: "nonexistentuser", password: "password123" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials.");
    });
  });

  describe("POST /refresh-token", () => {
    it("should refresh token successfully", async () => {
      const response = await request(app)
        .post("/api/users/refresh-token")
        .set("Authorization", "Bearer validtoken");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
    });

    it("should return 401 for invalid token", async () => {
      const response = await request(app)
        .post("/api/users/refresh-token")
        .set("Authorization", "Bearer invalidtoken");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid token.");
    });

    it("should return 401 if no token provided", async () => {
      const response = await request(app).post("/api/users/refresh-token");

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Access denied. No token provided.");
    });
  });
});
