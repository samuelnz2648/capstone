// capstone/frontend/src/components/CustomNavbar.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Container, Nav, Offcanvas, Button } from "react-bootstrap";
import { List, X } from "react-bootstrap-icons";
import "../styles/CustomNavbar.css";

const CustomNavbar = ({ onLogout, onNavbarToggle }) => {
  const [showNavbar, setShowNavbar] = useState(false);
  const navigate = useNavigate();

  const handleNavbarToggle = () => {
    const newShowNavbar = !showNavbar;
    setShowNavbar(newShowNavbar);
    onNavbarToggle(newShowNavbar);
  };

  const handleLogout = () => {
    onLogout();
    setShowNavbar(false);
    navigate("/");
  };

  useEffect(() => {
    onNavbarToggle(showNavbar);
  }, [showNavbar, onNavbarToggle]);

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
          onHide={() => handleNavbarToggle()}
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
