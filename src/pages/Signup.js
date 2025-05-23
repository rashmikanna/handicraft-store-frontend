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
    const [pwdErrors, setPwdErrors] = useState([]);

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(false);
        setMsg('');
        setPwdErrors([]);

        try {
            const role = 'consumer';
            const res = await axios.post('http://127.0.0.1:8000/api/signup/', {
                username,
                email,
                password,
                role,
            });

            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            localStorage.setItem('username', res.data.username);
            localStorage.setItem('role', res.data.role);

            setMsg('Signup successful!');
            setTimeout(() => navigate('/'), 1000);
        } catch (error) {
            setErr(true);
            const pwdErrs = error.response?.data?.password_errors;
            if (Array.isArray(pwdErrs)) {
                setPwdErrors(pwdErrs);
            } else {
                setMsg(error.response?.data?.error || error.response?.data?.detail || 'Signup failed.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="p-4 form-card" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="mb-4 text-center">Create Account</h2>

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

                    {/* Backend password validation messages */}
                    {pwdErrors.length > 0 && (
                        <Alert variant="warning" className="mt-2">
                            <ul className="mb-0">
                                {pwdErrors.map((e, i) => <li key={i}>{e}</li>)}
                            </ul>
                        </Alert>
                    )}

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
