import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';

const API_BASE = 'http://127.0.0.1:8000/api';

// Preset specification fields per craft tag
const presetSpecs = {
    'Karimnagar Silver Filigrees': ['material', 'technique', 'design', 'dimensions', 'weight', 'care', 'origin'],
    'Dokra Metal Crafts': ['material', 'technique', 'design', 'dimensions', 'weight', 'finish', 'care', 'origin'],
    // Add more mappings as needed...
};

export default function SellerProductForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [crafts, setCrafts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        craft: '',
        available: true,
        images: [],
        specifications: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE}/products/categories/`)
            .then(res => res.json())
            .then(setCategories)
            .catch(() => setError('Failed to load categories'));

        fetch(`${API_BASE}/products/products/tags/`)
            .then(res => res.json())
            .then(setCrafts)
            .catch(() => setError('Failed to load craft tags'));

        if (isEdit) {
            setLoading(true);
            fetch(`${API_BASE}/products/products/${id}/`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access')}` }
            })
                .then(res => res.json())
                .then(data => {
                    const specsArray = Object.entries(data.specifications).map(([key, value]) => ({ key, value }));
                    setForm({
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        stock: data.stock,
                        category: data.category,
                        craft: data.tags[0] || '',
                        available: data.available,
                        images: data.images,
                        specifications: specsArray,
                    });
                })
                .catch(() => setError('Failed to load product'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    useEffect(() => {
        if (!isEdit && form.craft && presetSpecs[form.craft]) {
            setForm(f => ({
                ...f,
                specifications: presetSpecs[form.craft].map(key => ({ key, value: '' }))
            }));
        }
    }, [form.craft, isEdit]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleImageUpload = e => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('image', file);
        fetch(`${API_BASE}/products/upload-image/`, { method: 'POST', body: fd })
            .then(res => res.json())
            .then(data => setForm(prev => ({ ...prev, images: [...prev.images, data.image_url] })))
            .catch(() => setError('Image upload failed'));
    };

    const handleSpecChange = (idx, field, value) => {
        const newSpecs = [...form.specifications];
        newSpecs[idx][field] = value;
        setForm(prev => ({ ...prev, specifications: newSpecs }));
    };

    const addSpecRow = () => {
        setForm(f => ({ ...f, specifications: [...f.specifications, { key: '', value: '' }] }));
    };

    const removeSpecRow = idx => {
        setForm(f => ({ ...f, specifications: f.specifications.filter((_, i) => i !== idx) }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const specsObj = form.specifications.reduce((obj, { key, value }) => {
            if (key && value) obj[key] = value;
            return obj;
        }, {});

        const payload = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            category: form.category,
            tags: [form.craft],
            images: form.images,
            available: form.available,
            specifications: specsObj,
        };

        const endpoint = isEdit
            ? `${API_BASE}/products/products/${id}/`
            : `${API_BASE}/products/products/`;

        fetch(endpoint, {
            method: isEdit ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            },
            body: JSON.stringify(payload)
        })
            .then(res => { if (!res.ok) throw new Error(`Server responded ${res.status}`); return res.json(); })
            .then(() => navigate('/seller'))
            .catch(err => setError(`Save failed: ${err.message}`))
            .finally(() => setLoading(false));
    };

    return (
        <Container className="mt-5">
            <Card className="mx-auto p-4" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">{isEdit ? 'Edit Product' : 'Add Product'}</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="name">
                        <Form.Label column sm={3}>Name</Form.Label>
                        <Col sm={9}>
                            <Form.Control name="name" value={form.name} onChange={handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="description">
                        <Form.Label column sm={3}>Description</Form.Label>
                        <Col sm={9}>
                            <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} rows={3} />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="price">
                        <Form.Label column sm={3}>Price</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="stock">
                        <Form.Label column sm={3}>Stock</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="number" name="stock" value={form.stock} onChange={handleChange} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="category">
                        <Form.Label column sm={3}>Category</Form.Label>
                        <Col sm={9}>
                            <Form.Select name="category" value={form.category} onChange={handleChange} required>
                                <option value="">Select…</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="craft">
                        <Form.Label column sm={3}>Craft Type</Form.Label>
                        <Col sm={9}>
                            <Form.Select name="craft" value={form.craft} onChange={handleChange} required>
                                <option value="">Select Craft…</option>
                                {crafts.map(c => <option key={c} value={c}>{c}</option>)}
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm={3}>Specifications</Form.Label>
                        <Col sm={9}>
                            {form.specifications.map((spec, idx) => (
                                <Row key={idx} className="mb-2">
                                    <Col sm={5}>
                                        <Form.Control
                                            placeholder="Field name"
                                            value={spec.key}
                                            onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                                            required
                                        />
                                    </Col>
                                    <Col sm={5}>
                                        <Form.Control
                                            placeholder="Value"
                                            value={spec.value}
                                            onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                                            required
                                        />
                                    </Col>
                                    <Col sm={2}>
                                        <Button variant="danger" size="sm" onClick={() => removeSpecRow(idx)}>✕</Button>
                                    </Col>
                                </Row>
                            ))}

                            <Button variant="secondary" size="sm" onClick={addSpecRow}>
                                + Add specification
                            </Button>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="images">
                        <Form.Label column sm={3}>Images</Form.Label>
                        <Col sm={9}>
                            <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                            <div className="mt-2 d-flex flex-wrap gap-2">
                                {form.images.map((url, idx) => (
                                    <img key={idx} src={url} alt="Product" style={{ height: '80px', width: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                ))}
                            </div>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4" controlId="available">
                        <Col sm={{ span: 9, offset: 3 }}>
                            <Form.Check name="available" type="checkbox" label="Available" checked={form.available} onChange={handleChange} />
                        </Col>
                    </Form.Group>

                    <div className="text-center">
                        <Button type="submit" disabled={loading} className="px-5">
                            {loading ? <Spinner animation="border" size="sm" /> : isEdit ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}
