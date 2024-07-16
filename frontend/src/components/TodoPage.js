// capstone/frontend/src/components/TodoPage.js

import React, {
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
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
import CustomNavbar from "./CustomNavbar";
import { debounce } from "lodash";
import "../styles/TodoPage.css";

const TodoPage = () => {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [filterCompleted, setFilterCompleted] = useState("all");
  const [showButtons, setShowButtons] = useState(true);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const { todos, setTodos, todoListName } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const debouncedApiCall = useMemo(
    () =>
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

  const updateTodoList = useCallback(
    (newTodos) => {
      debouncedApiCall(newTodos);
    },
    [debouncedApiCall]
  );

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      setShowButtons(false);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowButtons(true), 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const filteredAndSortedTodos = useMemo(() => {
    let filteredTodos = todos;

    if (filterCompleted === "completed") {
      filteredTodos = todos.filter((todo) => todo.completed);
    } else if (filterCompleted === "active") {
      filteredTodos = todos.filter((todo) => !todo.completed);
    }

    if (sortBy === "completed") {
      return [...filteredTodos].sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? -1 : 1
      );
    }
    return filteredTodos;
  }, [todos, sortBy, filterCompleted]);

  const handleAddTodo = (event) => {
    event.preventDefault();
    if (task.trim() === "") return;
    const newTodo = {
      id: Date.now(),
      task: task.trim(),
      completed: false,
    };
    const newTodos = [...todos, newTodo];
    updateTodoList(newTodos);
    setTask("");
  };

  const handleUpdateTodo = (id, updatedTask) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, task: updatedTask } : todo
    );
    updateTodoList(newTodos);
  };

  const handleDeleteTodo = (id) => {
    setTodoToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteTodo = () => {
    const newTodos = todos.filter((todo) => todo.id !== todoToDelete);
    updateTodoList(newTodos);
    setShowDeleteModal(false);
  };

  const handleCompleteTodo = (id) => {
    const newTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    updateTodoList(newTodos);
  };

  return (
    <div className="d-flex">
      <CustomNavbar
        onLogout={logout}
        onNavbarToggle={(isOpen) => setIsNavbarOpen(isOpen)}
      />
      <Container
        className={`mt-5 ${isNavbarOpen ? "content-shifted" : ""}`}
        style={{ paddingBottom: "120px" }}
      >
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
              <div className="todo-list-container">
                <TodoList
                  todos={filteredAndSortedTodos}
                  updateTodo={handleUpdateTodo}
                  deleteTodo={handleDeleteTodo}
                  completeTodo={handleCompleteTodo}
                />
              </div>
            )}
          </Col>
        </Row>

        <div
          className={`fixed-bottom bg-white py-3 transition-opacity ${
            showButtons ? "opacity-100" : "opacity-0"
          }`}
          style={{
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <Container>
            <Row>
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
                  onClick={() => navigate("/summary")}
                  className="w-100"
                >
                  View Summary
                </Button>
              </Col>
            </Row>
          </Container>
        </div>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this todo?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteTodo}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default TodoPage;
