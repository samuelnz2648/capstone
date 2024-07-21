// capstone/backend/routes/todoRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const User = require("../models/User");

// Helper function to find todo list
const findTodoList = async (username, todoListName) => {
  return await TodoList.findOne({
    where: { name: todoListName },
    include: [{ model: User, where: { username } }, { model: Todo }],
  });
};

// GET all todo lists
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todoLists = await TodoList.findAll({
      attributes: ["name"],
      include: {
        model: User,
        where: { username: req.user.username },
        attributes: [],
      },
    });

    const todoListNames = todoLists.map((list) => list.name);
    res.status(200).json(todoListNames);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// GET specific todo list
router.get("/:todoListName", authMiddleware, async (req, res) => {
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    const todoList = await findTodoList(req.user.username, decodedTodoListName);

    if (!todoList) {
      return res.status(404).json({ message: "Todo list not found." });
    }

    res.status(200).json(todoList.Todos);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// POST new todo list
router.post("/:todoListName", authMiddleware, async (req, res) => {
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    const user = await User.findOne({ where: { username: req.user.username } });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newList = await TodoList.create({
      name: decodedTodoListName,
      UserId: user.id,
    });

    res.status(201).json({
      message: `Todo list ${decodedTodoListName} created.`,
      todoList: {
        id: newList.id,
        name: newList.name,
        createdAt: newList.createdAt,
        updatedAt: newList.updatedAt,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ message: "A todo list with this name already exists." });
    }
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// DELETE todo list
router.delete("/:todoListName", authMiddleware, async (req, res) => {
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    const todoList = await findTodoList(req.user.username, decodedTodoListName);

    if (todoList) {
      await TodoList.destroy({ where: { id: todoList.id } });
    }

    res
      .status(200)
      .json({ message: `Todo list ${decodedTodoListName} deleted.` });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
