import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
    Container, Row, Col, Card, Button,
    Offcanvas, Form, Dropdown
} from 'react-bootstrap';
import axios from 'axios';

export default function ProductListing() {
    const location = useLocation();
    const qParam = new URLSearchParams(location.search).get('q') || '';

    // data, loading state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filters
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [available, setAvailable] = useState(false);
    const [sort, setSort] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // temp inputs in offcanvas
    const [tempCategory, setTempCategory] = useState('');
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [tempAvail, setTempAvail] = useState(false);
    const [tempTags, setTempTags] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // lookup lists
    const [categories, setCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    // sync searchQ
    const [searchQ, setSearchQ] = useState(qParam);
    useEffect(() => {
        setSearchQ(qParam);
    }, [qParam]);

    // fetch categories & tags
    useEffect(() => {
        axios.get('http://localhost:8000/api/products/categories/')
            .then(res => setCategories(res.data))
            .catch(console.error);
        axios.get('http://localhost:8000/api/products/products/tags/')
            .then(res => setAvailableTags(res.data.filter(t => t && t.trim() !== '')))
            .catch(console.error);
    }, []);

    // fetch products on filter change
    useEffect(() => {
        const q = new URLSearchParams(location.search).get('q') || '';
        setLoading(true);
        setError(null);

        const params = {};
        if (q) params.q = q;
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        if (available) params.available = true;
        if (sort) params.sort = sort;
        if (selectedTags.length) params.tags = selectedTags.join(',');

        axios.get('http://localhost:8000/api/products/products/', { params })
            .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
            .catch(() => setError('Failed to load products'))
            .finally(() => setLoading(false));
    }, [location.search, category, minPrice, maxPrice, available, sort, selectedTags]);

    // open Offcanvas and seed temp inputs
    const openPanel = () => {
        setTempCategory(category);
        setTempMin(minPrice);
        setTempMax(maxPrice);
        setTempAvail(available);
        setTempTags(selectedTags);
        setShowFilters(true);
    };

    // apply and close
    const applyFilters = () => {
        setCategory(tempCategory);
        setMinPrice(tempMin);
        setMaxPrice(tempMax);
        setAvailable(tempAvail);
        setSelectedTags(tempTags);
        setShowFilters(false);
    };

    // clear all filters
    const clearFilters = () => {
        setTempCategory('');
        setTempMin('');
        setTempMax('');
        setTempAvail(false);
        setTempTags([]);
    };

    // restrict numeric input
    const handleTempMin = e => {
        if (/^\d*$/.test(e.target.value)) setTempMin(e.target.value);
    };
    const handleTempMax = e => {
        if (/^\d*$/.test(e.target.value)) setTempMax(e.target.value);
    };

    // toggle a single tag in tempTags
    const handleTagToggle = tag => {
        setTempTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <Container className="mt-4">
            {/* Header: Filters + Sort side by side */}
            <Row className="align-items-center mb-3">
                <Col>
                    <h2 style={{
                        fontFamily: 'Georgia, serif',
                        fontWeight: 700,
                        fontSize: '2rem',
                        color: '#333'
                    }}>
                        Our Handcrafted Products
                    </h2>
                </Col>
                <Col className="text-end">
                    <div className="d-inline-flex gap-2">
                        <Button variant="warning" onClick={openPanel}>Filters</Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="warning">Sort</Dropdown.Toggle>
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

            {/* Offcanvas Panel */}
            <Offcanvas show={showFilters} onHide={() => setShowFilters(false)} placement="start">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        {/* Category */}
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={tempCategory}
                                onChange={e => setTempCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categories.map(cat => (
                                    <option key={cat.id || cat} value={cat.id || cat}>
                                        {cat.name || cat}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Price Range */}
                        <Form.Group className="mb-3">
                            <Form.Label>Price Range</Form.Label>
                            <div className="d-flex gap-2">
                                <Form.Control
                                    placeholder="Min"
                                    value={tempMin}
                                    onChange={handleTempMin}
                                />
                                <Form.Control
                                    placeholder="Max"
                                    value={tempMax}
                                    onChange={handleTempMax}
                                />
                            </div>
                        </Form.Group>

                        {/* Availability */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="In Stock"
                                checked={tempAvail}
                                onChange={e => setTempAvail(e.target.checked)}
                            />
                        </Form.Group>

                        {/* Tags */}
                        <Form.Group className="mb-3">
                            <Form.Label>Tags</Form.Label>
                            {availableTags.map(tag => (
                                <Form.Check
                                    key={tag}
                                    type="checkbox"
                                    label={tag}
                                    checked={tempTags.includes(tag)}
                                    onChange={() => handleTagToggle(tag)}
                                />
                            ))}
                        </Form.Group>

                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={clearFilters}>
                                Clear
                            </Button>
                            <Button variant="primary" onClick={applyFilters}>
                                Apply
                            </Button>
                        </div>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Products Grid */}
            <Row className="g-4">
                {products.length > 0 ? (
                    products.map(p => (
                        <Col md={4} key={p.id}>
                            <Card className="h-100" style={{
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                borderRadius: '12px',
                                transition: 'transform 0.2s'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1 / 1',
                                    overflow: 'hidden',
                                    borderTopLeftRadius: '12px',
                                    borderTopRightRadius: '12px'
                                }}>
                                    <Card.Img
                                        variant="top"
                                        src={p.images?.[0] || '/default-placeholder-image.jpg'}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>

                                <Card.Body className="d-flex flex-column">
                                    <Card.Title style={{
                                        fontWeight: 600,
                                        fontSize: '1.25rem',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {p.name}
                                    </Card.Title>
                                    <Card.Text style={{
                                        fontWeight: 700,
                                        fontSize: '1.15rem',
                                        color: '#E65100',
                                        marginBottom: '0.5rem'
                                    }}>
                                        ₹{p.price}
                                    </Card.Text>
                                    <Link to={`/products/${p.id}`}>
                                        <Button size="md" variant="primary" className="mt-auto w-100">
                                            View Details
                                        </Button>
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
