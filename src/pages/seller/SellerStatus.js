import React from 'react';
import { Container, Card, Alert } from 'react-bootstrap';

export default function SellerStatus() {
  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="p-4" style={{ maxWidth: 400, width: '100%' }}>
        <Alert variant="info" className="text-center">
          Your application is pending approval. We will notify you once an administrator reviews your documents.
        </Alert>
      </Card>
    </Container>
  );
}
