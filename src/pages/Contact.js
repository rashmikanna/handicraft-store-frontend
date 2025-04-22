import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

function Contact() {
  return (
    <Container className="mt-5">
      <h2>Contact Us</h2>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Your Name" />
        </Form.Group>

        <Form.Group controlId="email" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Your Email" />
        </Form.Group>

        <Form.Group controlId="message" className="mt-3">
          <Form.Label>Message</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Your Message" />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Send
        </Button>
      </Form>
    </Container>
  );
}

export default Contact;
