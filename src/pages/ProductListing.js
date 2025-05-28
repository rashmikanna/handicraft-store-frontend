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

    // search driven by URL
    const [searchQ, setSearchQ] = useState(qParam);

    // committed filters
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [available, setAvailable] = useState(false);
    const [sort, setSort] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);

    // temporary Offcanvas inputs
    const [tempCategory, setTempCategory] = useState('');
    const [tempMin, setTempMin] = useState('');
    const [tempMax, setTempMax] = useState('');
    const [tempAvail, setTempAvail] = useState(false);
    const [tempTags, setTempTags] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // lists to populate selects & checkboxes
    const [categories, setCategories] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);

    // sync searchQ
    useEffect(() => {
        setSearchQ(qParam);
    }, [qParam]);

    // fetch categories
    useEffect(() => {
        axios.get('http://localhost:8000/api/products/categories/')
            .then(res => setCategories(res.data))
            .catch(console.error);
    }, []);

    // fetch tags, drop any empty string
    useEffect(() => {
        axios.get('http://localhost:8000/api/products/products/tags/')
            .then(res => {
                const tags = res.data.filter(t => t && t.trim() !== '');
                setAvailableTags(tags);
            })
            .catch(console.error);
    }, []);

    // fetch products whenever filters change
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
        if (selectedTags.length)
            params.tags = selectedTags.join(',');

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
                <Col><h2>Our Handcrafted Products</h2></Col>
                <Col className="text-end">
                    <div className="d-inline-flex gap-2">
                        <Button variant="warning" onClick={openPanel}>
                            Filters
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle variant="warning">
                                Sort
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => setSort('price_asc')}>
                                    Price: Low to High
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => setSort('price_desc')}>
                                    Price: High to Low
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={() => setSort('newest')}>
                                    Newest
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>

            {/* Offcanvas Panel */}
            <Offcanvas show={showFilters}
                onHide={() => setShowFilters(false)}
                placement="start">
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
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Price Range */}
                        <Form.Group className="mb-3">
                            <Form.Label>Price Range (₹)</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Min"
                                        value={tempMin}
                                        onChange={handleTempMin}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        placeholder="Max"
                                        value={tempMax}
                                        onChange={handleTempMax}
                                    />
                                </Col>
                            </Row>
                        </Form.Group>

                        {/* Availability */}
                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Only show available"
                                checked={tempAvail}
                                onChange={e => setTempAvail(e.target.checked)}
                            />
                        </Form.Group>

                        {/* Tags */}
                        <Form.Group className="mb-3">
                            <Form.Label>Select your crafts</Form.Label>
                            {availableTags.map(tag => (
                                <Form.Check
                                    key={tag}
                                    type="checkbox"
                                    label={tag}
                                    checked={tempTags.includes(tag)}
                                    onChange={() => handleTagToggle(tag)}
                                    className="mb-1"
                                />
                            ))}
                        </Form.Group>

                        {/* Apply */}
                        <Button variant="warning" onClick={applyFilters}>
                            Apply Filters
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Products Grid */}
            <Row>
                {products.length > 0
                    ? products.map(p => (
                        <Col md={4} key={p.id} className="mb-4">
                            <Card>
                                <Card.Img
                                    variant="top"
                                    src={p.images?.[0] || '/default-placeholder-image.jpg'}
                                />
                                <Card.Body>
                                    <Card.Title>{p.name}</Card.Title>
                                    <Card.Text>₹{p.price}</Card.Text>
                                    <Link to={`/products/${p.id}`}>
                                        <Button variant="primary">View Details</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                    : <Col><p>No products match these filters.</p></Col>
                }
            </Row>
        </Container>
    );
}
