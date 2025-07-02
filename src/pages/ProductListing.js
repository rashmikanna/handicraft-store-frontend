// src/pages/ProductListing.js

import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    Container, Row, Col, Card, Button,
    Offcanvas, Form, Dropdown, Spinner
} from 'react-bootstrap';
import axios from 'axios';

export default function ProductListing() {
    const location = useLocation();
    const navigate = useNavigate();

    // 1) Read URL query parameters (including category)
    const query = new URLSearchParams(location.search);
    const qParam = query.get('q') || '';
    const categoryParam = query.get('category') || ''; // e.g. "handlooms" or "gift" or any category name
    const maxPriceParam = query.get('max_price') || '';
    const minPriceParam = query.get('min_price') || '';
    const sortParamUrl = query.get('sort') || '';
    const tagsParam = query.get('tags') || '';

    // 2) Component State
    const [allProducts, setAllProducts] = useState([]); // raw from API
    const [displayProducts, setDisplayProducts] = useState([]); // after front-end sort only
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Permanent filters from Offcanvas (including category)
    const [category, setCategory] = useState(categoryParam);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [available, setAvailable] = useState(false);
    const [sort, setSort] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // Temporary Offcanvas inputs (so user can cancel)
    const [tempCategory, setTempCategory] = useState('');
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [tempAvail, setTempAvail] = useState(false);
    const [tempTags, setTempTags] = useState([]);

    const [showFilters, setShowFilters] = useState(false);

    // For populating the Category dropdown
    const [categories, setCategories] = useState([]); // e.g. [ { id: "...", name: "Gadwal Handlooms" }, ... ]
    // For Tags checkboxes
    const [availableTags, setAvailableTags] = useState([]);

    // 3) Fetch categories & tags once (for Offcanvas UI)
    useEffect(() => {
        // Fetch all categories for the dropdown
        axios.get('http://localhost:8000/api/products/categories/')
            .then(res => {
                setCategories(res.data);
            })
            .catch(err => console.error('Failed to fetch categories:', err));

        // Fetch all tags for the tags checkboxes
        axios.get('http://localhost:8000/api/products/products/tags/')
            .then(res => {
                const filtered = res.data.filter(t => t && t.trim() !== '');
                setAvailableTags(filtered);
            })
            .catch(err => console.error('Failed to fetch tags:', err));
    }, []);

    // 4) Fetch “base” products from backend when any filter changes
    useEffect(() => {
        setLoading(true);
        setError(null);

        const params = {};

        // Text search
        if (qParam) params.q = qParam;

        // Category (backend will handle "handlooms", "gift", or any category name)
        if (category) params.category = category;

        // Price filters
        if (minPriceParam) {
            params.min_price = minPriceParam;
        } else if (minPrice) {
            params.min_price = minPrice;
        }
        if (maxPriceParam) {
            params.max_price = maxPriceParam;
        } else if (maxPrice) {
            params.max_price = maxPrice;
        }

        // Availability
        if (available) {
            params.available = true;
        }

        // Tags (comma-separated)
        if (tagsParam) {
            params.tags = tagsParam;
        } else if (selectedTags.length) {
            params.tags = selectedTags.join(',');
        }

        // Sort
        const sortVal = sortParamUrl || sort;
        if (sortVal) {
            params.sort = sortVal;
        }

        axios.get('http://localhost:8000/api/products/products/', { params })
            .then(res => {
                setAllProducts(Array.isArray(res.data) ? res.data : []);
            })
            .catch(() => setError('Failed to load products'))
            .finally(() => setLoading(false));
    }, [
        location.search, // re-run whenever URL (category/min_price/etc) changes
        category,
        minPrice,
        maxPrice,
        available,
        selectedTags,
        qParam,
        sort
    ]);

    // 5) Front-end sorting only (backend already applied filters, including category)
    useEffect(() => {
        let arr = [...allProducts];

        const sortVal = sortParamUrl || sort;
        if (sortVal === 'new' || sortVal === 'newest') {
            arr.sort((a, b) => {
                const da = new Date(a.created_at || a.createdAt || a.date_created || 0);
                const db = new Date(b.created_at || b.createdAt || b.date_created || 0);
                return db - da;
            });
        } else if (sortVal === 'price_asc') {
            arr.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortVal === 'price_desc') {
            arr.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        setDisplayProducts(arr);
    }, [allProducts, sortParamUrl, sort]);

    // 6) Offcanvas Handlers
    const openPanel = () => {
        // Seed temporary inputs from current permanent state
        setTempCategory(category);
        setTempMin(minPrice);
        setTempMax(maxPrice);
        setTempAvail(available);
        setTempTags(selectedTags);
        setShowFilters(true);
    };

    const applyFilters = () => {
        const newQuery = new URLSearchParams();

        // Preserve text search if present
        if (qParam) newQuery.set('q', qParam);

        // Apply category
        if (tempCategory) newQuery.set('category', tempCategory);

        // Apply price
        if (tempMin) newQuery.set('min_price', tempMin);
        if (tempMax) newQuery.set('max_price', tempMax);

        // Apply tags
        if (tempTags.length) newQuery.set('tags', tempTags.join(','));

        // Apply sort (if any)
        if (sort) newQuery.set('sort', sort);

        // Update URL
        navigate({
            pathname: '/products',
            search: newQuery.toString(),
        });

        // Commit permanent state
        setCategory(tempCategory);
        setMinPrice(tempMin);
        setMaxPrice(tempMax);
        setAvailable(tempAvail);
        setSelectedTags(tempTags);

        setShowFilters(false);
    };

    const clearFilters = () => {
        setTempCategory('');   // clear category dropdown
        setTempMin('');
        setTempMax('');
        setTempAvail(false);
        setTempTags([]);
    };

    // Numeric‐only input enforcement
    const handleTempMin = e => {
        if (/^\d*$/.test(e.target.value)) setTempMin(e.target.value);
    };
    const handleTempMax = e => {
        if (/^\d*$/.test(e.target.value)) setTempMax(e.target.value);
    };

    // Toggle a tag in Offcanvas
    const handleTagToggle = tag => {
        setTempTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    // 7) Render
    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading…</span>
                </Spinner>
            </Container>
        );
    }
    if (error) {
        return (
            <Container className="text-center my-5">
                <p className="text-danger">{error}</p>
                <Button onClick={() => navigate(0)}>Retry</Button>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {/* Header: Title + Filters & Sort */}
            <Row className="align-items-center mb-3">
                <Col>
                    <h2
                        style={{
                            fontFamily: 'Georgia, serif',
                            fontWeight: 700,
                            fontSize: '2rem',
                            color: '#333'
                        }}
                    >
                        Our Handcrafted Products
                    </h2>
                </Col>
                <Col className="text-end">
                    <div className="d-inline-flex gap-2">
                        <Button variant="warning" onClick={openPanel}>
                            Filters
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="warning">Sort</Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSort('price_asc')}>
                                    Price: Low to High
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSort('price_desc')}>
                                    Price: High to Low
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setSort('new')}>
                                    Newest
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>

            {/* Offcanvas Filters */}
            <Offcanvas
                show={showFilters}
                onHide={() => setShowFilters(false)}
                placement="start"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Filters</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form>
                        {/* Category Dropdown */}
                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={tempCategory}
                                onChange={e => setTempCategory(e.target.value)}
                            >
                                <option value="">All</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
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

            {/* Product Grid */}
            <Row className="g-4">
                {displayProducts.length > 0 ? (
                    displayProducts.map(p => (
                        <Col md={4} key={p.id || p._id}>
                            <Card
                                className="h-100"
                                style={{
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    borderRadius: '12px',
                                    transition: 'transform 0.2s'
                                }}
                                onMouseEnter={e =>
                                    (e.currentTarget.style.transform = 'scale(1.03)')
                                }
                                onMouseLeave={e =>
                                    (e.currentTarget.style.transform = 'scale(1)')
                                }
                            >
                                <div
                                    style={{
                                        width: '100%',
                                        aspectRatio: '1 / 1',
                                        overflow: 'hidden',
                                        borderTopLeftRadius: '12px',
                                        borderTopRightRadius: '12px'
                                    }}
                                >
                                    <Card.Img
                                        variant="top"
                                        src={p.images?.[0] || '/default-placeholder-image.jpg'}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>

                                <Card.Body className="d-flex flex-column">
                                    <Card.Title
                                        style={{
                                            fontWeight: 600,
                                            fontSize: '1.25rem',
                                            marginBottom: '0.25rem'
                                        }}
                                    >
                                        {p.name}
                                    </Card.Title>
                                    <Card.Text
                                        style={{
                                            fontWeight: 700,
                                            fontSize: '1.15rem',
                                            color: '#E65100',
                                            marginBottom: '0.5rem'
                                        }}
                                    >
                                        ₹{p.price}
                                    </Card.Text>
                                    <Link to={`/products/${p.id || p._id}`}>
                                        <Button
                                            size="md"
                                            variant="primary"
                                            className="mt-auto w-100"
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>No products match these filters.</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
}
