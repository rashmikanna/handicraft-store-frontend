//Wishlist.js

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Spinner,
    Alert,
    Card,
    Button,
    Image
} from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaTrashAlt } from 'react-icons/fa';

export default function Wishlist() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('access');
        if (!token) {
            setError('You must be logged in to view your wishlist.');
            setLoading(false);
            return;
        }

        axios
            .get('http://localhost:8000/api/usersdata/wishlist/', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                // res.data.products is an array of full product objects
                setProducts(res.data.products || []);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error loading wishlist:', err.response || err);
                setError('Failed to load wishlist.');
                setLoading(false);
            });
    }, []);

    // Remove a single item from wishlist (and update local state)
    const removeFromWishlist = (productId) => {
        const token = localStorage.getItem('access');
        if (!token) return;

        axios
            .post(
                'http://localhost:8000/api/usersdata/wishlist/remove-product/',
                { product_id: productId },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                // Filter out the removed product locally for immediate UI update
                setProducts(prev => prev.filter(p => p.id !== productId));
            })
            .catch(err => {
                console.error('Error removing from wishlist:', err.response || err);
                alert('Could not remove item from wishlist.');
            });
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status" />
                <p className="mt-2">Loading your wishlist...</p>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }

    if (products.length === 0) {
        return <Alert variant="info" className="mt-5 text-center">Your wishlist is empty.</Alert>;
    }

    return (
        <Container className="mt-5">
            <h2 className="mb-4">My Wishlist</h2>
            {products.map(product => (
                <Card key={product.id} className="mb-3">
                    <Card.Body className="d-flex align-items-start">
                        {/* Left: Image (fixed width) */}
                        <div style={{ width: '150px', flexShrink: 0 }}>
                            <Image
                                src={
                                    product.images && product.images.length > 0
                                        ? product.images[0]
                                        : '/default-placeholder-image.jpg'
                                }
                                alt={product.name}
                                fluid
                                style={{ objectFit: 'cover', height: '150px', width: '150px' }}
                            />
                        </div>

                        {/* Right: Details */}
                        <div className="ms-3 flex-grow-1 d-flex flex-column">
                            {/* Top: Name, Price, Short Description */}
                            <div>
                                <h5 style={{ cursor: 'pointer' }} onClick={() => navigate(`/products/${product.id}`)}>
                                    {product.name}
                                </h5>
                                <p className="text-success mb-2" style={{ fontSize: '1.25rem' }}>
                                    ₹{product.price}
                                </p>
                                {/* Show first 120 characters of description, if available */}
                                {product.description && (
                                    <p className="text-muted">
                                        {product.description.length > 120
                                            ? product.description.substring(0, 120) + '...'
                                            : product.description}
                                    </p>
                                )}
                            </div>

                            {/* Spacer */}
                            <div className="mt-auto d-flex align-items-center">
                                {/* Add to Cart Button */}
                                <Button
                                    variant="warning"
                                    className="me-2"
                                    onClick={() => {
                                        addToCart({
                                            productId: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.images?.[0] || null,
                                        });
                                    }}
                                >
                                    <FaShoppingCart className="me-1" />
                                    Add to Cart
                                </Button>

                                {/* Remove from Wishlist Button */}
                                <Button
                                    variant="outline-danger"
                                    onClick={() => removeFromWishlist(product.id)}
                                    title="Remove from Wishlist"
                                >
                                    <FaTrashAlt className="me-1" />
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
}