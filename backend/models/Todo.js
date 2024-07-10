// backend/models/Todo.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Todo = sequelize.define(
  "Todo",
  {
    task: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // TodoListId is typically added automatically by Sequelize when associations are defined
  },
  {
    // Add timestamps for better tracking
    timestamps: true,
    // Ensure the table name doesn't get pluralized
    tableName: "Todos",
  }
);

module.exports = Todo;
