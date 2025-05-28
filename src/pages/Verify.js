import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner } from 'react-bootstrap';
import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import Confetti from 'react-confetti';
import './Verify.css';

export default function Verify() {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState({
        loading: true,
        success: false,
        message: 'Verifying your account...',
        fadeOut: false
    });

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/activate/${uidb64}/${token}/`)
            .then(() => {
                setStatus(prev => ({
                    ...prev,
                    loading: false,
                    success: true,
                    message: '🎉 Account activated successfully! Redirecting to login...'
                }));

                // 1.5s wait, then fade out over 0.5s
                setTimeout(() => {
                    setStatus(prev => ({ ...prev, fadeOut: true }));
                    setTimeout(() => navigate('/login'), 3500);
                }, 1500);
            })
            .catch(() => {
                setStatus({
                    loading: false,
                    success: false,
                    message: '❌ Activation link is invalid or has expired.',
                    fadeOut: false
                });
            });
    }, [uidb64, token, navigate]);

    return (
        <Container className="verify-container">
            {status.success && <Confetti />}
            <div className={`verify-card animate__animated 
                ${status.loading ? 'animate__pulse' : 'animate__fadeInUp'} 
                ${status.fadeOut ? 'fade-out' : ''}`}>
                {status.loading ? (
                    <>
                        <Spinner animation="border" variant="primary" className="verify-spinner" />
                        <h4 className="verify-message">Verifying your account...</h4>
                    </>
                ) : (
                    <>
                        {status.success ? (
                            <CheckCircleFill className="verify-icon success animate__animated animate__bounceIn" />
                        ) : (
                            <XCircleFill className="verify-icon error animate__animated animate__shakeX" />
                        )}
                        <h4 className="verify-message">{status.message}</h4>
                    </>
                )}
            </div>
        </Container>
    );
}
