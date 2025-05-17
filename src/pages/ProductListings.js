import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

ffunction ProductListing() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/products/')
            .then(res => {
                console.log('API Response:', res.data); // Debug API response
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('API fetch error:', err);
                setError('Failed to load products.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container className="mt-5">
            <h2 className="mb-4">Our Handcrafted Products</h2>
            <Row>
                {products.map(product => (
                    <Col md={4} key={product._id} className="mb-4">
                        <Card>
                            <Card.Img
                                variant="top"
                                src={product.image_url || '/default-placeholder-image.jpg'}
                                alt={product.name}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>₹{product.price}</Card.Text>
                                <Button variant="primary">View Details</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default ProductListing;
 