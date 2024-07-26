// capstone/backend/__tests__/todoRoutes.test.js

const request = require("supertest");
const express = require("express");
const User = require("../models/User");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const todoRoutes = require("../routes/todoRoutes");

// Mock the models
jest.mock("../models/User");
jest.mock("../models/TodoList");
jest.mock("../models/Todo");

// Mock the Authentication Middleware
jest.mock("../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { username: "testuser" };
  next();
});

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/api/todos", todoRoutes);

describe("Todo Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return all todo lists for the user", async () => {
      TodoList.findAll.mockResolvedValue([
        { name: "List1" },
        { name: "List2" },
      ]);

      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(["List1", "List2"]);
    });

    it("should return 500 if there's a server error", async () => {
      TodoList.findAll.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/todos");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });

  describe("GET /:todoListName", () => {
    it("should return todos for a specific list", async () => {
      const mockTodoList = {
        Todos: [
          { id: 1, task: "Task 1" },
          { id: 2, task: "Task 2" },
        ],
      };
      User.findOne.mockResolvedValue({ id: 1 });
      TodoList.findOne.mockResolvedValue(mockTodoList);

      const response = await request(app).get("/api/todos/TestList");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTodoList.Todos);
    });

    it("should return 404 if todo list is not found", async () => {
      User.findOne.mockResolvedValue({ id: 1 });
      TodoList.findOne.mockResolvedValue(null);

      const response = await request(app).get("/api/todos/NonexistentList");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo list not found.");
    });

    it("should return 500 if there's a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/todos/TestList");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });

  describe("POST /:todoListName", () => {
    it("should create a new todo list", async () => {
      User.findOne.mockResolvedValue({ id: 1 });
      TodoList.create.mockResolvedValue({
        id: 1,
        name: "NewList",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app).post("/api/todos/NewList");

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Todo list NewList created.");
      expect(response.body.todoList).toHaveProperty("id");
      expect(response.body.todoList).toHaveProperty("name", "NewList");
    });

    it("should return 404 if user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/api/todos/NewList");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found.");
    });

    it("should return 400 if todo list already exists", async () => {
      User.findOne.mockResolvedValue({ id: 1 });
      TodoList.create.mockRejectedValue({
        name: "SequelizeUniqueConstraintError",
      });

      const response = await request(app).post("/api/todos/ExistingList");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "A todo list with this name already exists."
      );
    });

    it("should return 500 if there's a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).post("/api/todos/NewList");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });

  describe("DELETE /:todoListName", () => {
    it("should delete a todo list", async () => {
      const mockTodoList = { id: 1 };
      User.findOne.mockResolvedValue({ id: 1 });
      TodoList.findOne.mockResolvedValue(mockTodoList);
      TodoList.destroy.mockResolvedValue(1);

      const response = await request(app).delete("/api/todos/ListToDelete");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Todo list ListToDelete deleted.");
    });

    it("should return 200 even if todo list doesn't exist", async () => {
      User.findOne.mockResolvedValue({ id: 1 });
      TodoList.findOne.mockResolvedValue(null);

      const response = await request(app).delete("/api/todos/NonexistentList");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Todo list NonexistentList deleted.");
    });

    it("should return 500 if there's a server error", async () => {
      User.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).delete("/api/todos/ListToDelete");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });
});
