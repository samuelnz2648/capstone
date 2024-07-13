// capstone/backend/routes/todoRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const User = require("../models/User");
const { Op } = require("sequelize");

// Helper function to find user and todo list
const findUserAndTodoList = async (username, todoListName) => {
  const user = await User.findOne({
    where: { username },
    include: {
      model: TodoList,
      where: { name: { [Op.like]: todoListName } },
      include: Todo,
    },
  });
  return user;
};

// GET all todo lists
router.get("/", authMiddleware, async (req, res) => {
  console.log("GET / - Fetching all todo lists");
  try {
    const user = await User.findOne({
      where: { username: req.user.username },
      include: TodoList,
    });

    if (!user) {
      console.log(`User not found: ${req.user.username}`);
      return res.status(404).json({ message: "User not found." });
    }

    const todoListNames = user.TodoLists.map((list) => list.name);
    console.log(`Todo lists fetched for ${req.user.username}:`, todoListNames);
    res.status(200).json(todoListNames);
  } catch (error) {
    console.error("Error in GET /:", error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// GET specific todo list
router.get("/:todoListName", authMiddleware, async (req, res) => {
  console.log(`GET /${req.params.todoListName} - Fetching specific todo list`);
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    const user = await findUserAndTodoList(
      req.user.username,
      decodedTodoListName
    );

    if (!user) {
      console.log(`User not found: ${req.user.username}`);
      return res.status(404).json({ message: "User not found." });
    }

    const todoList = user.TodoLists[0];
    console.log(`Todo list fetched:`, todoList);
    res.status(200).json(todoList ? todoList.Todos : []);
  } catch (error) {
    console.error(`Error in GET /${req.params.todoListName}:`, error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// POST new todo list
router.post("/:todoListName", authMiddleware, async (req, res) => {
  console.log(`POST /${req.params.todoListName} - Creating new todo list`);
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    const user = await User.findOne({ where: { username: req.user.username } });

    if (!user) {
      console.log(`User not found: ${req.user.username}`);
      return res.status(404).json({ message: "User not found." });
    }

    const newList = await TodoList.create({
      name: decodedTodoListName,
      UserId: user.id,
    });
    console.log(`New todo list created:`, newList);

    res
      .status(201)
      .json({ message: `Todo list ${decodedTodoListName} created.` });
  } catch (error) {
    console.error(`Error in POST /${req.params.todoListName}:`, error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// PUT (update) todo list
router.put("/:todoListName", authMiddleware, async (req, res) => {
  console.log(`PUT /${req.params.todoListName} - Updating todo list`);
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    console.log(`Request body:`, req.body);

    const user = await findUserAndTodoList(
      req.user.username,
      decodedTodoListName
    );

    if (!user) {
      console.log(`User not found: ${req.user.username}`);
      return res.status(404).json({ message: "User not found." });
    }

    let todoList = user.TodoLists[0];
    if (!todoList) {
      todoList = await TodoList.create({
        name: decodedTodoListName,
        UserId: user.id,
      });
    }

    if (!Array.isArray(req.body.todos)) {
      console.log(`Invalid todos data received:`, req.body.todos);
      return res.status(400).json({ message: "Invalid todos data." });
    }

    await Todo.destroy({ where: { TodoListId: todoList.id } });

    const createdTodos = await Todo.bulkCreate(
      req.body.todos.map((todo) => ({
        task: todo.task,
        completed: todo.completed,
        TodoListId: todoList.id,
      }))
    );
    console.log(`New todos created:`, createdTodos);

    res
      .status(200)
      .json({ message: `Todo list ${decodedTodoListName} updated.` });
  } catch (error) {
    console.error(`Error in PUT /${req.params.todoListName}:`, error);
    res.status(500).json({
      message: "Server error.",
      error: error.message,
      stack: error.stack,
    });
  }
});

// DELETE todo list
router.delete("/:todoListName", authMiddleware, async (req, res) => {
  console.log(`DELETE /${req.params.todoListName} - Deleting todo list`);
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);
    const user = await findUserAndTodoList(
      req.user.username,
      decodedTodoListName
    );

    if (!user) {
      console.log(`User not found: ${req.user.username}`);
      return res.status(404).json({ message: "User not found." });
    }

    const todoList = user.TodoLists[0];
    if (todoList) {
      await TodoList.destroy({ where: { id: todoList.id } });
      console.log(`Todo list deleted: ${todoList.id}`);
    } else {
      console.log(`Todo list not found: ${decodedTodoListName}`);
    }

    res
      .status(200)
      .json({ message: `Todo list ${decodedTodoListName} deleted.` });
  } catch (error) {
    console.error(`Error in DELETE /${req.params.todoListName}:`, error);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
