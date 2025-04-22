import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:8000/api/products/${id}/`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  }, [id]);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <Image src={product.image_url} fluid rounded />
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h4>Price: ₹{product.price}</h4>
          <Button variant="success">Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetails;
