import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Carousel, Spinner, Alert } from 'react-bootstrap';

export default function CraftsPage() {
    const [crafts, setCrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('/api/crafts/')
            .then(res => setCrafts(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Spinner animation="border" variant="primary" className="mt-5 mx-auto d-block" />;
    if (error) return <Alert variant="danger" className="mt-5">Error: {error}</Alert>;

    return (
        <Container className="py-5">
            <h1 className="mb-4 text-center">Our Heritage Crafts</h1>
            <Row xs={1} md={2} lg={2} className="g-4">
                {crafts.map((craft, idx) => (
                    <Col key={idx}>
                        <Link to={`/crafts/${craft.slug}`} className="text-decoration-none text-dark">
                            <Card className="h-100 shadow-sm">
                                {craft.hero_image && (
                                    <Card.Img
                                        variant="top"
                                        src={craft.hero_image}
                                        alt={craft.name}
                                        className="rounded-top"
                                    />
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title>{craft.name}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{craft.region}</Card.Subtitle>
                                    <div className="flex-grow-1 mt-3 overflow-auto" style={{ maxHeight: '10rem' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {craft.content.split('\n').slice(0, 6).join('\n') + '...'}
                                        </ReactMarkdown>
                                    </div>
                                    {craft.gallery && craft.gallery.length > 0 && (
                                        <Carousel className="mt-3">
                                            {craft.gallery.map((img, i) => (
                                                <Carousel.Item key={i}>
                                                    <img
                                                        className="d-block w-100 rounded"
                                                        src={img}
                                                        alt={`${craft.name} ${i + 1}`}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
