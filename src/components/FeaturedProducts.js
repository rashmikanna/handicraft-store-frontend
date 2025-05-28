// FeaturedProducts.js

import React, { useEffect, useState } from 'react';
import { Row, Col, Image, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FeaturedProducts.css'; // 👈 Import the custom CSS

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/products/products/')
      .then(res => {
        const limited = Array.isArray(res.data) ? res.data.slice(0, 12) : [];
        setProducts(limited);
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center my-5">Loading featured products...</p>;
  if (error) return <p className="text-danger text-center my-5">{error}</p>;

  return (
    <section className="featured-products-section">
      <Container>
        <div className="text-center mb-4">
          <h2 className="featured-products-title">Featured Products</h2>
          <p className="featured-products-subtext">
            Handpicked crafts and collections from Telangana artisans
          </p>
        </div>
        <Row>
          {products.map(p => (
            <Col key={p.id} xs={6} sm={4} md={3} className="mb-4">
              <div className="product-card p-2 h-100">
                <Image
                  src={p.images?.[0] || '/default-placeholder-image.jpg'}
                  alt={p.name}
                  fluid
                  rounded
                  style={{
                    objectFit: 'cover',
                    height: '200px',
                    width: '100%',
                  }}
                  onClick={() => navigate(`/products/${p.id}`)}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
