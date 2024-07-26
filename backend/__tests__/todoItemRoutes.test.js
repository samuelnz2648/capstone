// capstone/backend/__tests__/todoItemRoutes.test.js

const request = require("supertest");
const express = require("express");
const User = require("../models/User");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const todoItemRoutes = require("../routes/todoItemRoutes");

// Mock the models
jest.mock("../models/User");
jest.mock("../models/TodoList");
jest.mock("../models/Todo");

// Mock the Authentication Middleware
jest.mock("../middleware/authMiddleware", () => (req, res, next) => {
  req.user = { username: "testuser", userId: 1 };
  next();
});

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use("/api/todos/:todoListName/todos", todoItemRoutes);

describe("Todo Item Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /", () => {
    it("should return all todo items for a specific list", async () => {
      const mockTodos = [
        { id: 1, task: "Task 1", completed: false },
        { id: 2, task: "Task 2", completed: true },
      ];
      TodoList.findOne.mockResolvedValue({ Todos: mockTodos });

      const response = await request(app).get("/api/todos/TestList/todos");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTodos);
    });

    it("should return 404 if todo list is not found", async () => {
      TodoList.findOne.mockResolvedValue(null);

      const response = await request(app).get(
        "/api/todos/NonexistentList/todos"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo list not found.");
    });

    it("should return 500 if there's a server error", async () => {
      TodoList.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).get("/api/todos/TestList/todos");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });

  describe("POST /", () => {
    it("should create a new todo item", async () => {
      TodoList.findOne.mockResolvedValue({ id: 1 });
      Todo.create.mockResolvedValue({
        id: 1,
        task: "New Task",
        completed: false,
      });

      const response = await request(app)
        .post("/api/todos/TestList/todos")
        .send({ task: "New Task" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        task: "New Task",
        completed: false,
      });
    });

    it("should return 404 if todo list is not found", async () => {
      TodoList.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/api/todos/NonexistentList/todos")
        .send({ task: "New Task" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo list not found.");
    });

    it("should return 500 if there's a server error", async () => {
      TodoList.findOne.mockResolvedValue({ id: 1 });
      Todo.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/api/todos/TestList/todos")
        .send({ task: "New Task" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });

  describe("PUT /:todoId", () => {
    it("should update a todo item", async () => {
      TodoList.findOne.mockResolvedValue({ id: 1 });
      const mockTodo = {
        id: 1,
        task: "Old Task",
        completed: false,
        update: jest.fn().mockImplementation(function (updates) {
          Object.assign(this, updates);
          return Promise.resolve(this);
        }),
      };
      Todo.findOne.mockResolvedValue(mockTodo);

      const response = await request(app)
        .put("/api/todos/TestList/todos/1")
        .send({ task: "Updated Task", completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        task: "Updated Task",
        completed: true,
      });
    });

    it("should return 404 if todo list is not found", async () => {
      TodoList.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/todos/NonexistentList/todos/1")
        .send({ task: "Updated Task" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo list not found.");
    });

    it("should return 404 if todo item is not found", async () => {
      TodoList.findOne.mockResolvedValue({ id: 1 });
      Todo.findOne.mockResolvedValue(null);

      const response = await request(app)
        .put("/api/todos/TestList/todos/999")
        .send({ task: "Updated Task" });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo item not found.");
    });

    it("should return 500 if there's a server error", async () => {
      TodoList.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .put("/api/todos/TestList/todos/1")
        .send({ task: "Updated Task" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });

  describe("DELETE /:todoId", () => {
    it("should delete a todo item", async () => {
      TodoList.findOne.mockResolvedValue({ id: 1 });
      const mockTodo = {
        id: 1,
        task: "Task to Delete",
        destroy: jest.fn().mockResolvedValue(),
      };
      Todo.findOne.mockResolvedValue(mockTodo);

      const response = await request(app).delete("/api/todos/TestList/todos/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Todo item deleted successfully.");
    });

    it("should return 404 if todo list is not found", async () => {
      TodoList.findOne.mockResolvedValue(null);

      const response = await request(app).delete(
        "/api/todos/NonexistentList/todos/1"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo list not found.");
    });

    it("should return 404 if todo item is not found", async () => {
      TodoList.findOne.mockResolvedValue({ id: 1 });
      Todo.findOne.mockResolvedValue(null);

      const response = await request(app).delete(
        "/api/todos/TestList/todos/999"
      );

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Todo item not found.");
    });

    it("should return 500 if there's a server error", async () => {
      TodoList.findOne.mockRejectedValue(new Error("Database error"));

      const response = await request(app).delete("/api/todos/TestList/todos/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Server error.");
    });
  });
});
