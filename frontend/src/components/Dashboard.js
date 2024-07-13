// capstone/frontend/src/components/Dashboard.js

import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
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

const Dashboard = () => {
  const [todoListName, setTodoListName] = useState("");
  const [savedTodoLists, setSavedTodoLists] = useState([]);
  const [selectedTodoList, setSelectedTodoList] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { setTodos, setTodoListName: setContextTodoListName } =
    useContext(TodoContext);
  const { username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTodoLists = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/todos");
      setSavedTodoLists(response.data);
    } catch (error) {
      console.error("Error fetching saved todo lists:", error);
      setError("Failed to fetch todo lists. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodoLists();
  }, [fetchTodoLists]);

  const handleContinue = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      if (savedTodoLists.includes(todoListName)) {
        const response = await api.get(`/todos/${todoListName}`);
        setContextTodoListName(todoListName);
        setTodos(response.data);
      } else {
        await api.post(`/todos/${todoListName}`);
        setContextTodoListName(todoListName);
        setTodos([]);
        setSavedTodoLists([...savedTodoLists, todoListName]);
      }
      navigate("/todos");
    } catch (error) {
      console.error("Error creating/loading the todo list:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create/load todo list. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    if (selectedTodoList) {
      setIsLoading(true);
      try {
        const response = await api.get(`/todos/${selectedTodoList}`);
        setContextTodoListName(selectedTodoList);
        setTodos(response.data);
        navigate("/todos");
      } catch (error) {
        console.error("Error loading the todo list:", error);
        setError(
          error.response?.data?.message ||
            "Failed to load todo list. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedTodoList) {
      setIsLoading(true);
      try {
        await api.delete(`/todos/${selectedTodoList}`);
        setSavedTodoLists(
          savedTodoLists.filter((name) => name !== selectedTodoList)
        );
        setSelectedTodoList("");
        setShowDeleteModal(false);
      } catch (error) {
        console.error("Error deleting the todo list:", error);
        setError(
          error.response?.data?.message ||
            "Failed to delete todo list. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center">{`Welcome ${username}`}</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleContinue}>
            <Form.Group className="mb-3" controlId="formTodoListName">
              <Form.Label>Create Todo List</Form.Label>
              <Form.Control
                type="text"
                value={todoListName}
                onChange={(e) => setTodoListName(e.target.value)}
                placeholder="Enter Todo List Name"
                required
                aria-label="Todo List Name"
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Continue to Todo List"
              )}
            </Button>
          </Form>
          <h2 className="mt-4">Saved Todo Lists</h2>
          <Row>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedTodoList(e.target.value)}
                value={selectedTodoList}
                aria-label="Select a Todo List"
              >
                <option value="" disabled>
                  Select a Todo List
                </option>
                {savedTodoLists.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={handleLoad}
                disabled={!selectedTodoList || isLoading}
                className="w-100"
                aria-label="Load Selected Todo List"
              >
                Load
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={!selectedTodoList || isLoading}
                className="w-100"
                aria-label="Delete Selected Todo List"
              >
                Delete
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button
        variant="danger"
        className="position-fixed bottom-0 end-0 m-3"
        onClick={handleLogout}
        aria-label="Logout"
      >
        Logout
      </Button>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the todo list "{selectedTodoList}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Dashboard;
