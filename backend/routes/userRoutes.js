// backend/routes/userRoutes.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Helper function for input validation
const validateInput = (username, password) => {
  const errors = {};
  if (!username || username.length < 3) {
    errors.username = "Username must be at least 3 characters long";
  }
  if (!password || password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  }
  return Object.keys(errors).length === 0 ? null : errors;
};

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const validationErrors = validateInput(username, password);
  if (validationErrors) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const validationErrors = validateInput(username, password);
  if (validationErrors) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );
    res.json({ token, userId: user.id, username: user.username });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

router.post("/refresh-token", authMiddleware, async (req, res) => {
  try {
    const token = jwt.sign(
      { userId: req.user.userId, username: req.user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ message: "Server error during token refresh." });
  }
});

module.exports = router;
