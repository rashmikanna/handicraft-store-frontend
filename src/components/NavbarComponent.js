//NavbarComponent.js

import React, { useState, useEffect } from 'react';
import {
    Navbar, Form, FormControl, Button, Container, Nav
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaBars, FaHome, FaThList, FaShoppingCart,
    FaBell, FaHeart, FaUser, FaBoxOpen,
    FaPlusCircle, FaShoppingBag, FaSignOutAlt,
    FaExchangeAlt
} from 'react-icons/fa';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const dummyProducts = [
    'Wooden Vase',
    'Handmade Mirror',
    'Terracotta Plate',
    'Brass Lamp',
    'Silk Scarf',
    'Woven Basket'
];

const sidebarItemsFlat = [
      { title: 'Under ₹500', path: '/products?max_price=500' },
      { title: 'New Arrivals', path: '/products?sort=new' },
      { title: 'Handloom Collection', path: '/products?category=handloom' },
      { title: 'Gift Ideas', path: '/products?category=gift' },

      { title: 'Wishlist', path: '/wishlist' },
      { title: 'Order History', path: '/orders/history' },
      { title: 'About Us', path: '/about' },
      { title: 'Contact Us', path: '/contact' },
      { title: 'Help / FAQ', path: '/help' },
 ];

export default function NavbarComponent() {
    const navigate = useNavigate();

    // UI state
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAccountOptions, setShowAccountOptions] = useState(false);
    const { cart } = useCart();

    // Auth & role state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSeller, setIsSeller] = useState(false);
    const [sellerMode, setSellerMode] = useState(false);

    // Fetch auth & seller status on mount
    useEffect(() => {
        const token = localStorage.getItem('access');
        setIsLoggedIn(!!token);
        if (token) {
            axios.get('http://127.0.0.1:8000/api/seller/status/', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => setIsSeller(res.data.approved))
                .catch(() => setIsSeller(false));
        }
    }, []);

<<<<<<< HEAD
    // Toggle search suggestions
    const handleSearchChange = e => {
        const q = e.target.value;
        setSearchTerm(q);
        setSuggestions(q.trim() ? dummyProducts.filter(item => item.toLowerCase().includes(q.toLowerCase())) : []);
    };

    const handleSearchSubmit = e => {
        e.preventDefault();
        const q = searchTerm.trim();
        navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsLoggedIn(false);
        setIsSeller(false);
        setSellerMode(false);
        navigate('/login');
    };
=======
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
>>>>>>> 9d9b3da (Changes made to Homepage)

    const totalQuantity = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    // Start Selling logic: correct redirect based on login & seller state
    const handleStartSelling = () => {
        if (!isLoggedIn) {
            navigate('/signup');
        } else if (!isSeller) {
            navigate('/signup/seller');
        } else {
            setSellerMode(true);
        }
    };

    // Toggle between buyer and seller views
    const toggleSellerMode = () => {
        setSellerMode(prev => !prev);
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm py-3 px-4 sticky-top">
                <Container fluid className="align-items-center justify-content-between d-flex w-100">
                    {/* single hamburger icon */}
                    <div className="hamburger-icon" onClick={() => setSidebarOpen(true)}>
                        <FaBars size={22} />
                    </div>

                    {/* single brand/logo */}
                    <Navbar.Brand onClick={() => navigate('/')} className="kalamart-logo" style={{ cursor: 'pointer' }}>
                        Kala<span className="highlight-part">Mart</span>
                    </Navbar.Brand>

                    {/* SEARCH + ICONS: Buyer Mode */}
                    {!sellerMode && (
                        <>
                            {/* Search bar */}
                            <Form onSubmit={handleSearchSubmit} className="d-flex position-relative mx-auto" style={{ flex: 1, maxWidth: '550px', margin: '0 20px' }}>
                                <FormControl type="search" placeholder="Search for products..." className="me-2" value={searchTerm} onChange={handleSearchChange} />
                                <Button variant="warning" type="submit">Search</Button>
                                {suggestions.length > 0 && (
                                    <ul className="dropdown-suggestions">
                                        {suggestions.map((item, idx) => (
                                            <li key={idx} onClick={() => navigate(`/products?q=${encodeURIComponent(item)}`)}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </Form>

                            {/* Buyer icons */}
                            <div className="navbar-icons d-flex align-items-center gap-3">
                                <FaHome size={23} onClick={() => navigate('/')} />
                                <FaThList onClick={() => navigate('/products')} />
                                <div
                                    className="nav-item position-relative"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate('/cart')}
                                    title="Cart"
                                    >
                                    <FaShoppingCart size={10} />
                                        {totalQuantity > 0 && (
                                            <span
                                            style={{
                                                position: 'absolute',
                                                top: '-5px',
                                                right: '-10px',
                                                background: 'red',
                                                color: 'white',
                                                borderRadius: '50%',
                                                padding: '2px 6px',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                minWidth: '20px',
                                                textAlign: 'center',
                                            }}
                                            >
                                            {totalQuantity}
                                            </span>
                                        )}
                                    </div>

                                <div
                                    className="wishlist-icon"
                                    onClick={() => navigate('/wishlist')}
                                    title="Wishlist"
                                    >
                                    <FaHeart size={21} />
                                 </div>

                                <FaBell size={22} />


                                <div onMouseEnter={() => setShowAccountOptions(true)} onMouseLeave={() => setShowAccountOptions(false)}>
                                    <FaUser />
                                    {showAccountOptions && (
                                        <div className="account-options"><ul>
                                            {isLoggedIn ? <li onClick={handleLogout}>Logout</li> : <><li onClick={() => navigate('/login')}>Login</li><li onClick={() => navigate('/signup')}>Sign Up</li></>}
                                        </ul></div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
<<<<<<< HEAD
=======
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
>>>>>>> 9d9b3da (Changes made to Homepage)

                    {/* CTA Buttons */}
                    <Nav className="align-items-center">
                        {/* Show Start Selling only when not a seller and not in sellerMode */}
                        {!sellerMode && !isSeller && (
                            <Button variant="warning" onClick={handleStartSelling}>Start Selling</Button>
                        )}

                        {/* Show Seller View toggle only when isSeller and not in sellerMode */}
                        {!sellerMode && isSeller && (
                            <Button variant="warning" className="px-4 ms-2" onClick={toggleSellerMode}><FaExchangeAlt className="me-1" /> Seller View</Button>
                        )}

                        {sellerMode && (
                            <>
                                <Button variant="outline-secondary" size="md" className="me-2" onClick={() => navigate('/seller')}>
                                    <FaBoxOpen className="me-1" /> Manage
                                </Button>
                                <Button variant="outline-secondary" size="md" className="me-2" onClick={() => navigate('/seller/new')}>
                                    <FaPlusCircle className="me-1" /> Add
                                </Button>
                                <Button variant="outline-secondary" size="md" className="me-2" onClick={() => navigate('/seller/orders')}>
                                    <FaShoppingBag className="me-1" /> Orders
                                </Button>
                                <Button variant="outline-secondary" size="md" className="me-2" onClick={() => navigate('/seller/status')}>
                                    <FaUser className="me-1" /> Dashboard
                                </Button>
                                <Button variant="outline-danger" size="md" className="me-2" onClick={handleLogout}>
                                    <FaSignOutAlt className="me-1" /> Logout
                                </Button>
                                <Button variant="warning" className="px-4 ms-2" onClick={toggleSellerMode}>
                                    <FaExchangeAlt className="me-1" /> Buyer View
                                </Button>
                            </>
                        )}
                    </Nav>
                </Container>
            </Navbar>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <>
                    <div className="sidebar open">
                        <div className="sidebar-header">
                            <div
                                className="sidebar-title kalamart-logo"
                                onClick={() => {
                                    navigate('/');        // optional: clicking logo navigates home
                                    setSidebarOpen(false);
                                }}
                            >
                                KalaMart
                            </div>
                            <span className="close-btn" onClick={() => setSidebarOpen(false)}>
                                ×
                            </span>
                        </div>

                        <div className="sidebar-section">
                            <div className="sidebar-heading">Shop Categories</div>
                            <ul className="sidebar-list">
                                {sidebarItemsFlat.slice(0, 4).map((item, idx) => (
                                    <li key={idx} className="sidebar-item">
                                        <Link
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            style={{
                                                textDecoration: 'none',
                                                color: '#333',
                                                fontWeight: 500,
                                                display: 'block',
                                                padding: '8px 0'
                                            }}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <hr className="sidebar-divider" />

                        <div className="sidebar-section">
                            <div className="sidebar-heading">Account &amp; Info</div>
                            <ul className="sidebar-list">
                                {sidebarItemsFlat.slice(4,7).map((item, idx) => (
                                    <li key={idx} className="sidebar-item">
                                        <Link
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            style={{
                                                textDecoration: 'none',
                                                color: '#333',
                                                fontWeight: 500,
                                                display: 'block',
                                                padding: '8px 0'
                                            }}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}

                            </ul>
                        </div>
                        <hr className="sidebar-divider" />
                        <div className="sidebar-section">
                            <div className="sidebar-heading">Support</div>
                            <ul className="sidebar-list">
                                {sidebarItemsFlat.slice(7).map((item, idx) => (
                                    <li key={idx} className="sidebar-item">
                                        <Link
                                            to={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            style={{
                                                textDecoration: 'none',
                                                color: '#333',
                                                fontWeight: 500,
                                                display: 'block',
                                                padding: '8px 0'
                                            }}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <div className="overlay" onClick={() => setSidebarOpen(false)} />
                </>
            )}
        </>
    );
}
