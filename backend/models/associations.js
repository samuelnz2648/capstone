// capstone/backend/models/associations.js

const User = require("./User");
const TodoList = require("./TodoList");
const Todo = require("./Todo");

User.hasMany(TodoList);
TodoList.belongsTo(User);

User.hasMany(Todo);
Todo.belongsTo(User);

TodoList.hasMany(Todo);
Todo.belongsTo(TodoList);

module.exports = { User, TodoList, Todo };
