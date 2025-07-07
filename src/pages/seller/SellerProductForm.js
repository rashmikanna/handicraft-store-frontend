import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Card,
    Form,
    Button,
    Row,
    Col,
    Spinner,
    Alert
} from 'react-bootstrap';
import axios from 'axios';

import VoiceInput from '../../components/VoiceInput';

const API_BASE = 'http://127.0.0.1:8000/api';

const presetSpecs = {
    'Karimnagar Silver Filigrees': [
        'material',
        'technique',
        'design',
        'dimensions',
        'weight',
        'care',
        'origin',
    ],
    'Dokra Metal Crafts': [
        'material',
        'technique',
        'design',
        'dimensions',
        'weight',
        'finish',
        'care',
        'origin',
    ],
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
        frames: [],          // for 360° frames
        specifications: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // load dropdowns & existing product
    useEffect(() => {
        axios.get(`${API_BASE}/products/categories/`)
            .then(r => setCategories(r.data))
            .catch(() => { /* ignore */ });

        axios.get(`${API_BASE}/products/products/tags/`)
            .then(r => setCrafts(r.data))
            .catch(() => { /* ignore */ });

        if (isEdit) {
            setLoading(true);
            axios.get(`${API_BASE}/products/products/${id}/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
            })
                .then(r => {
                    const d = r.data;
                    setForm({
                        name: d.name || '',
                        description: d.description || '',
                        price: d.price?.toString() || '',
                        stock: d.stock?.toString() || '',
                        category: d.category || '',
                        craft: d.tags?.[0] || '',
                        available: d.available,
                        images: d.images || [],
                        frames: [],  // we only send new frames
                        specifications: Object.entries(d.specifications || {}).map(
                            ([k, v]) => ({ key: k, value: v })
                        )
                    });
                })
                .catch(() => setError('Failed to load product'))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    // auto‑fill specs for new products
    useEffect(() => {
        if (!isEdit && form.craft && presetSpecs[form.craft]) {
            setForm(f => ({
                ...f,
                specifications: presetSpecs[f.craft].map(key => ({ key, value: '' }))
            }));
        }
    }, [form.craft, isEdit]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // single image upload
    const handleImageUpload = e => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('image', file);
        axios.post(`${API_BASE}/products/upload-image/`, fd)
            .then(r => setForm(p => ({
                ...p,
                images: [...p.images, r.data.image_url]
            })))
            .catch(() => setError('Image upload failed'));
    };

    // 360° frames selection only (not yet uploaded)
    const handleFramesChange = e => {
        const files = Array.from(e.target.files);
        setForm(prev => ({ ...prev, frames: files }));
    };

    // specs add/remove
    const handleSpecChange = (i, field, v) => {
        const specs = [...form.specifications];
        specs[i][field] = v;
        setForm(p => ({ ...p, specifications: specs }));
    };
    const addSpec = () =>
        setForm(p => ({
            ...p,
            specifications: [...p.specifications, { key: '', value: '' }]
        }));
    const removeSpec = i =>
        setForm(p => ({
            ...p,
            specifications: p.specifications.filter((_, j) => j !== i)
        }));

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // build specs object
        const specsObj = {};
        form.specifications.forEach(s => {
            if (s.key && s.value) specsObj[s.key] = s.value;
        });

        // core payload
        const payload = {
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
            category: form.category,
            tags: [form.craft],
            available: form.available,
            images: form.images,
            specifications: specsObj,
        };

        try {
            // create or update
            const url = isEdit
                ? `${API_BASE}/products/products/${id}/`
                : `${API_BASE}/products/products/`;
            const method = isEdit ? 'put' : 'post';
            const res = await axios({
                method,
                url,
                data: payload,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access')}`
                }
            });

            const prodId = isEdit ? id : res.data.id;
            // upload frames if any
            if (form.frames.length > 0) {
                const fd = new FormData();
                form.frames.forEach(f => fd.append('frames', f));
                await axios.post(
                    `${API_BASE}/products/products/${prodId}/upload-spin-frames/`,
                    fd,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } }
                );
            }

            navigate('/seller');
        } catch (err) {
            const msg = err.response?.data || err.message;
            setError('Save failed: ' + JSON.stringify(msg));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="mx-auto p-4" style={{ maxWidth: 600 }}>
                <h2 className="mb-4 text-center">{isEdit ? 'Edit' : 'Add'} Product</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    {/* name */}
                    <Form.Group controlId="name" className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <VoiceInput setValue={text => setForm(p => ({ ...p, name: text.trim() }))} />
                        </div>
                    </Form.Group>

                    {/* description */}
                    <Form.Group controlId="description" className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <div className="d-flex align-items-center">
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                            />
                            <VoiceInput setValue={text => setForm(p => ({ ...p, description: text.trim() }))} />
                        </div>
                    </Form.Group>

                    {/* price & stock */}
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                name="price"
                                type="number"
                                step="0.01"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group as={Col} controlId="stock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                name="stock"
                                type="number"
                                value={form.stock}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Row>

                    {/* category */}
                    <Form.Group controlId="category" className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select…</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* craft tag */}
                    <Form.Group controlId="craft" className="mb-3">
                        <Form.Label>Craft Type</Form.Label>
                        <Form.Select
                            name="craft"
                            value={form.craft}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select…</option>
                            {crafts.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* specifications */}
                    <Form.Group controlId="specs" className="mb-3">
                        <Form.Label>Specifications</Form.Label>
                        {form.specifications.map((s, i) => (
                            <Row key={i} className="mb-2">
                                <Col>
                                    <Form.Control
                                        placeholder="Key"
                                        value={s.key}
                                        onChange={e => handleSpecChange(i, 'key', e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col>
                                    <Form.Control
                                        placeholder="Value"
                                        value={s.value}
                                        onChange={e => handleSpecChange(i, 'value', e.target.value)}
                                        required
                                    />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => removeSpec(i)}
                                    >✕</Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="secondary" size="sm" onClick={addSpec}>
                            + Add Spec
                        </Button>
                    </Form.Group>

                    {/* images */}
                    <Form.Group controlId="images" className="mb-3">
                        <Form.Label>Images</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                        <div className="mt-2 d-flex flex-wrap gap-2">
                            {form.images.map((url, i) => (
                                <img
                                    key={i}
                                    src={url}
                                    alt="Product"
                                    style={{
                                        height: 80,
                                        width: 80,
                                        objectFit: 'cover',
                                        borderRadius: 4
                                    }}
                                />
                            ))}
                        </div>
                    </Form.Group>

                    {/* 360° view frames */}
                    <Form.Group controlId="frames" className="mb-3">
                        <Form.Label>360° View Frames</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFramesChange}
                        />
                    </Form.Group>

                    {/* available */}
                    <Form.Group controlId="available" className="mb-3">
                        <Form.Check
                            name="available"
                            label="Available"
                            checked={form.available}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="px-5"
                        >
                            {loading
                                ? <Spinner animation="border" size="sm" />
                                : isEdit ? 'Update' : 'Create'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </Container>
    );
}
