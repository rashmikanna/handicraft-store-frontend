// src/pages/HelpFaq.js

import React from 'react';
import { Container, Accordion, Row, Col } from 'react-bootstrap';
import './HelpFAQ.css';

const HelpFaq = () => {
  return (
    <Container className="help-faq-container my-5">
      {/* Page title */}
      <h1 className="mb-4">Help &amp; FAQ</h1>

      {/* Accordion of FAQs */}
      <Accordion defaultActiveKey="0" flush>
        {/* 1 */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>How do I track my order?</Accordion.Header>
          <Accordion.Body>
            Once your order has shipped, you’ll receive an email with a tracking number and a link. To check its status:
            <ol>
              <li>Log into your account and go to <strong>Order History</strong>.</li>
              <li>Click “View Details” next to the order you want to track.</li>
              <li>Under “Shipping Information,” click “Track Package.”</li>
            </ol>
            If you did a guest checkout, you can still track by entering your email and order number on the <strong>Track Order</strong> page.
          </Accordion.Body>
        </Accordion.Item>

        {/* 2 */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>What is your return &amp; exchange policy?</Accordion.Header>
          <Accordion.Body>
            We want you to be completely happy with your purchase. If you need to return or exchange an item:
            <ul>
              <li>Make sure the product is in its original condition (unworn, unwashed, with tags).</li>
              <li>Initiate a return within <strong>30 days</strong> of delivery. To start, go to your <strong>Order History</strong> and click “Request Return.”</li>
              <li>You’ll receive a prepaid shipping label via email. Pack the item securely and drop it off at the nearest courier location.</li>
            </ul>
            Once we receive and inspect your return, we’ll issue a refund (minus any applicable restocking fees) to your original payment method within 5–7 business days.
          </Accordion.Body>
        </Accordion.Item>

        {/* 3 */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>How long does shipping take?</Accordion.Header>
          <Accordion.Body>
            Shipping times vary depending on your location and chosen shipping method:
            <ul>
              <li><strong>Standard Shipping (Free):</strong> 5–8 business days.</li>
              <li><strong>Expedited Shipping:</strong> 2–3 business days.</li>
              <li><strong>Overnight Shipping:</strong> 1 business day (order must be placed before 2 PM EST).</li>
            </ul>
            All estimated dates start from the moment your order leaves our warehouse (not from when you place the order). During peak seasons (e.g., holidays), it may take an extra 1–2 days.
          </Accordion.Body>
        </Accordion.Item>

        {/* 4 */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>Which payment methods do you accept?</Accordion.Header>
          <Accordion.Body>
            We accept:
            <ul>
              <li>Visa, MasterCard, American Express, Discover</li>
              <li>PayPal</li>
              <li>Google Pay / Apple Pay</li>
              <li>UPI (for Indian customers)</li>
            </ul>
            All payments are processed securely via SSL encryption. If you run into any issues during checkout, double-check your card details or try switching to a different card/service.
          </Accordion.Body>
        </Accordion.Item>

        {/* 5 */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>I forgot my password—how can I reset it?</Accordion.Header>
          <Accordion.Body>
            To reset your password:
            <ol>
              <li>Click “Login” in the top right corner.</li>
              <li>On the login form, click “Forgot Password?” below the fields.</li>
              <li>Enter the email address associated with your account. We’ll send a password-reset link to that address.</li>
              <li>Open your email, click the link, and follow the prompts to choose a new password.</li>
            </ol>
            If you don’t see the email in your inbox within a few minutes, check your spam/junk folder.
          </Accordion.Body>
        </Accordion.Item>

        {/* 6 */}
        <Accordion.Item eventKey="5">
          <Accordion.Header>How do I update my shipping address or payment info?</Accordion.Header>
          <Accordion.Body>
            After logging in:
            <ul>
              <li>Go to “My Account” (click on the user icon in the top nav).</li>
              <li>Select “Account Settings” from the dropdown.</li>
              <li>Under “Profile,” click “Edit” next to “Shipping Address” or “Payment Methods.”</li>
              <li>Make your changes, then click “Save.”</li>
            </ul>
            Any updates you make here will apply to future orders only; past orders cannot be edited.
          </Accordion.Body>
        </Accordion.Item>

        {/* 7 */}
        <Accordion.Item eventKey="6">
          <Accordion.Header>Do you ship internationally?</Accordion.Header>
          <Accordion.Body>
            Yes— we ship to most countries worldwide. At checkout:
            <ul>
              <li>Select your country from the shipping dropdown.</li>
              <li>Our system will calculate duties and taxes (if applicable) and show them before you pay.</li>
              <li>International shipping times typically range from 7–14 business days, depending on customs delays.</li>
            </ul>
            Please be aware that you (the customer) are responsible for any customs fees or import duties charged by your country.
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Contact Customer Support Section */}
      <Row className="mt-5">
        <Col md={8}>
          <h2>Contact Customer Support</h2>
          <p>If you still need assistance, our customer support team is here to help:</p>
          <ul className="list-unstyled">
            <li>
              <strong>Email:</strong> <a href="mailto:support@kalamart.com">support@kalamart.com</a><br />
              (We generally respond within 24 hours, Monday–Friday)
            </li>
            <li>
              <strong>Phone:</strong> +1 (800) 123-4567<br />
              <small className="text-muted">Mon–Fri, 9 AM–6 PM EST</small>
            </li>
            <li>
              <strong>Live Chat:</strong> Click the chat icon at the bottom-right corner of any page to start a live conversation with a support agent.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default HelpFaq;
