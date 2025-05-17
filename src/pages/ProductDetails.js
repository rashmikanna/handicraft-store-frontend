import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Row,
    Col,
    Image,
    Button,
    ListGroup,
    Spinner,
    Alert,
    Card,
} from 'react-bootstrap';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // define your site color here:
    const siteBgColor = '#F2EFEA';  // ← replace with your actual hex/RGB

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/products/${id}/`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load product details.');
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <Container className="mt-5 text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading product details...</p>
        </Container>
    );
    if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
    if (!product) return <Alert variant="warning" className="mt-5">Product not found.</Alert>;

    const { specifications = {}, created_at } = product;

    return (
        <Container className="mt-5">
            <Card
                className="shadow-sm text-dark"
                style={{ backgroundColor: siteBgColor }}
            >
                <Row noGutters>
                    {/* Image Section with same bg */}
                    <Col
                        md={5}
                        className="d-flex align-items-center justify-content-center p-4"
                        style={{ backgroundColor: siteBgColor }}
                    >
                        <Image
                            src={
                                product.images?.length
                                    ? product.images[0]
                                    : '/default-placeholder-image.jpg'
                            }
                            alt={product.name}
                            fluid
                            rounded
                        />
                    </Col>

                    {/* Info Section */}
                    <Col md={7} className="p-4 d-flex flex-column">
                        <h2 className="mb-2">{product.name}</h2>
                        <p className="text-muted mb-3">{product.description}</p>

                        <h4 className="text-success mb-3">₹{product.price}</h4>
                        {created_at && (
                            <small className="text-muted mb-4">
                                Added on: {new Date(created_at).toLocaleDateString('en-IN')}
                            </small>
                        )}

                        {/* Specs as ListGroup */}
                        {Object.keys(specifications).length > 0 && (
                            <>
                                <h5 className="mt-3 mb-2">Specifications</h5>
                                <ListGroup variant="flush" className="mb-4">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <ListGroup.Item
                                            key={key}
                                            className="py-2"
                                            style={{ backgroundColor: siteBgColor, border: 'none' }}
                                        >
                                            <strong className="text-capitalize">{key.replace(/_/g, ' ')}:</strong>{' '}
                                            {value}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}

                        <Button variant="success" size="lg" className="mt-auto">
                            Add to Cart
                        </Button>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default ProductDetails;
