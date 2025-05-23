// Signup.jsx – for Buyers Only (role = consumer)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(false);
        try {
            const role = 'producer'; 

            const res = await axios.post('http://127.0.0.1:8000/api/signup/', {
                username,
                email,
                password,
                role,
            });

            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('role', role);

            setMsg('Signup successful!');
            setTimeout(() => navigate('/producer/dashboard'), 1000); 
        } catch (error) {
            setErr(true);
            setMsg(error.response?.data?.detail || 'Signup failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="p-4 form-card">
                <h2 className="mb-4 text-center">Sign Up as Seller</h2>
                <Form onSubmit={handleSignup}>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            required
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mt-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-4 w-100"
                        disabled={loading}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
                    </Button>
                </Form>

                {msg && (
                    <Alert variant={err ? 'danger' : 'success'} className="mt-3">
                        {msg}
                    </Alert>
                )}
            </Card>
        </Container>
    );
}

