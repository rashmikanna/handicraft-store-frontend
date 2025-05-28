import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function SellerProductList() {
    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('access');
                const res = await axios.get(
                    'http://127.0.0.1:8000/api/seller/products/',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProducts(res.data);
            } catch (err) {
                setError('Could not load your products.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Your Products</h2>
                <Button onClick={() => navigate('/seller/new')}>
                    + Add New Product
                </Button>
            </div>

            {products.length === 0 && (
                <Alert variant="info">You have no products yet.</Alert>
            )}

            <Row>
                {products.map(prod => (
                    <Col key={prod.id} md={4} className="mb-4">
                        <Card>
                            {prod.images?.[0] && (
                                <Card.Img variant="top" src={prod.images[0]} />
                            )}
                            <Card.Body>
                                <Card.Title>{prod.name}</Card.Title>
                                <Card.Text>₹{prod.price.toFixed(2)}</Card.Text>
                                <Button
                                    variant="secondary"
                                    onClick={() => navigate(`/seller/${prod.id}/edit`)}
                                >
                                    Edit
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
