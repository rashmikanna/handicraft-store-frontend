import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Alert, Spinner } from 'react-bootstrap';

export default function SellerStatus() {
    const [approved, setApproved] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let intervalId;

        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('access');
                const res = await axios.get(
                    'http://127.0.0.1:8000/api/seller/status/',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setApproved(res.data.approved);
                if (res.data.approved) {
                    clearInterval(intervalId);
                    navigate('/seller'); // seller homepage
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchStatus();                       // initial check
        intervalId = setInterval(fetchStatus, 10000); // poll every 10s
        return () => clearInterval(intervalId);
    }, [navigate]);

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="p-4" style={{ maxWidth: 400, width: '100%' }}>
                {!approved && (
                    <Alert variant="info" className="text-center">
                        <Spinner animation="border" size="sm" className="me-2" />
                        Your application is pending approval. We’ll redirect once approved.
                    </Alert>
                )}
            </Card>
        </Container>
    );
}
