import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Container,
    Card,
    Spinner,
    Alert,
    Row,
    Col,
    Badge,
    ListGroup,
    Image,
} from "react-bootstrap";

function OrderHistoryPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8000/api/orders/history/",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("access")}`,
                        },
                    }
                );
                setOrders(response.data);
            } catch (err) {
                setError("Failed to load order history.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" variant="danger" />
                <p className="mt-2">Loading your order history...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <h2 className="mb-4 text-center text-danger">🧾 My Order History</h2>
            {orders.length === 0 ? (
                <Alert variant="warning" className="text-center">
                    You haven’t placed any orders yet.
                </Alert>
            ) : (
                orders.map((order, index) => (
                    <Card key={index} className="mb-4 shadow">
                        <Card.Header className="bg-danger text-white">
                            <Row>
                                <Col>Order #{index + 1}</Col>
                                <Col className="text-end">
                                    <Badge bg="light" text="dark">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </Badge>
                                </Col>
                            </Row>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={6}>
                                    <strong>Total:</strong> ₹{order.total_price}
                                </Col>
                                <Col md={6}>
                                    <strong>Payment:</strong> {order.payment_method}
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col>
                                    <strong>Shipping Address:</strong>
                                    <br />
                                    {order.shipping_address}
                                </Col>
                            </Row>
                            <h5 className="mt-4 text-danger">Items:</h5>
                            <ListGroup variant="flush">
                                {order.items.map((item, idx) => (
                                    <ListGroup.Item key={idx}>
                                        <Row className="align-items-center">
                                            {/* Image column (adjust src as needed) */}
                                            <Col md={2}>
                                                <Image
                                                    src={item.image}
                                                    alt={item.product_name}
                                                    className="img-fluid"
                                                    rounded
                                                />
                                            </Col>

                                            {/* Product name */}
                                            <Col md={6}>{item.product_name}</Col>

                                            {/* Price */}
                                            <Col md={2}>₹{item.price}</Col>

                                            {/* Quantity */}
                                            <Col md={2}>Qty: {item.quantity}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                ))
            )}
        </Container>
    );
}

export default OrderHistoryPage;
