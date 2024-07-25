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

## Introduction

This Todo List application is a full-stack project developed to manage tasks efficiently. It allows users to create, update, delete, and view tasks in a structured manner. The project consists of a backend built with Node.js and Express, and a frontend developed with React and Bootstrap.

## Features

- User Registration and Login
- Create, Read, Update, and Delete (CRUD) operations for todo lists and tasks
- User-specific todos (each user can only see and manage their own todos)
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
- MySQL server installed and running

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/todo-list-app.git
   cd todo-list-app
   ```

2. Backend Setup:

   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory and add your MySQL configuration:

   ```
   PORT=3001
   JWT_SECRET=supersecretkey1234567890abcdef
   DB_NAME=todo_app
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   ```

3. Frontend Setup:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

## Usage

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

   The server will automatically create the database and tables if they don't exist.

2. Start the frontend development server:

   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and go to `http://localhost:3000`

4. Register a new user account and start managing your todo lists!

## API Endpoints

### User Routes

- Register a new user
  - `POST /api/users/register`
  - Request body: `{ "username": "example", "password": "password123" }`
- Login a user
  - `POST /api/users/login`
  - Request body: `{ "username": "example", "password": "password123" }`

### Todo Routes

- Get all todo lists for the authenticated user
  - `GET /api/todos`
  - Headers: `Authorization: Bearer <token>`
- Get a specific todo list for the authenticated user
  - `GET /api/todos/:todoListName`
  - Headers: `Authorization: Bearer <token>`
- Create a new todo list for the authenticated user
  - `POST /api/todos/:todoListName`
  - Headers: `Authorization: Bearer <token>`
- Update a todo list for the authenticated user
  - `PUT /api/todos/:todoListName`
  - Headers: `Authorization: Bearer <token>`
  - Request body: `{ "todos": [{ "task": "New Task", "completed": false }] }`
- Delete a todo list for the authenticated user
  - `DELETE /api/todos/:todoListName`
  - Headers: `Authorization: Bearer <token>`

## Testing

### Backend

Run backend tests:

```bash
cd backend
npm run test
```

### Frontend

Run frontend tests:

```bash
cd frontend
npm run test
```

## Folder Structure

```
todo-list-app/
├── backend/
│   ├── __tests__/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   ├── .env
│   ├── package.json
├── README.md
```
