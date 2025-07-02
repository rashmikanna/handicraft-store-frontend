import React from 'react';
import { Container, Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import FeaturedProducts from '../components/FeaturedProducts';

function HomePage() {
  const images = [
    'https://res.cloudinary.com/dus8mpxbe/image/upload/WhatsApp_Image_2025-05-31_at_3.58.41_PM_smxt4a.jpg',
    'https://res.cloudinary.com/dus8mpxbe/image/upload/v1746163501/WhatsApp_Image_2025-05-31_at_4.05.40_PM_qp6z5j.jpg',
    'https://res.cloudinary.com/dus8mpxbe/image/upload/v1746163637/WhatsApp_Image_2025-05-31_at_4.07.21_PM_k45zmh.jpg',
  ];

  const navigate = useNavigate(); 

  return (
    <Container className="text-center mt-5">
      <h1 className="fw-bold website-title">
        <span className="gradient-text">Welcome to&nbsp;</span>
        <span className="gradient-text">KalaMart</span>
        <span className="logo-dot">.</span>
      </h1>
      <p className="lead">
        Discover the rich heritage and craftsmanship of Telangana. Shop unique, traditional, and handmade products directly from local artisans.
      </p>

      <Carousel fade controls={false} indicators={false} interval={3000} className="carousel-wrapper large-carousel">
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <img className="d-block mx-auto slider-img" src={img} alt={`Slide ${index}`} />
          </Carousel.Item>
        ))}
      </Carousel>

      <FeaturedProducts />

      {/* About Us Section */}
      <section className="info-section about-us wide-section">
        <div className="info-box">
          <h2>About <span className="highlight">KalaMart</span></h2>
          <div className="info-content about-content with-image left-image">
            <img src={`${process.env.PUBLIC_URL}/images/cheriyal.jpeg`} alt="Cheriyal Scroll Painting" className="section-image" />
            <div className="text-content">
              <p>
                <span className="italic-text">Kala Mart</span> (<span className="telugu-text">కళ మార్ట్</span>, pronounced <span className="bold-text">"ka-laa maart"</span>) means <span className="highlight">"Art Marketplace"</span> in Telugu — a platform to celebrate the rich <span className="highlight">handmade crafts</span> of Telangana.
              </p>
              <p>
                Our mission is to <span className="bold-text">empower local artisans</span> by connecting their <span className="italic-text">timeless skills</span> and heritage with the world.  
                Each product in KalaMart carries the <span className="highlight">authenticity, culture, and tradition</span> passed down through generations.
              </p>
              <p>
                By shopping here, you support fair trade and help keep Telangana’s <span className="highlight">traditional arts alive</span>, making every purchase a meaningful story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Sellers */}
      <section className="info-section meet-sellers wide-section">
        <div className="info-box">
          <h2>Meet Our <span className="highlight">Sellers</span></h2>
          <div className="info-content with-image right-image">
            <div className="text-content">
              <p>
                Get to know the incredible humans behind the craft—skilled hands, proud traditions, and personal stories stitched into every piece.
              </p>
              <button className="info-button" onClick={() => navigate('/sellers')}>
                Learn More
              </button>
            </div>
            <img src={`${process.env.PUBLIC_URL}/images/bajara.jpeg`} alt="Bajara girl" className="section-image" />
          </div>
        </div>
      </section>

      {/* Product Speciality */}
      <section className="info-section product-speciality wide-section">
        <div className="info-box">
          <h2>What Makes Our <span className="highlight">Products Special</span></h2>
          <div className="info-content with-image left-image">
            <img src={`${process.env.PUBLIC_URL}/images/certified.jpeg`} alt="govt" className="section-image" />
            <div className="text-content">
              <p>
                Authentic, handmade, government-certified. Every piece represents timeless craftsmanship passed down through generations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Products */}
      <section className="info-section explore-products wide-section">
        <div className="info-box">
          <h2>Explore Making of Our <span className="highlight">Collections</span></h2>
          <div className="info-content with-image right-image">
            <div className="text-content">
              <p>
                Dive into a world of textiles, metal crafts, wood carvings, and more—each item with a soul, story, and signature style.
              </p>
              <button className="info-button" onClick={() => navigate('/collections')}>
                Learn More
              </button>
            </div>
            <img src={`${process.env.PUBLIC_URL}/images/weave.jpeg`} alt="weave" className="section-image" />
          </div>
        </div>
      </section>
    </Container>
  );
}

export default HomePage;
