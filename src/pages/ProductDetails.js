// src/pages/ProductDetails.js

import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import {
    Container,
    Row,
    Col,
    Spinner,
    Alert,
    Card,
    Carousel,
    Button,
    ListGroup,
    Image,
    Form
} from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);
    const [inWishlist, setInWishlist] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    const siteBgColor = '#F2EFEA';
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError(null);

        // Fetch product details
        axios.get(`http://localhost:8000/api/products/products/${id}/`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load product details.');
                setLoading(false);
            });

        // Fetch reviews for this product
        axios.get(`http://localhost:8000/api/products/${id}/reviews/`)
            .then(res => setReviews(res.data))
            .catch(err => {
                console.error('Error loading reviews:', err);
                // Don't fail entire page for reviews error
            });

        // Check if product is in wishlist
        const token = localStorage.getItem('access');
        if (token) {
            axios.get('http://localhost:8000/api/users/wishlist/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => {
                    const productIds = (res.data.products || []).map(p => p.id);
                    setInWishlist(productIds.includes(id));
                })
                .catch(() => {
                    // ignore if not logged in or no wishlist
                });
        }
    }, [id]);

    const handleSelect = (selectedIndex) => {
        setCarouselIndex(selectedIndex);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!newReview.comment) return; // simple validation

        const token = localStorage.getItem('access');
        if (!token) {
            alert('You must be logged in to submit a review.');
            return;
        }

        axios.post(
            `http://localhost:8000/api/products/${id}/reviews/`,
            newReview,
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
            .then(res => {
                setReviews(prev => [...prev, res.data]);
                setNewReview({ rating: 5, comment: '' });
            })
            .catch(err => {
                console.error('Error submitting review:', err);
                alert('Failed to submit review.');
            });
    };

    const toggleWishlist = () => {
        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
            return;
        }

        if (inWishlist) {
            axios.post(
                'http://localhost:8000/api/users/wishlist/remove-product/',
                { product_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(() => setInWishlist(false))
                .catch(err => console.error(err));
        } else {
            axios.post(
                'http://localhost:8000/api/users/wishlist/add-product/',
                { product_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            )
                .then(() => setInWishlist(true))
                .catch(err => console.error(err));
        }
    };

    if (loading) return (
        <Container className="mt-5 text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Loading product details...</p>
        </Container>
    );

    if (error) return <Alert variant="danger" className="mt-5">{error}</Alert>;

    if (!product) return <Alert variant="warning" className="mt-5">Product not found.</Alert>;

    const { images = [], specifications = {}, created_at } = product;

    const displayImages = Array.isArray(images) && images.length > 0
        ? images
        : ['/default-placeholder-image.jpg'];

    const productInCart = cart.find(item => item.productId === product.id);

    const handleIncrease = () => {
        updateQuantity(product.id, (productInCart?.quantity || 0) + 1);
    };

    const handleDecrease = () => {
        if ((productInCart?.quantity || 0) - 1 <= 0) {
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, (productInCart?.quantity || 0) - 1);
        }
    };

    const handleRemove = () => {
        removeFromCart(product.id);
    };

    return (
        <Container className="mt-5">
            <Card className="shadow-sm text-dark" style={{ backgroundColor: siteBgColor }}>
                <Row className="g-0">
                    <Col md={7} style={{ backgroundColor: siteBgColor }} className="p-4">
                        <Carousel
                            activeIndex={carouselIndex}
                            onSelect={handleSelect}
                            indicators={false}
                            controls={true}
                            interval={null}
                        >
                            {displayImages.map((url, idx) => (
                                <Carousel.Item key={idx} style={{ backgroundColor: siteBgColor }}>
                                    <Image
                                        src={url}
                                        alt={`Slide ${idx + 1}`}
                                        fluid
                                        style={{ objectFit: 'contain', height: '500px', width: '100%' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>

                        <Row className="mt-3 gx-2">
                            {displayImages.map((url, idx) => (
                                <Col key={idx} xs={2} onClick={() => handleSelect(idx)}>
                                    <Image
                                        src={url}
                                        alt={`Thumbnail ${idx + 1}`}
                                        thumbnail
                                        style={{ cursor: 'pointer', border: carouselIndex === idx ? '2px solid #ffc107' : '1px solid #ddd' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    <Col md={5} className="p-4 d-flex flex-column">
                        <h2 className="mb-2">{product.name}</h2>
                        <p className="text-muted mb-3">{product.description}</p>
                        <h4 className="text-success mb-3">₹{product.price}</h4>
                        {created_at && (
                            <small className="text-muted mb-4">
                                Added on: {new Date(created_at).toLocaleDateString('en-IN')}
                            </small>
                        )}

                        {Object.keys(specifications).length > 0 && (
                            <>
                                <h5 className="mt-3 mb-2">Specifications</h5>
                                <ListGroup variant="flush" className="mb-4">
                                    {Object.entries(specifications).map(([key, value]) => (
                                        <ListGroup.Item
                                            key={key}
                                            className="py-2"
                                            style={{ backgroundColor: siteBgColor, border: 'none' }}
                                        >
                                            <strong className="text-capitalize">{key.replace(/_/g, ' ')}:</strong> {value}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}

                        {/* Add to Cart + Wishlist on same line */}
                        {!productInCart ? (
                            <div className="d-flex align-items-center mt-auto w-100">
                                <Button
                                    variant="success"
                                    size="lg"
                                    className="flex-grow-1 me-2"
                                    onClick={() =>
                                        addToCart({
                                            productId: product.id,
                                            name: product.name,
                                            price: product.price,
                                            image: product.images?.[0] || null,
                                        })
                                    }
                                >
                                    <FaShoppingCart className="me-2" /> Add to Cart
                                </Button>
                                <button
                                    onClick={toggleWishlist}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                >
                                    {inWishlist ? (
                                        <FaHeart color="red" size={32} />
                                    ) : (
                                        <FaRegHeart color="gray" size={32} />
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="d-flex align-items-center mt-auto gap-3 w-100">
                                <Button variant="outline-secondary" onClick={handleDecrease}>-</Button>
                                <span style={{ fontSize: 18 }}>{productInCart.quantity}</span>
                                <Button variant="outline-secondary" onClick={handleIncrease}>+</Button>
                                <Button variant="danger" onClick={handleRemove}>Remove</Button>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Reviews Section */}
                <Row className="mt-4 p-4">
                    <Col>
                        <h4>Customer Reviews</h4>
                        {reviews.length > 0 ? (
                            <ListGroup className="mb-3">
                                {reviews.map((review, idx) => (
                                    <ListGroup.Item key={idx}>
                                        <strong>{review.user}</strong>
                                        <div>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span
                                                    key={star}
                                                    style={{
                                                        color: star <= review.rating ? 'green' : '#ccc',
                                                        fontSize: '1.2rem',
                                                    }}
                                                >
                                                    ★
                                                </span>
                                            ))}
                                        </div>
                                        <p>{review.comment}</p>
                                        <small className="text-muted">
                                            {new Date(review.created_at).toLocaleString()}
                                        </small>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}

                        {/* Submit Review Form */}
                        <h5 className="mt-4">Leave a Review</h5>
                        <Form onSubmit={handleReviewSubmit}>
                            <Form.Group controlId="reviewRating" className="mb-2">
                                <Form.Label>Rating</Form.Label>
                                <div className="mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Button
                                            key={star}
                                            type="button"
                                            variant="link"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            style={{
                                                color: star <= newReview.rating ? 'green' : '#ccc',
                                                fontSize: '1.8rem',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            ★
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group controlId="reviewComment" className="mb-2">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" variant="success">Submit Review</Button>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
}

export default ProductDetails;
