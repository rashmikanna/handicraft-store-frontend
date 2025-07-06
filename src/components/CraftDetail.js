// src/components/CraftDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'framer-motion';
import { Container, Row, Col, Spinner, Alert, Image } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

export default function CraftDetail() {
    const { slug } = useParams();
    const [craft, setCraft] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const fromProductId = location.state?.fromProduct;

    useEffect(() => {
        axios.get(`/api/crafts/${slug}/`)
            .then(res => setCraft(res.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <Spinner animation="border" variant="primary" className="mt-5 mx-auto d-block" />;
    if (error) return <Alert variant="danger" className="mt-5">Error: {error}</Alert>;
    if (!craft) return <Alert variant="warning" className="mt-5">Craft not found</Alert>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            {/* Gradient header */}
            <div className="py-5 text-center text-white mb-5" style={{ background: 'linear-gradient(135deg, #7c4a12 0%, #b76d28 100%)' }}>
                <h1 className="display-3">{craft.name}</h1>
                <p className="lead"><em>{craft.region}</em></p>
            </div>

            <Container>
                {craft.hero_image && (
                    <>
                        {/* Back link above the hero image */}
                        <Row className="justify-content-center mb-2">
                            <Col md={11} lg={8}>
                                {fromProductId ? (
                                    <Link to={`/products/${fromProductId}`} className="d-inline-block text-decoration-underline text-dark mb-2" style={{ fontSize: '1rem' }}>
                                        <FaArrowLeft className="me-2" />
                                    </Link>
                                ) : (
                                    <span onClick={() => navigate(-1)} className="d-inline-block text-decoration-underline text-dark mb-2" style={{ cursor: 'pointer', fontSize: '1rem' }}>
                                        <FaArrowLeft className="me-2" />Go Back
                                    </span>
                                )}
                            </Col>
                        </Row>
                        <Row className="justify-content-center mb-4">
                            <Col md={11} lg={8} style={{ overflow: 'hidden', height: '400px', borderRadius: '0.75rem' }}>
                                <Image
                                    src={craft.hero_image}
                                    alt={craft.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }}
                                />
                            </Col>
                        </Row>
                    </>
                )}

                {/* Content */}
                <div className="prose mx-auto mb-5" style={{ maxWidth: '800px', fontSize: '1.2rem', lineHeight: '2rem' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{craft.content}</ReactMarkdown>
                </div>

                <div
                    style={{
                        height: '4px',
                        background: 'linear-gradient(to right, #00000033, #000000cc, #00000033)',
                        borderRadius: '2px',
                        margin: '3rem auto',
                        width: '80%',
                        maxWidth: '800px'
                    }}
                ></div>
                {/* Equal-Sized, Evenly-Spaced Gallery */}
                {craft.gallery.length > 0 && (
                    <section className="mb-5">
                        <h4 className="mb-4">Gallery</h4>
                        <Row className="justify-content-center gx-4 gy-4">
                            {craft.gallery.map((img, idx) => (
                                <Col key={idx} xs={12} sm={6} md={4} lg={4}>
                                    <div style={{ overflow: 'hidden', width: '100%', paddingTop: '75%', position: 'relative', borderRadius: '0.5rem' }}>
                                        <img
                                            src={img}
                                            alt={`${craft.name} ${idx + 1}`}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '0.5rem'
                                            }}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </section>
                )}
            </Container>
        </motion.div>
    );
}
