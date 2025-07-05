import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import VoiceInput from '../../components/VoiceInput';
import './SellerSignup.css';

export default function SellerSignup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shop_name: '',
        craft_category: '',
        district: '',
        village: '',
        govt_id_type: '',
        govt_id_number: '',
        bank_account_no: '',
        bank_ifsc: '',
        id_document: null,
    });
    const [msg, setMsg] = useState('');
    const [err, setErr] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        setFormData(prev => ({ ...prev, id_document: e.target.files[0] }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setErr(false);

        const token = localStorage.getItem('access');
        if (!token) {
            return navigate('/login', { state: { next: '/seller/status' } });
        }

        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (val != null) data.append(key, val);
        });

        try {
            await axios.post(
                'http://127.0.0.1:8000/api/seller/signup/',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMsg('Application submitted, pending approval.');
            setTimeout(() => navigate('/seller-panel/status'), 1000);
        } catch (error) {
            setErr(true);
            const detail = error.response?.data?.detail || 'Submission failed.';
            setMsg(detail);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 d-flex justify-content-center">
            <Card className="p-4 form-card" style={{ maxWidth: 600, width: '100%' }}>
                <h2 className="mb-4 text-center">Artisan Signup</h2>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    {[
                        { label: 'Shop name', name: 'shop_name' },
                        { label: 'Craft category', name: 'craft_category' },
                        { label: 'District', name: 'district' },
                        { label: 'Village', name: 'village' },
                        { label: 'Govt ID Type', name: 'govt_id_type' },
                        { label: 'Govt ID Number', name: 'govt_id_number' },
                        { label: 'Bank account no', name: 'bank_account_no' },
                        { label: 'Bank IFSC', name: 'bank_ifsc' },
                    ].map(field => (
                        <Form.Group controlId={field.name} className="mb-3" key={field.name}>
                            <Form.Label>{field.label}</Form.Label>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Form.Control
                                    required
                                    type="text"
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="long-input"
                                />
                                <VoiceInput
                                    setValue={(text) =>
                                        setFormData(prev => ({ ...prev, [field.name]: text }))
                                    }
                                />
                            </div>
                        </Form.Group>
                    ))}

                    <Form.Group controlId="id_document" className="mb-3">
                        <Form.Label>Upload Govt ID</Form.Label>
                        <Form.Control
                            required
                            type="file"
                            accept=".jpg,.png,.pdf"
                            onChange={handleFileChange}
                            className="long-input"
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Submit Application'}
                    </Button>
                </Form>

                {msg && (
                    <Alert variant={err ? 'danger' : 'success'} className="mt-3 text-center">
                        {msg}
                    </Alert>
                )}
            </Card>
        </Container>
    );
}
