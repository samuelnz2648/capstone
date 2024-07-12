// frontend/src/components/RegisterPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  InputGroup,
} from "react-bootstrap";
import api from "../utils/api";

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = (password) => {
    let strength = 0;
    if (password.length > 7) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const strength = getStrength(password);

  return (
    <div className="password-strength-meter mt-2">
      <div
        className={`strength-${strength}`}
        style={{
          height: "5px",
          backgroundColor: ["red", "orange", "yellow", "green"][strength],
        }}
      ></div>
      <span className="small">
        {["Weak", "Fair", "Good", "Strong"][strength]}
      </span>
    </div>
  );
};

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (username.length < 3 || password.length < 6) {
      setError(
        "Username must be at least 3 characters and password at least 6 characters long."
      );
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service.");
      setIsLoading(false);
      return;
    }

    try {
      await api.post("/users/register", { username, password });
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(
          error.response.data.message ||
            "Account already registered. Please enter new details."
        );
      } else {
        setError("An error occurred during registration. Please try again.");
        console.error("Error registering:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Register</h1>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3" controlId="formUsername">
              <Form.Label>Create Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                minLength={3}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Create Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  minLength={6}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </InputGroup>
              <PasswordStrengthIndicator password={password} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTerms">
              <Form.Check
                type="checkbox"
                label="I agree to the Terms of Service"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100"
              disabled={isLoading || !agreeToTerms}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </Form>
        </Col>
      </Row>
      <Button
        variant="secondary"
        className="position-fixed bottom-0 end-0 m-3"
        onClick={() => navigate("/")}
      >
        Back to Login
      </Button>
    </Container>
  );
};

export default RegisterPage;
