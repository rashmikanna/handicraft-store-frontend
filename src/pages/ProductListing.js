import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container, Row, Col, Card, Button,
    Offcanvas, Form, Dropdown
} from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function ProductListing() {
    const location = useLocation();
    const qParam = new URLSearchParams(location.search).get('q') || '';

    // data state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // search (driven from URL)
    const [searchQ, setSearchQ] = useState(qParam);

    // committed filters
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [available, setAvailable] = useState(false);
    const [sort, setSort] = useState('');

    // temporary filter inputs
    const [tempCategory, setTempCategory] = useState('');
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [tempAvail, setTempAvail] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const [categories, setCategories] = useState([]);

    // keep searchQ in sync when URL changes
    useEffect(() => {
        setSearchQ(qParam);
    }, [qParam]);

    // fetch categories
    useEffect(() => {
        axios.get('http://localhost:8000/api/products/categories/')
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, []);

    // fetch products whenever URL or filters change
    useEffect(() => {
        const q = new URLSearchParams(location.search).get('q') || '';
        setSearchQ(q);

        setLoading(true);
        setError(null);

        const params = {};
        if (q) params.q = q;
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (available) params.available = true;
        if (sort) params.sort = sort;

        console.log('Fetching with params:', params);
        axios.get('http://localhost:8000/api/products/products/', { params })
            .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
            .catch(() => setError('Failed to load products'))
            .finally(() => setLoading(false));
    }, [location.search, category, minPrice, maxPrice, available, sort]);

    // open filter panel
    const openPanel = () => {
        setTempCategory(category);
        setTempMin(minPrice);
        setTempMax(maxPrice);
        setTempAvail(available);
        setShowFilters(true);
    };

    // apply filter inputs
    const applyFilters = () => {
        setCategory(tempCategory);
        setMinPrice(tempMin);
        setMaxPrice(tempMax);
        setAvailable(tempAvail);
        setShowFilters(false);
    };

    // restrict numeric inputs
    const handleTempMin = e => {
        const v = e.target.value;
        if (/^\d*$/.test(v)) setTempMin(v);
    };
    const handleTempMax = e => {
        const v = e.target.value;
        if (/^\d*$/.test(v)) setTempMax(v);
    };

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <Container className="mt-4">
            {/* Header */}
            <Row className="align-items-center mb-3">
                <Col><h2>Our Handcrafted Products</h2></Col>
                <Col className="text-end">
                    <div className="d-inline-flex gap-2">
                        <Button variant="warning" size="md" onClick={openPanel}>Filters</Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="warning" size="md">Sort</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSort('price_asc')}>Price: Low to High</Dropdown.Item>
                                <Dropdown.Item onClick={() => setSort('price_desc')}>Price: High to Low</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setSort('newest')}>Newest</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>

            {/* Filters Panel */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select value={tempCategory} onChange={e => setTempCategory(e.target.value)}>
                                <option value="">All</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price Range (₹)</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control type="text" placeholder="Min" value={tempMin} onChange={handleTempMin} />
                                </Col>
                                <Col>
                                    <Form.Control type="text" placeholder="Max" value={tempMax} onChange={handleTempMax} />
                                </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check type="checkbox" label="Only show available" checked={tempAvail} onChange={e => setTempAvail(e.target.checked)} />
                        </Form.Group>

                        <Button variant="warning" onClick={applyFilters}>Apply Filters</Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Products Grid */}
            <Row className="g-4">
                {products.length > 0 ? (
                    products.map(p => (
                        <Col md={4} key={p.id}>
                            <Card
                                style={{ 
                                    height: '100%', 
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
                                    borderRadius: '12px', 
                                    transition: 'transform 0.2s' 
                                }}
                                className="h-100"
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{ overflow: 'hidden', borderTopLeftRadius: '12px', borderTopRightRadius: '12px', height: '220px' }}>
                                    <Card.Img 
                                        variant="top" 
                                        src={p.images?.[0] || '/default-placeholder-image.jpg'} 
                                        style={{ 
                                            height: '220px', 
                                            width: '100%', 
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '12px',
                                            borderTopRightRadius: '12px'
                                        }} 
                                    />
                                </div>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <div>
                                        <Card.Title style={{ fontWeight: '600', fontSize: '1.25rem', minHeight: '3em' }}>{p.name}</Card.Title>
                                        <Card.Text style={{ fontWeight: '700', fontSize: '1.15rem', color: '#E65100' }}>₹{p.price}</Card.Text>
                                    </div>
                                    <Link to={`/products/${p.id}`}>
                                        <Button size="md" variant="primary" className="mt-3 w-100">View Details</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col><p>No products match these filters.</p></Col>
                )}
            </Row>
        </Container>
    );
}
