// frontend/src/components/NotFound.js

import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6} className="text-center">
          <h1>404 - Page Not Found</h1>
          <p>The page you are looking for does not exist.</p>
          <Button onClick={() => navigate("/")} variant="primary">
            Go to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
