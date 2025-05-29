import React, { useContext, useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import Lottie from "react-lottie-player";

function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // boolean now
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      setError("Please enter a shipping address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/orders/create/",
        {
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          total_price: totalPrice,
          items: cart.map((item) => ({
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      const orderId = response?.data?.id;
      if (orderId) {
        clearCart();
        setSuccess(true);
        setTimeout(() => navigate(`/orders/${orderId}`), 3000);
      } else {
        setError("Order placed, but missing order ID.");
      }
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to place order. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2>Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      {success ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Lottie
            loop={false}
            animationData={require("../assets/success.json")} // Save animation json in src/assets/success.json
            play
            style={{ width: 150, height: 150, margin: "auto" }}
          />
          <h4 className="mt-3 text-success">Order placed successfully!</h4>
          <p>Redirecting to your order details...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="shippingAddress" className="mb-3">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your shipping address"
              required
            />
          </Form.Group>

          <Form.Group controlId="paymentMethod" className="mb-4">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="Card">Credit/Debit Card</option>
            </Form.Select>
          </Form.Group>

          <h4>Total: ₹{totalPrice.toFixed(2)}</h4>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </Form>
      )}
    </Container>
  );
}

export default CheckoutPage;
