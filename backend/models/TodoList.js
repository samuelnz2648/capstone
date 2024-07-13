// capstone/backend/models/TodoList.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TodoList = sequelize.define(
  "TodoList",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    // UserId is typically added automatically by Sequelize when associations are defined
  },
  {
    timestamps: true,
    tableName: "TodoLists",
    indexes: [
      {
        unique: true,
        fields: ["name", "UserId"],
      },
    ],
  }
);

module.exports = TodoList;
