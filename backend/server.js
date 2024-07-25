// capstone/backend/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createDatabase, sequelize } = require("./config/database");
const todoRoutes = require("./routes/todoRoutes");
const userRoutes = require("./routes/userRoutes");
const todoItemRoutes = require("./routes/todoItemRoutes");

// Import associations
require("./models/associations");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos/:todoListName/todos", todoItemRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  try {
    await createDatabase();
    await sequelize.sync({ alter: true }); // This will add the new UserId column
    console.log("Database synced");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();