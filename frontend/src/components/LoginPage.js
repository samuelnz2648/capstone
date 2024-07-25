// capstone/frontend/src/components/LoginPage.js

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Row, Col, Form, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      await login(username, password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Todo List Login</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form>
          <Button
            variant="secondary"
            className="w-100 mb-3"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
