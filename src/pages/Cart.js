import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Form, Card } from 'react-bootstrap';

const initialCartItems = [
  {
    id: 1,
    name: 'Wooden Doll',
    price: 250,
    quantity: 2,
    image: 'https://i.imgur.com/UH3IPXw.jpeg',
  },
  {
    id: 2,
    name: 'Handmade Pot',
    price: 500,
    quantity: 1,
    image: 'https://i.imgur.com/zi6kzIx.jpeg',
  },
];

function Cart() {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const handleQuantityChange = (id, delta) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
    );
  };

  const handleRemoveItem = id => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map(item => (
            <Card className="mb-3 shadow-sm" key={item.id}>
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <h5>{item.name}</h5>
                    <p>₹{item.price}</p>
                  </Col>
                  <Col md={3}>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      −
                    </Button>
                    <Form.Control
                      className="d-inline mx-2"
                      style={{ width: '60px', textAlign: 'center' }}
                      value={item.quantity}
                      readOnly
                    />
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      +
                    </Button>
                  </Col>
                  <Col md={2}>
                    <strong>₹{item.price * item.quantity}</strong>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          <Card className="mt-4 p-3 shadow-sm">
            <Row className="align-items-center">
              <Col md={8}>
                <h4>Total: ₹{totalAmount}</h4>
              </Col>
              <Col md={4} className="text-end">
                <Button variant="success" size="lg" disabled>
                  Proceed to Checkout
                </Button>
              </Col>
            </Row>
          </Card>
        </>
      )}
    </Container>
  );
}

export default Cart;
