import React, { useContext, useState, useEffect } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import Lottie from "react-lottie-player";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51RhRzo4NPc854TDHfaPUKtSWh8qz5ROKAglsz7UcBPh0VoFV617KxNgrA3gxuHhdc4sBTggSwbFrrbi6nX5WaNHX00fPNPeos7");

const loadRZPScript = () => new Promise(resolve => {
  const s = document.createElement("script");
  s.src = "https://checkout.razorpay.com/v1/checkout.js";
  s.onload = () => resolve(true);
  s.onerror = () => resolve(false);
  document.body.appendChild(s);
});

function CheckoutPage() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isStripeSuccess = queryParams.get("success") === "true";

  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const saved = sessionStorage.getItem("shippingAddress");
    if (saved) setShippingAddress(saved);
  }, []);

  useEffect(() => {
    const placeOrderAfterStripe = async () => {
      if (!isStripeSuccess || success || cart.length === 0) return;

      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/api/orders/create/", {
          shipping_address: shippingAddress || "Not provided",
          payment_method: "Card",
          total_price: totalPrice,
          items: cart.map(item => ({
            product_id: item.productId,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        });

        const orderId = response?.data?.id;
        if (orderId) {
          clearCart();
          setSuccess(true);
          setTimeout(() => navigate(`/orders/${orderId}`), 3000);
        } else {
          setError("Stripe payment succeeded, but order ID is missing.");
        }
      } catch (err) {
        setError("Stripe payment succeeded, but order failed.");
      } finally {
        setLoading(false);
      }
    };

    placeOrderAfterStripe();
  }, [isStripeSuccess]);

  const handleStripePayment = async () => {
    sessionStorage.setItem("shippingAddress", shippingAddress);
    try {
      const stripe = await stripePromise;
      const response = await axios.post("http://localhost:8000/api/orders/create-stripe-session/", {
        items: cart.map(item => ({
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      await stripe.redirectToCheckout({ sessionId: response.data.id });
    } catch (err) {
      setError("Stripe redirection failed. " + (err.message || ""));
      setLoading(false);
    }
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRZPScript();
    if (!res) {
      setError("Failed to load Razorpay SDK");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/orders/create-razorpay-order/", {
        total_price: totalPrice
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
      });

      const { order_id, amount, currency, razorpay_key } = response.data;

      const options = {
        key: razorpay_key,
        amount,
        currency,
        order_id,
        name: "Your Store",
        description: "Order Payment",
        handler: async function (resp) {
          try {
            const orderResponse = await axios.post("http://localhost:8000/api/orders/create/", {
              shipping_address: shippingAddress,
              payment_method: "Netbanking/Wallet",
              total_price: totalPrice,
              items: cart.map(item => ({
                product_id: item.productId,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image,
              })),
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem("access")}` }
            });

            const orderId = orderResponse?.data?.id;

            if (orderId) {
              clearCart();
              setSuccess(true);
              setTimeout(() => navigate(`/orders/${orderId}`), 3000);
            } else {
              setError("Payment succeeded, but order ID is missing.");
            }
          } catch (err) {
            setError("Payment succeeded, but order creation failed.");
          }
        },
        theme: { color: "#3399cc" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError("Razorpay error: " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shippingAddress) {
      setError("Please enter a shipping address.");
      return;
    }

    if (paymentMethod === "Card") {
      await handleStripePayment();
      return;
    }

    if (paymentMethod === "Netbanking/Wallet") {
      await handleRazorpayPayment();
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/orders/create/", {
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        total_price: totalPrice,
        items: cart.map(item => ({
          product_id: item.productId,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      });

      clearCart();
      setSuccess(true);
      setTimeout(() => navigate(`/orders/${response?.data?.id}`), 3000);
    } catch (err) {
      setError("Order failed.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2>Checkout</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success ? (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Lottie loop={false} animationData={require("../assets/success.json")} play style={{ width: 150, height: 150, margin: "auto" }} />
          <h4 className="mt-3 text-success">Order placed successfully!</h4>
          <p>Redirecting to your order details...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="shippingAddress" className="mb-3">
            <Form.Label>Shipping Address</Form.Label>
            <Form.Control as="textarea" rows={3} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
          </Form.Group>

          <Form.Group controlId="paymentMethod" className="mb-4">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="COD">Cash on Delivery</option>
              <option value="Netbanking/Wallet">Netbanking / Wallet</option>
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
