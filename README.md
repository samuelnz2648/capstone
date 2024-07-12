# Todo List Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Folder Structure](#folder-structure)
- [Database Schema](#Database-Schema)
- [License](#license)

## Introduction

This Todo List application is a full-stack project developed to manage tasks efficiently. It allows users to create, update, delete, and view tasks in a structured manner. The project consists of a backend built with Node.js and Express, and a frontend developed with React and Bootstrap.

## Features

- User Registration and Login
- Create, Read, Update, and Delete (CRUD) operations for todo lists and tasks
- User authentication with JSON Web Tokens (JWT)
- Responsive user interface
- Unit testing for both backend and frontend

## Technologies Used

### Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JSON Web Tokens (JWT)
- Jest and Supertest (for testing)

### Frontend

- React
- Bootstrap
- React Router
- Axios
- React Context API

## Installation

### Prerequisites

- Node.js and npm installed
- MySQL database set up

### Steps

1. **Clone the repository:**
   \`\`\`bash
   git clone https://github.com/your-username/todo-list-app.git
   cd todo-list-app
   \`\`\`

2. **Backend Setup:**

   - Navigate to the backend directory:
     \`\`\`bash
     cd backend
     \`\`\`
   - Create a \`.env\` file in the backend directory and add your MySQL database configuration:
     \`\`\`
     PORT=3001
     JWT_SECRET=supersecretkey1234567890abcdef
     DB_NAME=todo_app
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_HOST=localhost
     \`\`\`
   - Install backend dependencies:
     \`\`\`bash
     npm install
     \`\`\`
   - Start the backend server:
     \`\`\`bash
     npm run dev
     \`\`\`

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     \`\`\`bash
     cd ../frontend
     \`\`\`
   - Create a \`.env\` file in the frontend directory:
     \`\`\`
     REACT_APP_API_URL=http://localhost:3001/api
     \`\`\`
   - Install frontend dependencies:
     \`\`\`bash
     npm install
     \`\`\`
   - Start the frontend development server:
     \`\`\`bash
     npm start
     \`\`\`

## Usage

1. **Register a new user:**

   - Open your browser and go to \`http://localhost:3000\`
   - Click on the "Register" button and create a new user account

2. **Login:**

   - After registering, login with your credentials

3. **Manage Todo Lists:**
   - Create new todo lists, add tasks, update task status, and delete tasks as needed

## API Endpoints

### User Routes

- **Register a new user**
  - \`POST /api/users/register\`
  - Request body: \`{ "username": "example", "password": "password123" }\`
- **Login a user**
  - \`POST /api/users/login\`
  - Request body: \`{ "username": "example", "password": "password123" }\`

### Todo Routes

- **Get all todo lists**
  - \`GET /api/todos\`
  - Headers: \`Authorization: Bearer <token>\`
- **Get a specific todo list**
  - \`GET /api/todos/:todoListName\`
  - Headers: \`Authorization: Bearer <token>\`
- **Create a new todo list**
  - \`POST /api/todos/:todoListName\`
  - Headers: \`Authorization: Bearer <token>\`
- **Update a todo list**
  - \`PUT /api/todos/:todoListName\`
  - Headers: \`Authorization: Bearer <token>\`
  - Request body: \`{ "todos": [{ "task": "New Task", "completed": false }] }\`
- **Delete a todo list**
  - \`DELETE /api/todos/:todoListName\`
  - Headers: \`Authorization: Bearer <token>\`

## Testing

### Backend

- Run backend tests:
  \`\`\`bash
  cd backend
  npm run test
  \`\`\`

### Frontend

- Run frontend tests:
  \`\`\`bash
  cd frontend
  npm run test
  \`\`\`

## Folder Structure

\`\`\`
todo-list-app/
├── backend/
│ ├── **tests**/
│ ├── config/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── .env
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── utils/
│ │ ├── App.js
│ │ ├── index.js
│ ├── .env
│ ├── package.json
├── README.md
\`\`\`

## Database Schema

To set up the MySQL database for this project, execute the following SQL commands:

```sql
CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE todo_lists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  todo_list_id INT,
  FOREIGN KEY (todo_list_id) REFERENCES todo_lists(id)
);
```
