// capstone/frontend/src/components/SummaryPage.js

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
  Navbar,
  Nav,
  Offcanvas,
} from "react-bootstrap";
import { List, X } from "react-bootstrap-icons";

const SummaryPage = () => {
  const { todos, todoListName } = useContext(TodoContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showNavbar, setShowNavbar] = useState(false);

  const { completedTasks, incompleteTasks } = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed);
    const incomplete = todos.filter((todo) => !todo.completed);
    return { completedTasks: completed, incompleteTasks: incomplete };
  }, [todos]);

  const handleStartOver = () => navigate("/dashboard");

  const handleNavbarToggle = () => setShowNavbar(!showNavbar);

  const handleLogout = () => {
    logout();
    setShowNavbar(false);
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
    <div className="d-flex">
      <Navbar expand={false} className="navbar-custom" variant="light">
        <Container fluid className="p-0">
          <Navbar.Toggle onClick={handleNavbarToggle} className="border-0">
            {showNavbar ? <X size={30} /> : <List size={30} />}
          </Navbar.Toggle>
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="start"
            show={showNavbar}
            onHide={() => setShowNavbar(false)}
            className="navbar-custom-offcanvas"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  className="mt-3"
                >
                  Logout
                </Button>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>

      <Container
        className={`mt-5 ${showNavbar ? "content-shifted" : ""}`}
        style={{ paddingBottom: "80px" }}
      >
        <h1 className="text-center mb-4">Summary: {todoListName}</h1>
        <Row>
          <Col md={6}>
            <h2>
              Completed Tasks{" "}
              <Badge bg="success">{completedTasks.length}</Badge>
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
      </Container>

      <div className="fixed-bottom bg-white py-3">
        <Container>
          <Row>
            <Col>
              <Button
                variant="secondary"
                onClick={() => navigate("/todos")}
                className="w-100"
                aria-label="Back to List"
              >
                Back to List
              </Button>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={handleStartOver}
                className="w-100"
                aria-label="Go to Dashboard"
              >
                Go to Dashboard
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default SummaryPage;
