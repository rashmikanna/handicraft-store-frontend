import React from 'react'; 
import { Container, Carousel } from 'react-bootstrap';
import './HomePage.css';

function HomePage() {
  const images = [
    '/images/img1.jpg',
    '/images/img2.jpg',
    '/images/img3.jpg',
  ];

  return (
    <div>
      <Container className="text-center mt-5">
        <h1 className="fw-bold">
          Welcome to <span style={{ color: '#d97706' }}>Telangana Handlooms</span> &{' '}
          <span style={{ color: '#1e3a8a' }}>Handicrafts</span>
        </h1>
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
