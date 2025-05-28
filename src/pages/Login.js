import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; // <--- new import
import './FormPages.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null); // <-- new state
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
        recaptcha: recaptchaToken, // <-- include token
      });

      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Login failed. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4 form-card">
       <h2 
            className="mb-4 text-center text-primary" 
            style={{ 
                fontFamily: "'Rajdhani', monospace ", 
                fontWeight: 700,
                fontSize: '2rem',
                color: '#D2691E',
            }}
        >
                Login
        </h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" required value={username} onChange={(e) => setUsername(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3" style={{ position: 'relative' }}>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '38px', cursor: 'pointer', fontSize: '1.2rem' }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              role="button"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </Form.Group>

          <ReCAPTCHA
            sitekey="6LcBT00rAAAAALAAlmNoLopNZyqtJ9goLbokwMJr" // <-- replace with your site key
            onChange={(token) => setRecaptchaToken(token)}
            className="mt-3"
          />

          {error && <p className="text-danger mt-3">{error}</p>}

          <Button variant="primary" type="submit" className="mt-4 w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
