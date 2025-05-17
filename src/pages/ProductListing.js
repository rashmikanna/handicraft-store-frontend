import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ProductListing() {
    const [products, setProducts] = useState([]); // Initialize with an empty array
    const [loading, setLoading] = useState(true); // Handle loading state
    const [error, setError] = useState(null); // Handle errors

    useEffect(() => {
        axios.get('http://localhost:8000/products/products/') // Fetch products from backend
            .then(res => {
                console.log('Full API Response:', res.data); // Debug the full API response
                if (Array.isArray(res.data)) {
                    // Response is directly an array
                    setProducts(res.data);
                } else if (res.data.data && Array.isArray(res.data.data)) {
                    // Response contains a nested array
                    setProducts(res.data.data);
                } else {
                    console.error('Unexpected API response format.');
                    setProducts([]); // Fallback to empty array
                }
                setLoading(false); // Stop loading indicator
            })
            .catch(err => {
                console.error('API fetch error:', err); // Log fetch errors
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            });
    }, []);

    // Show loading indicator while fetching
    if (loading) return <p>Loading products...</p>;

    // Show error message if fetch fails
    if (error) return <p>{error}</p>;

    // Render MongoDB products
    return (
        <Container className="mt-5">
            <h2 className="mb-4">Our Handcrafted Products</h2>
            <Row>
                {Array.isArray(products) && products.length > 0 ? (
                    products.map(product => {
                        const imageUrl = product.images && product.images.length > 0
                            ? product.images[0] // Use the first image if available
                            : '/default-placeholder-image.jpg'; // Use fallback image

                        console.log('Image URL:', imageUrl); // Debugging image URL
                        return (
                            <Col md={4} key={product.id} className="mb-4">
                                <Card>
                                    <Card.Img
                                        variant="top"
                                        src={imageUrl}
                                        alt={product.name}
                                    />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>₹{product.price}</Card.Text>
                                        <Link to={`/products/${product.id}`}>
                                            <Button variant="primary">View Details</Button>
                                        </Link>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })
                ) : (
                    <p>No products available</p>
                )}
            </Row>
        </Container>
    );
}

export default ProductListing;