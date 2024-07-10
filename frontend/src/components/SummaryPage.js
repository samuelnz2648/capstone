// frontend/src/components/SummaryPage.js

import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TodoContext } from "../context/TodoContext";
import { AuthContext } from "../context/AuthContext";
import { Container, Button, Row, Col, ListGroup, Badge } from "react-bootstrap";

const SummaryPage = () => {
  const { todos, todoListName } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const { completedTasks, incompleteTasks } = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed);
    const incomplete = todos.filter((todo) => !todo.completed);
    return { completedTasks: completed, incompleteTasks: incomplete };
  }, [todos]);

  const handleStartOver = () => navigate("/dashboard");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Summary: {todoListName}</h1>
      <Row>
        <Col md={6}>
          <h2>
            Completed Tasks <Badge bg="success">{completedTasks.length}</Badge>
          </h2>
          <ListGroup className="mb-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((todo, index) => (
                <ListGroup.Item
                  key={todo.id || index}
                  className="d-flex justify-content-between align-items-center"
                >
                  {todo.task}
                  <Badge bg="success" pill>
                    Done
                  </Badge>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No completed tasks</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
        <Col md={6}>
          <h2>
            Incomplete Tasks{" "}
            <Badge bg="warning" text="dark">
              {incompleteTasks.length}
            </Badge>
          </h2>
          <ListGroup className="mb-4">
            {incompleteTasks.length > 0 ? (
              incompleteTasks.map((todo, index) => (
                <ListGroup.Item
                  key={todo.id || index}
                  className="d-flex justify-content-between align-items-center"
                >
                  {todo.task}
                  <Badge bg="warning" text="dark" pill>
                    Pending
                  </Badge>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No incomplete tasks</ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4}>
          <Button
            variant="secondary"
            onClick={() => navigate("/todos")}
            className="w-100 mb-2"
          >
            Back to List
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="primary"
            onClick={handleStartOver}
            className="w-100 mb-2"
          >
            Go to Dashboard
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-100 mb-2"
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SummaryPage;
