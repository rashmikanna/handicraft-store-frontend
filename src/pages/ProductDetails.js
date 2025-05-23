import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Row,
    Col,
    Spinner,
    Alert,
    Card,
    Carousel,
    Button,
    ListGroup,
    Image
} from 'react-bootstrap';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const siteBgColor = '#F2EFEA';

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/products/products/${id}/`)
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

    const handleSelect = (selectedIndex) => {
        setCarouselIndex(selectedIndex);
    };

    if (loading) return (
        <Container className="mt-5 text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading product details...</p>
        </Container>
    );
    if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;
    if (!product) return <Alert variant="warning" className="mt-5">Product not found.</Alert>;

    const { images = [], specifications = {}, created_at } = product;
    const displayImages = Array.isArray(images) && images.length > 0
        ? images
        : ['/default-placeholder-image.jpg'];

    return (
        <Container className="mt-5">
            <Card className="shadow-sm text-dark" style={{ backgroundColor: siteBgColor }}>
                <Row className="g-0">
                    {/* Main Carousel Section */}
                    <Col md={7} style={{ backgroundColor: siteBgColor }} className="p-4">
                        <Carousel
                            activeIndex={carouselIndex}
                            onSelect={handleSelect}
                            indicators={false}
                            controls={true}
                            interval={null}
                        >
                            {displayImages.map((url, idx) => (
                                <Carousel.Item key={idx} style={{ backgroundColor: siteBgColor }}>
                                    <Image
                                        src={url}
                                        alt={`Slide ${idx + 1}`}
                                        fluid
                                        style={{ objectFit: 'contain', height: '500px', width: '100%' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        {/* Thumbnail Previews */}
                        <Row className="mt-3 gx-2">
                            {displayImages.map((url, idx) => (
                                <Col key={idx} xs={2} onClick={() => handleSelect(idx)}>
                                    <Image
                                        src={url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        thumbnail
                                        style={{ cursor: 'pointer', border: carouselIndex === idx ? '2px solid #ffc107' : '1px solid #ddd' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Info Section */}
                    <Col md={5} className="p-4 d-flex flex-column">
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
                                            <strong className="text-capitalize">{key.replace(/_/g, ' ')}:</strong> {value}
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
