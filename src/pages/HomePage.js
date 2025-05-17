import React from 'react';
import { Container, Carousel } from 'react-bootstrap';
import './HomePage.css';

function HomePage() {
  const images = [
      'https://res.cloudinary.com/dus8mpxbe/image/upload/v1746163427/d3krqj2iszg8t61achtr.jpg',
      'https://res.cloudinary.com/dus8mpxbe/image/upload/v1746163501/neyt2jkzclce2bly72gs.jpg',
      'https://res.cloudinary.com/dus8mpxbe/image/upload/v1746163637/jycyoedz2qjeszuzaqfy.jpg',
  ];

  return (
    <div>
      <Container className="text-center mt-5">
  <h1 className="fw-bold">Welcome to <span style={{ color: '#d97706' }}>Telangana Handlooms</span> & <span style={{ color: '#1e3a8a' }}>Handicrafts</span></h1>
  <p className="lead">
    Discover the rich heritage and craftsmanship of Telangana. Shop unique, traditional, and handmade products directly from local artisans.
  </p>

  <Carousel fade controls={false} indicators={false} interval={3000} className="carousel-wrapper">
    {images.map((img, index) => (
      <Carousel.Item key={index}>
        <img className="d-block mx-auto slider-img" src={img} alt={`Slide ${index}`} />
      </Carousel.Item>
    ))}
  </Carousel>
</Container>
    </div>
  );
}

export default HomePage;
