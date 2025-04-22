import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function NavbarComponent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check login status on every render
    const token = localStorage.getItem('access');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false); // Update UI
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          KalaKart
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="text-dark">Home</Nav.Link>
            <Nav.Link as={Link} to="/products" className="text-dark">Products</Nav.Link>
            <Nav.Link as={Link} to="/cart" className="text-dark">Cart</Nav.Link>
            <Nav.Link as={Link} to="/checkout" className="text-dark">Checkout</Nav.Link>
            <Nav.Link as={Link} to="/contact" className="text-dark">Contact</Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-dark">About</Nav.Link>

            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} className="text-danger">Logout</Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-dark">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="text-dark">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;
