// capstone/backend/config/database.js

const { Sequelize } = require("sequelize");

const createDatabase = async () => {
  const tempSequelize = new Sequelize(
    "mysql",
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
    }
  );

  try {
    await tempSequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`
    );
    console.log("Database created or already exists.");
  } catch (error) {
    console.error("Unable to create database:", error);
  } finally {
    await tempSequelize.close();
  }
};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

module.exports = {
  createDatabase,
  sequelize,
};
