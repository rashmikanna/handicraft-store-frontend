import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
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
    Form,
} from 'react-bootstrap';
import { FaShoppingCart, FaHeart, FaRegHeart, FaArrowLeft } from 'react-icons/fa';
import Spinner360 from '../components/Spinner360';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { cart, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);

    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // 1) load product, reviews, wishlist status
    useEffect(() => {
        const token = localStorage.getItem('access');
        setLoading(true);
        setError(null);

        axios.get(`/api/products/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(() => setError('Unable to load product details.'))
            .finally(() => setLoading(false));

        axios.get(`/api/products/${id}/reviews/`)
            .then(res => setReviews(res.data))
            .catch(() => {/* ignore */ });

        if (token) {
            axios.get('/api/usersdata/wishlist/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setInWishlist(res.data.some(p => p.id === id)))
                .catch(() => {/* ignore */ });
        }
    }, [id]);

    const toggleWishlist = () => {
        const token = localStorage.getItem('access');
        if (!token) return navigate('/login');
        const url = inWishlist
            ? '/api/usersdata/wishlist/remove_product/'
            : '/api/usersdata/wishlist/add_product/';
        axios.post(url, { product_id: id }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => setInWishlist(f => !f))
            .catch(() => alert('Could not update wishlist.'));
    };

    const handleReviewSubmit = e => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        if (!token) return navigate('/login');
        axios.post(`/api/products/${id}/reviews/`, newReview, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setReviews(prev => [...prev, res.data]);
                setNewReview({ rating: 5, comment: '' });
            })
            .catch(() => alert('Could not submit review.'));
    };

    const inCartItem = cart.find(item => item.productId === id) || {};
    const inc = () => updateQuantity(id, (inCartItem.quantity || 0) + 1);
    const dec = () => {
        if ((inCartItem.quantity || 0) <= 1) removeFromCart(id);
        else updateQuantity(id, inCartItem.quantity - 1);
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" /><p>Loading…</p>
            </Container>
        );
    }
    if (error) {
        return <Alert variant="danger" className="mt-5">{error}</Alert>;
    }
    if (!product) {
        return <Alert variant="warning" className="mt-5">Product not found.</Alert>;
    }

    const images = product.images.length
        ? product.images
        : ['/default-placeholder-image.jpg'];

    return (
        <Container className="mt-5">
            {/* Back button */}
            <Button
                variant="link"
                className="mb-3 d-flex align-items-center text-dark"  // ← text-dark makes all text/icons black
                onClick={() => navigate('/products')}
            >
                <FaArrowLeft size={30} className="me-2" />
                
            </Button>

            <Card className="shadow-sm">
                <Row className="g-0">
                    {/* Main carousel */}
                    <Col md={7} className="p-4">
                        <Carousel
                            activeIndex={carouselIndex}
                            onSelect={i => setCarouselIndex(i)}
                            indicators={false}
                            controls interval={null}
                        >
                            {images.map((url, i) => (
                                <Carousel.Item key={i}>
                                    <Image
                                        src={url}
                                        fluid
                                        style={{ objectFit: 'contain', height: '500px', width: '100%' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <Row className="mt-2 gx-2">
                            {images.map((url, i) => (
                                <Col xs={2} key={i} onClick={() => setCarouselIndex(i)}>
                                    <Image
                                        src={url}
                                        thumbnail
                                        style={{
                                            cursor: 'pointer',
                                            border: carouselIndex === i ? '2px solid #ffc107' : undefined
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Details & actions */}
                    <Col md={5} className="p-4 d-flex flex-column">
                        <h2>{product.name}</h2>
                        <h3 className="text-success">₹{product.price}</h3>
                        <p>{product.description}</p>

                        {/* Craft link */}
                        {product.craft && (
                            <div className="mb-3">
                                <Link
                                    to={`/crafts/${product.craft}`}
                                    state={{ fromProduct: id }}
                                    className="text-decoration-underline text-dark"
                                >
                                    Learn more about this craft
                                </Link>
                            </div>
                        )}

                        {Object.keys(product.specifications || {}).length > 0 && (
                            <>
                                <h5 style={{ marginBottom: '1rem' }}>Specifications</h5>
                                <ListGroup variant="flush" className="mb-3">
                                    {Object.entries(product.specifications).map(([k, v]) => (
                                        <ListGroup.Item key={k}>
                                            <strong>{k.replace(/_/g, ' ')}:</strong> {v}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}

                        {!inCartItem.quantity ? (
                            <div className="d-flex gap-2 mt-auto">
                                <Button
                                    variant="warning"
                                    style={{ flex: 1 }}
                                    onClick={() => addToCart({
                                        productId: id,
                                        name: product.name,
                                        price: product.price,
                                        image: images[0],
                                    })}
                                >
                                    <FaShoppingCart className="me-2" /> Add to Cart
                                </Button>
                                <Button
                                    onClick={toggleWishlist}
                                    style={{ fontSize: '1.5rem', background: 'none', border: 'none', boxShadow: 'none', outline: 'none' }}
                                >
                                    {inWishlist ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 mt-auto">
                                <Button onClick={dec}>–</Button>
                                <span>{inCartItem.quantity}</span>
                                <Button onClick={inc}>+</Button>
                                <Button variant="danger" onClick={() => removeFromCart(id)}>Remove</Button>
                                <Button
                                    onClick={toggleWishlist}
                                    style={{ fontSize: '1.5rem', background: 'none', border: 'none', boxShadow: 'none', outline: 'none', padding: 0 }}
                                >
                                    {inWishlist ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                                </Button>
                            </div>
                        )}

                        {/* 360° spin frames */}
                        {product.spin_frames?.length > 0 && (
                            <div className="mt-4">
                                <h5>360° View</h5>
                                <Spinner360
                                    frames={product.spin_frames}
                                    width={400}
                                    height={400}
                                />
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Reviews */}
                <Row className="p-4">
                    <Col>
                        <h4>Customer Reviews</h4>
                        {reviews.length > 0 ? (
                            reviews.map((r, i) => (
                                <Card key={i} className="mb-3 p-3">
                                    <strong>{r.user}</strong>
                                    <div>
                                        {[1, 2, 3, 4, 5].map(s =>
                                            <span key={s} style={{ color: s <= r.rating ? 'green' : '#ccc' }}>&#9733;</span>
                                        )}
                                    </div>
                                    <p>{r.comment}</p>
                                    <small className="text-muted">{new Date(r.created_at).toLocaleString()}</small>
                                </Card>
                            ))
                        ) : <p>No reviews yet.</p>}

                        <h5 className="mt-4">Leave a Review</h5>
                        <Form onSubmit={handleReviewSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Label>Rating</Form.Label>
                                <div>
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <Button
                                            key={n}
                                            type="button"
                                            style={{
                                                color: n <= newReview.rating ? 'green' : '#ccc',
                                                fontSize: '2rem',
                                                marginRight: '0.5rem',
                                                background: 'none', border: 'none', padding: 0
                                            }}
                                            onClick={() => setNewReview(r => ({ ...r, rating: n }))}
                                        >
                                            &#9733;
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newReview.comment}
                                    onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))}
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
