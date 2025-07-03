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

    // Load product, reviews, wishlist status
    useEffect(() => {
        const token = localStorage.getItem('access');
        setLoading(true);
        setError(null);

        // Fetch product details
        axios.get(`http://localhost:8000/api/products/products/${id}/`)
            .then(res => setProduct(res.data))
            .catch(() => setError('Failed to load product.'));

        // Fetch reviews
        axios.get(`http://localhost:8000/api/products/${id}/reviews/`)
            .then(res => setReviews(res.data))
            .catch(() => {/* ignore reviews errors */ });

        // Check if this product is in the user's wishlist
        if (token) {
            axios.get('http://localhost:8000/api/usersdata/wishlist/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setInWishlist(res.data.some(p => p.id === id)))
                .catch(() => {/* ignore wishlist status errors */ });
        }

        setLoading(false);
    }, [id]);

    // Toggle wishlist add/remove
    const toggleWishlist = () => {
        const token = localStorage.getItem('access');
        if (!token) {
            navigate('/login');
            return;
        }
        const url = inWishlist
            ? 'http://localhost:8000/api/usersdata/wishlist/remove_product/'
            : 'http://localhost:8000/api/usersdata/wishlist/add_product/';

        axios.post(
            url,
            { product_id: id },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(() => setInWishlist(!inWishlist))
            .catch(() => alert('Failed to update wishlist.'));
    };

    // Submit a new review
    const handleReviewSubmit = e => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        if (!token) return navigate('/login');

        axios.post(
            `http://localhost:8000/api/products/${id}/reviews/`,
            newReview,
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then(res => {
                setReviews(prev => [...prev, res.data]);
                setNewReview({ rating: 5, comment: '' });
            })
            .catch(() => alert('Failed to submit review.'));
    };

    // Cart quantity helpers
    const inCart = cart.find(item => item.productId === id);
    const increase = () => updateQuantity(id, (inCart?.quantity || 0) + 1);
    const decrease = () => {
        if ((inCart?.quantity || 0) <= 1) removeFromCart(id);
        else updateQuantity(id, inCart.quantity - 1);
    };

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
                <p>Loading...</p>
            </Container>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-5">{error}</Alert>;
    }

    if (!product) {
        return <Alert variant="warning" className="mt-5">Product not found.</Alert>;
    }

    const images = product.images?.length ? product.images : ['/default-placeholder-image.jpg'];
    const specs = product.specifications || {};

    return (
        <Container className="mt-5">
            <Card className="shadow-sm">
                <Row className="g-0">
                    {/* Image Carousel */}
                    <Col md={7} className="p-4">
                        <Carousel
                            activeIndex={carouselIndex}
                            onSelect={setCarouselIndex}
                            indicators={false}
                            controls
                            interval={null}
                        >
                            {images.map((url, idx) => (
                                <Carousel.Item key={idx}>
                                    <Image
                                        src={url}
                                        fluid
                                        style={{ objectFit: 'contain', height: '500px', width: '100%' }}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                        <Row className="mt-2 gx-2">
                            {images.map((url, idx) => (
                                <Col xs={2} key={idx} onClick={() => setCarouselIndex(idx)}>
                                    <Image
                                        src={url}
                                        thumbnail
                                        style={{
                                            cursor: 'pointer',
                                            border: carouselIndex === idx ? '2px solid #ffc107' : undefined
                                        }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Col>

                    {/* Details & Actions */}
                    <Col md={5} className="p-4 d-flex flex-column">
                        <h2>{product.name}</h2>
                        <p className="text-success">₹{product.price}</p>
                        <p>{product.description}</p>

                        {Object.keys(specs).length > 0 && (
                            <>
                                <h5>Specifications</h5>
                                <ListGroup variant="flush" className="mb-3">
                                    {Object.entries(specs).map(([key, val]) => (
                                        <ListGroup.Item key={key}>
                                            <strong>{key.replace(/_/g, ' ')}:</strong> {val}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </>
                        )}

                        {/* Add to Cart & Wishlist Buttons */}
                        {!inCart ? (
                            <div className="d-flex gap-2 mt-auto">
                                <Button
                                    variant="warning"
                                    style={{ flex: 1 }}
                                    onClick={() => addToCart({
                                        productId: id,
                                        name: product.name,
                                        price: product.price,
                                        image: images[0]
                                    })}
                                >
                                    <FaShoppingCart className="me-2" /> Add to Cart
                                </Button>
                                <Button
                                    onClick={toggleWishlist}
                                    style={{
                                        fontSize: '1.5rem',
                                        background: 'none',
                                        border: 'none',
                                        boxShadow: 'none',
                                        outline: 'none'
                                    }}
                                >

                                    {inWishlist ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                                </Button>
                            </div>
                        ) : (
                            <div className="d-flex gap-2 mt-auto">
                                <Button onClick={decrease}>-</Button>
                                <span>{inCart.quantity}</span>
                                <Button onClick={increase}>+</Button>
                                <Button variant="danger" onClick={() => removeFromCart(id)}>Remove</Button>
                                    <Button
                                        onClick={toggleWishlist}
                                        style={{
                                            fontSize: '1.5rem',
                                            background: 'none',
                                            border: 'none',
                                            boxShadow: 'none',
                                            outline: 'none',
                                            padding: 0
                                        }}
                                    >

                                    {inWishlist ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
                                </Button>
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Reviews Section */}
                <Row className="p-4">
                    <Col>
                        <h4>Customer Reviews</h4>
                        {reviews.length > 0 ? (
                            reviews.map((rev, idx) => (
                                <Card key={idx} className="mb-3 p-3">
                                    <strong>{rev.user}</strong>
                                    <div>
                                        {[1, 2, 3, 4, 5].map(st => (
                                            <span
                                                key={st}
                                                style={{ color: st <= rev.rating ? 'green' : '#ccc' }}
                                            >
                                                &#9733;
                                            </span>
                                        ))}
                                    </div>
                                    <p>{rev.comment}</p>
                                    <small className="text-muted">
                                        {new Date(rev.created_at).toLocaleString()}
                                    </small>
                                </Card>
                            ))
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}

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
                                                fontSize: '2rem',           // increase star size
                                                marginRight: '10px',        // add space between stars
                                                background: 'none',
                                                border: 'none',
                                                padding: 0,
                                                textDecoration: 'none'
                                            }}
                                            onClick={() => setNewReview({ ...newReview, rating: n })}
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
                                    onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
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
