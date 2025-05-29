import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, ListGroup, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";

function OrderSummary() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/orders/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,  // Use 'access' token here
        },
      })
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order summary.");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p>Loading order summary...</p>
      </Container>
    );

  if (error)
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );

  if (!order)
    return (
      <Container className="mt-5">
        <Alert variant="warning">Order not found.</Alert>
      </Container>
    );

  return (
    <Container className="mt-5" style={{ maxWidth: "700px" }}>
      <h2>Order Summary</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleString("en-IN")}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
      <p><strong>Payment Method:</strong> {order.payment_method}</p>

      <Card>
        <ListGroup variant="flush">
          {order.items.map((item) => (
            <ListGroup.Item key={item.product_id} className="d-flex align-items-center">
              <img
                src={item.image || "/default-placeholder-image.jpg"}
                alt={item.product_name}
                style={{ width: 60, height: 60, objectFit: "cover", marginRight: 15 }}
              />
              <div style={{ flex: 1 }}>
                <h5>{item.product_name}</h5>
                <p>Quantity: {item.quantity}</p>
              </div>
              <div><strong>₹{(item.price * item.quantity).toFixed(2)}</strong></div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      <h4 className="mt-3">
        Total Price: ₹
        {typeof order.total_price === "number"
          ? order.total_price.toFixed(2)
          : parseFloat(order.total_price || 0).toFixed(2)}
      </h4>


      <Button as={Link} to="/" variant="success" className="mt-3">
        Back to Home
      </Button>
    </Container>
  );
}

export default OrderSummary;
