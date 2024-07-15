// capstone/frontend/src/components/CustomNavbar.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import { List, X } from "react-bootstrap-icons";
import "../styles/CustomNavbar.css";

const CustomNavbar = ({ onLogout }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();

  const handleNavbarToggle = () => setShowNavbar(!showNavbar);

  const handleLogout = () => {
    onLogout();
    setShowNavbar(false);
    navigate("/");
  };

  return (
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
              <Button variant="danger" onClick={handleLogout} className="mt-3">
                Logout
              </Button>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
