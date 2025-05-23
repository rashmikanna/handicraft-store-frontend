import React, { useState, useEffect } from 'react';
import { Navbar, Form, FormControl, Button, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import { FaBars, FaHeart, FaShoppingCart, FaUser, FaBell, FaHome } from 'react-icons/fa';

const dummyProducts = [
  'Handloom Saree', 'Clay Pot', 'Bamboo Basket', 'Wooden Toys', 'Brass Lamp',
  'Terracotta Plate', 'Ikat Fabric', 'Palm Leaf Art', 'Dokra Figurine', 'Pochampally Dupatta',
  'Nirmal Painting', 'Bidriware Box', 'Lacquerware Bangles', 'Cherial Scroll', 'Cotton Kurti',
  'Brass Urli', 'Khadi Shirt', 'Terracotta Vase', 'Handwoven Towel', 'Jute Bag'
];

const sidebarItems = [
  {
    title: "Trending Now",
    links: ["Top-Selling Crafts", "Customer Favorites", "Just Launched", "Festival Specials"]
  },
  {
    title: "Handloom Collection",
    links: ["Sarees", "Dupattas", "Fabrics", "Scarves", "Stoles"]
  },
  {
    title: "Handicrafts & Art",
    links: ["Clay & Terracotta", "Brass & Metalware", "Wooden Toys", "Cherial Scrolls", "Palm Leaf Creations"]
  },
  {
    title: "New Arrivals",
    links: ["Recently Added", "Featured Artisans", "Limited Editions", "Seasonal Picks"]
  },
  {
    title: "Modern Living",
    links: ["Eco Essentials", "Home Decor", "Fashion Accessories", "Bags & Jewelry"]
  },
  {
    title: "Gift Ideas",
    links: ["Under ₹500", "Artisanal Combos", "Occasion-Based Gifts", "Gift Cards"]
  }
];

function NavbarComponent() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountOptions, setShowAccountOptions] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access');
    setIsLoggedIn(!!token);
  }, []);

  const handleSearchChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);
    if (input.trim()) {
      const filtered = dummyProducts.filter((item) =>
        item.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchClick = () => {
    console.log('Searching for:', searchTerm);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="shadow-sm py-3 px-4 sticky-top flex-column">
        <Container fluid className="align-items-center justify-content-between d-flex w-100">
          <div className="hamburger-icon" onClick={() => setSidebarOpen(true)}>
            <FaBars size={22} />
          </div>

          <Navbar.Brand onClick={() => navigate('/')} className="kalamart-logo" style={{ cursor: 'pointer' }}>
  Kala<span className="highlight-part">Mart</span>
</Navbar.Brand>



          <div className="search-container">
            <Form className="d-flex align-items-center position-relative custom-search-form">
              <FormControl
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="me-2 search-bar-input extended-search-bar"
                aria-label="Search"
              />
              <Button variant="warning" onClick={handleSearchClick}>
                Search
              </Button>

              {suggestions.length > 0 && (
                <ul className="dropdown-suggestions">
                  {suggestions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </Form>
          </div>

          <div className="navbar-icons d-flex align-items-center gap-3">
            <div className="nav-item" onClick={() => navigate('/home')}><FaHome title="Home" /></div>
            <div className="nav-item"><FaBell title="Notifications" /></div>
            <div className="nav-item"><FaHeart title="Wishlist" /></div>
            <div className="nav-item" onClick={() => navigate('/cart')}><FaShoppingCart title="Cart" /></div>
            <div
              className="nav-item"
              onMouseEnter={() => setShowAccountOptions(true)}
              onMouseLeave={() => setShowAccountOptions(false)}
            >
              <FaUser title="Account" />
              {showAccountOptions && (
                <div className="account-options">
                  <ul>
                    {isLoggedIn ? (
                      <li onClick={handleLogout}>Logout</li>
                    ) : (
                      <>
                        <li onClick={() => navigate('/login')}>Login</li>
                        <li onClick={() => navigate('/signup')}>Sign Up</li>
                      </>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>

        {/* Subcategories Bar */}
        <div className="subcategories-bar w-100">
          <div>Silver Crafts</div>
          <div>Handlooms</div>
          <div>Metal Crafts</div>
          <div>Textiles and Embroidery</div>
          <div>Home Decor</div>
        </div>
      </Navbar>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="close-btn" onClick={() => setSidebarOpen(false)}>&times;</span>
        </div>
        {sidebarItems.map((section, index) => (
          <div key={index} className="sidebar-section">
            <h5>{section.title}</h5>
            <ul>
              {section.links.map((link, idx) => (
                <li key={idx}>{link}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Overlay */}
      {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
    </>
  );
}

export default NavbarComponent;
