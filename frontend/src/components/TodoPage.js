// frontend/src/components/TodoPage.js
import React, { useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TodoList from "./TodoList";
import { TodoContext } from "../context/TodoContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const TodoPage = () => {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const { todos, setTodos, todoListName } = useContext(TodoContext);
  const { logout, authToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const updateTodoList = useCallback(
    async (newTodos) => {
      try {
        await axios.put(
          `${API_URL}/todos/${encodeURIComponent(todoListName)}`,
          { todos: newTodos },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        setTodos(newTodos);
      } catch (error) {
        console.error(
          "Error updating todo list:",
          error.response?.data || error.message
        );
        setError("Failed to update todo list. Please try again.");
      }
    },
    [authToken, todoListName, setTodos]
  );

  const handleAddTodo = async (event) => {
    event.preventDefault();
    if (task.trim() === "") return;

    const newTodos = [...todos, { task: task.trim(), completed: false }];
    await updateTodoList(newTodos);
    setTask("");
  };

  const handleUpdateTodo = async (index, updatedTask) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, task: updatedTask } : todo
    );
    await updateTodoList(newTodos);
  };

  const handleDeleteTodo = async (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    await updateTodoList(newTodos);
  };

  const handleCompleteTodo = async (index) => {
    const newTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    await updateTodoList(newTodos);
  };

  const handleFinish = () => navigate("/summary");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">{todoListName}</h1>
      {error && (
        <Alert variant="danger" onClose={() => setError("")} dismissible>
          {error}
        </Alert>
      )}
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form onSubmit={handleAddTodo} className="mb-4">
            <Form.Group controlId="formTask">
              <Form.Label>Enter Your Task</Form.Label>
              <Form.Control
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter Your Task"
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 mt-3">
              Add Todo
            </Button>
          </Form>
          <TodoList
            todos={todos}
            updateTodo={handleUpdateTodo}
            deleteTodo={handleDeleteTodo}
            completeTodo={handleCompleteTodo}
          />
          <Row className="mt-4">
            <Col>
              <Button
                variant="secondary"
                onClick={() => navigate("/dashboard")}
                className="w-100"
              >
                Back to Dashboard
              </Button>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={handleFinish}
                className="w-100"
              >
                View Summary
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button
        variant="danger"
        className="position-fixed bottom-0 end-0 m-3"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Container>
  );
};

export default TodoPage;
