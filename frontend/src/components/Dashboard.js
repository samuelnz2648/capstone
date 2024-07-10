// frontend/src/components/Dashboard.js

import React, { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TodoContext } from "../context/TodoContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const Dashboard = () => {
  const [todoListName, setTodoListName] = useState("");
  const [savedTodoLists, setSavedTodoLists] = useState([]);
  const [selectedTodoList, setSelectedTodoList] = useState("");
  const [error, setError] = useState("");
  const { setTodos, setTodoListName: setContextTodoListName } =
    useContext(TodoContext);
  const { authToken, username, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchTodoLists = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setSavedTodoLists(response.data);
    } catch (error) {
      console.error("Error fetching saved todo lists:", error);
      setError("Failed to fetch todo lists. Please try again.");
    }
  }, [authToken]);

  useEffect(() => {
    if (authToken) {
      fetchTodoLists();
    }
  }, [authToken, fetchTodoLists]);

  const handleContinue = async (event) => {
    event.preventDefault();
    setError("");
    try {
      if (savedTodoLists.includes(todoListName)) {
        const response = await axios.get(`${API_URL}/todos/${todoListName}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setContextTodoListName(todoListName);
        setTodos(response.data);
      } else {
        await axios.post(
          `${API_URL}/todos/${todoListName}`,
          {},
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setContextTodoListName(todoListName);
        setTodos([]);
        setSavedTodoLists([...savedTodoLists, todoListName]);
      }
      navigate("/todos");
    } catch (error) {
      console.error("Error creating/loading the todo list:", error);
      setError("Failed to create/load todo list. Please try again.");
    }
  };

  const handleLoad = async () => {
    if (selectedTodoList) {
      try {
        const response = await axios.get(
          `${API_URL}/todos/${selectedTodoList}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setContextTodoListName(selectedTodoList);
        setTodos(response.data);
        navigate("/todos");
      } catch (error) {
        console.error("Error loading the todo list:", error);
        setError("Failed to load todo list. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (selectedTodoList) {
      try {
        await axios.delete(`${API_URL}/todos/${selectedTodoList}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setSavedTodoLists(
          savedTodoLists.filter((name) => name !== selectedTodoList)
        );
        setSelectedTodoList("");
      } catch (error) {
        console.error("Error deleting the todo list:", error);
        setError("Failed to delete todo list. Please try again.");
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
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Continue to Todo List
            </Button>
          </Form>
          <h2 className="mt-4">Saved Todo Lists</h2>
          <Row>
            <Col>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedTodoList(e.target.value)}
                value={selectedTodoList}
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
                disabled={!selectedTodoList}
                className="w-100"
              >
                Load
              </Button>
            </Col>
            <Col>
              <Button
                variant="danger"
                onClick={handleDelete}
                disabled={!selectedTodoList}
                className="w-100"
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
      >
        Logout
      </Button>
    </Container>
  );
};

export default Dashboard;
