import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Container, Table, Image, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cart.length === 0)
    return (
      <Container className="mt-5 text-center">
        <h4>Your cart is empty.</h4>
      </Container>
    );

  return (
    <Container className="mt-5">
      <h3>Your Shopping Cart</h3>
      <Table responsive bordered hover className="mt-3 align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price (₹)</th>
            <th>Quantity</th>
            <th>Total (₹)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(({ productId, name, price, quantity, image }) => (
            <tr key={productId}>
              <td className="d-flex align-items-center gap-3">
                <Image
                  src={image || "/default-placeholder-image.jpg"}
                  alt={name}
                  rounded
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
                <span>{name}</span>
              </td>
              <td>{price.toFixed(2)}</td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      updateQuantity(productId, Math.max(quantity - 1, 1))
                    }
                  >
                    -
                  </Button>
                  <span>{quantity}</span>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => updateQuantity(productId, quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </td>
              <td>{(price * quantity).toFixed(2)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeFromCart(productId)}
                >
                  Remove
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Proceed to Checkout Button */}
      <div className="text-end mt-4">
        <Button variant="success" size="lg" onClick={handleCheckout}>
          Proceed to Checkout
        </Button>
      </div>
    </Container>
  );
}
