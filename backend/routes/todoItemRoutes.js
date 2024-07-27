// capstone/backend/routes/todoItemRoutes.js

const express = require("express");

const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const User = require("../models/User");

// Middleware to set todoListName
router.use((req, res, next) => {
  req.todoListName = req.params.todoListName;
  next();
});

// Helper function to find todo list
const findTodoList = async (username, todoListName) => {
  return await TodoList.findOne({
    where: { name: todoListName },
    include: [{ model: User, where: { username } }, { model: Todo }],
  });
};

// GET all todo items for a specific list
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todoListName = req.todoListName;
    const todoList = await findTodoList(req.user.username, todoListName);
    if (!todoList) {
      return res.status(404).json({ message: "Todo list not found." });
    }
    res.status(200).json(todoList.Todos);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// POST a new todo item
router.post("/", authMiddleware, async (req, res) => {
  try {
    const todoListName = req.todoListName;
    const { task } = req.body;
    const todoList = await findTodoList(req.user.username, todoListName);
    if (!todoList) {
      return res.status(404).json({ message: "Todo list not found." });
    }
    const newTodo = await Todo.create({
      task,
      TodoListId: todoList.id,
      UserId: req.user.userId,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// PUT (update) a todo item
router.put("/:todoId", authMiddleware, async (req, res) => {
  try {
    const todoListName = req.todoListName;
    const { todoId } = req.params;
    const { task, completed } = req.body;
    const todoList = await findTodoList(req.user.username, todoListName);
    if (!todoList) {
      return res.status(404).json({ message: "Todo list not found." });
    }
    const todo = await Todo.findOne({
      where: { id: todoId, TodoListId: todoList.id, UserId: req.user.userId },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo item not found." });
    }
    const updatedTodo = await todo.update({ task, completed });
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});
// DELETE a todo item
router.delete("/:todoId", authMiddleware, async (req, res) => {
  try {
    const todoListName = req.todoListName;
    const { todoId } = req.params;
    const todoList = await findTodoList(req.user.username, todoListName);
    if (!todoList) {
      return res.status(404).json({ message: "Todo list not found." });
    }
    const todo = await Todo.findOne({
      where: { id: todoId, TodoListId: todoList.id, UserId: req.user.userId },
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo item not found." });
    }
    await todo.destroy();
    res.status(200).json({ message: "Todo item deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
