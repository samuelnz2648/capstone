// frontend/src/components/SummaryPage.js

import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TodoContext } from "../context/TodoContext";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Button,
  Row,
  Col,
  ListGroup,
  Badge,
  Modal,
} from "react-bootstrap";

const SummaryPage = () => {
  const { todos, todoListName } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { completedTasks, incompleteTasks } = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed);
    const incomplete = todos.filter((todo) => !todo.completed);
    return { completedTasks: completed, incompleteTasks: incomplete };
  }, [todos]);

  const handleStartOver = () => navigate("/dashboard");

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  const renderTaskList = (tasks, badgeText, badgeVariant) => (
    <ListGroup className="mb-4">
      {tasks.length > 0 ? (
        tasks.map((todo, index) => (
          <ListGroup.Item
            key={todo.id || index}
            className="d-flex justify-content-between align-items-center"
          >
            {todo.task}
            <Badge
              bg={badgeVariant}
              text={badgeVariant === "warning" ? "dark" : undefined}
              pill
            >
              {badgeText}
            </Badge>
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No {badgeText.toLowerCase()} tasks</ListGroup.Item>
      )}
    </ListGroup>
  );

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Summary: {todoListName}</h1>
      <Row>
        <Col md={6}>
          <h2>
            Completed Tasks <Badge bg="success">{completedTasks.length}</Badge>
          </h2>
          {renderTaskList(completedTasks, "Done", "success")}
        </Col>
        <Col md={6}>
          <h2>
            Incomplete Tasks{" "}
            <Badge bg="warning" text="dark">
              {incompleteTasks.length}
            </Badge>
          </h2>
          {renderTaskList(incompleteTasks, "Pending", "warning")}
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={4}>
          <Button
            variant="secondary"
            onClick={() => navigate("/todos")}
            className="w-100 mb-2"
            aria-label="Back to List"
          >
            Back to List
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="primary"
            onClick={handleStartOver}
            className="w-100 mb-2"
            aria-label="Go to Dashboard"
          >
            Go to Dashboard
          </Button>
        </Col>
        <Col md={4}>
          <Button
            variant="danger"
            onClick={() => setShowLogoutModal(true)}
            className="w-100 mb-2"
            aria-label="Logout"
          >
            Logout
          </Button>
        </Col>
      </Row>

      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SummaryPage;
