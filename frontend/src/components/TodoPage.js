// capstone/frontend/src/components/TodoPage.js

import React, { useState, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import TodoList from "./TodoList";
import { TodoContext } from "../context/TodoContext";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Modal,
  Spinner,
} from "react-bootstrap";
import { debounce } from "lodash";

const TodoPage = () => {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [filterCompleted, setFilterCompleted] = useState("all");
  const { todos, setTodos, todoListName } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const updateTodoList = useCallback(
    debounce(async (newTodos) => {
      setIsLoading(true);
      try {
        await api.put(`/todos/${encodeURIComponent(todoListName)}`, {
          todos: newTodos,
        });
        setTodos(newTodos);
      } catch (error) {
        console.error(
          "Error updating todo list:",
          error.response?.data || error.message
        );
        setError("Failed to update todo list. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [todoListName, setTodos]
  );

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (filterCompleted === "completed") return todo.completed;
      if (filterCompleted === "active") return !todo.completed;
      return true;
    });
  }, [todos, filterCompleted]);

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
    setTodoToDelete(index);
    setShowDeleteModal(true);
  };

  const confirmDeleteTodo = async () => {
    const newTodos = todos.filter((_, i) => i !== todoToDelete);
    await updateTodoList(newTodos);
    setShowDeleteModal(false);
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
          <Form.Group className="mb-3">
            <Form.Label>Sort By</Form.Label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Filter</Form.Label>
            <Form.Select
              value={filterCompleted}
              onChange={(e) => setFilterCompleted(e.target.value)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
          {isLoading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <TodoList
              todos={filteredTodos}
              updateTodo={handleUpdateTodo}
              deleteTodo={handleDeleteTodo}
              completeTodo={handleCompleteTodo}
              sortBy={sortBy}
            />
          )}
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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this todo?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteTodo}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TodoPage;
