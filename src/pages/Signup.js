import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; 
import { Link } from 'react-router-dom';


export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pwdErrors, setPwdErrors] = useState([]);
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null); 

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErr(false);
        setMsg('');
        setPwdErrors([]);

        if (!captchaToken) {
            setMsg('Please complete the reCAPTCHA');
            setErr(true);
            setLoading(false);
            return;
        }

        try {
            const role = 'consumer';
            const res = await axios.post('http://127.0.0.1:8000/api/signup/', {
                username,
                email,
                password,
                role,
                recaptcha: captchaToken, 
            });

            localStorage.setItem('username', res.data.username || username);
            localStorage.setItem('role', role);

            setMsg('Signup successful! Please check your email to verify your account.');
            setSignupSuccess(true);
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
                            disabled={signupSuccess}
                        />
                    </Form.Group>

                    <Form.Group controlId="email" className="mt-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={signupSuccess}
                        />
                    </Form.Group>

                    <Form.Group controlId="password" className="mt-3" style={{ position: 'relative' }}>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            disabled={signupSuccess}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '38px',
                                cursor: 'pointer',
                                userSelect: 'none',
                                color: '#6c757d',
                                fontSize: '1.2rem',
                            }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            role="button"
                        >
                            {showPassword ? '🙈' : '👁️'}
                        </span>
                    </Form.Group>

                    <div className="mt-3 d-flex justify-content-center">
                        <ReCAPTCHA
                            sitekey="6LcBT00rAAAAALAAlmNoLopNZyqtJ9goLbokwMJr" 
                            onChange={token => setCaptchaToken(token)}
                        />
                    </div>

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
                        disabled={loading || signupSuccess}
                    >
                        {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
                    </Button>
                </Form>


                <div className="text-center mt-3">
                    Already have an account?{' '}
                    <Link to="/login" style={{ fontWeight: '600' }}>
                        Login here
                    </Link>
                </div>


                {msg && (
                    <Alert variant={err ? 'danger' : 'success'} className="mt-3" style={{ fontWeight: '600' }}>
                        {msg}
                    </Alert>
                )}


                {signupSuccess && (
                    <div className="text-center mt-4 p-3" style={{
                        color: '#2c3e50',
                        fontWeight: '700',
                        fontSize: '1.1rem',
                        backgroundColor: '#d4edda',
                        border: '2px solid #28a745',
                        borderRadius: '8px',
                        userSelect: 'none',
                        pointerEvents: 'none',
                    }}>
                        🎉 If your account is verified successfully, you can now <strong>login</strong>.
                    </div>
                )}
            </Card>
        </Container>
    );
}
