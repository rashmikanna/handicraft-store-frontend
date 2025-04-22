import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './FormPages.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);  // New state for loading indicator
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);  // Show loading indicator

    // Simple validation
    if (!email.includes('@')) {
      setMessage('Please enter a valid email address.');
      setError(true);
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/signup/', {
        username,
        email,
        password,
      });

      setMessage('Signup successful! You can now login.');
      setError(false);
      setTimeout(() => navigate('/login'), 2000);  // Redirect to login after 2 seconds
    } catch (error) {
      const errorMsg = error.response ? error.response.data.detail : 'Signup failed. Please try again.';
      setMessage(errorMsg);
      setError(true);
    } finally {
      setLoading(false);  // Hide loading indicator
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 form-card">
        <h2 className="mb-4 text-center text-success">Sign Up</h2>
        <Form onSubmit={handleSignup}>
          <Form.Group controlId="username">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="email" className="mt-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="mt-4 w-100" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
          </Button>
        </Form>

        {/* Display success or error messages */}
        {message && (
          <Alert variant={error ? 'danger' : 'success'} className="mt-3">
            {message}
          </Alert>
        )}
      </Card>
    </Container>
  );
}

export default Signup;
