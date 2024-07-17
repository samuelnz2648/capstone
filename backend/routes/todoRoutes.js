// capstone/backend/routes/todoRoutes.js

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const TodoList = require("../models/TodoList");
const Todo = require("../models/Todo");
const User = require("../models/User");
const { Op } = require("sequelize");

// Helper function to find todo list
const findTodoList = async (username, todoListName) => {
  return await TodoList.findOne({
    where: { name: { [Op.like]: todoListName } },
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

// PUT (update) todo list
router.put("/:todoListName", authMiddleware, async (req, res) => {
  try {
    const decodedTodoListName = decodeURIComponent(req.params.todoListName);

    let todoList = await findTodoList(req.user.username, decodedTodoListName);

    if (!todoList) {
      const user = await User.findOne({
        where: { username: req.user.username },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      todoList = await TodoList.create({
        name: decodedTodoListName,
        UserId: user.id,
      });
    }

    if (!Array.isArray(req.body.todos)) {
      return res.status(400).json({ message: "Invalid todos data." });
    }

    // Get existing todos
    const existingTodos = await Todo.findAll({
      where: { TodoListId: todoList.id },
    });

    // Create a map for quick lookup
    const existingTodosMap = new Map(
      existingTodos.map((todo) => [todo.id, todo])
    );

    // Process incoming todos
    const todosToCreate = [];
    const todosToUpdate = [];

    req.body.todos.forEach((incomingTodo) => {
      if (incomingTodo.id && existingTodosMap.has(incomingTodo.id)) {
        // Update existing todo
        todosToUpdate.push(incomingTodo);
        existingTodosMap.delete(incomingTodo.id);
      } else {
        // New todo to create
        todosToCreate.push({
          task: incomingTodo.task,
          completed: incomingTodo.completed,
          TodoListId: todoList.id,
        });
      }
    });

    // Any todos left in existingTodosMap should be deleted
    const todosToDelete = Array.from(existingTodosMap.keys());

    // Perform database operations
    await Promise.all([
      Todo.bulkCreate(todosToCreate, { returning: true }),
      ...todosToUpdate.map((todo) =>
        Todo.update(
          { task: todo.task, completed: todo.completed },
          { where: { id: todo.id } }
        )
      ),
      Todo.destroy({ where: { id: todosToDelete } }),
    ]);

    res
      .status(200)
      .json({ message: `Todo list ${decodedTodoListName} updated.` });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error.message,
      stack: error.stack,
    });
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
