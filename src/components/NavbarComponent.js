import React, { useState, useEffect } from 'react';
import {
    Navbar, Form, FormControl, Button, Container
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import {
    FaBars, FaHeart, FaShoppingCart, FaUser,
    FaBell, FaHome, FaThList
} from 'react-icons/fa';

const dummyProducts = [
    'Handloom Saree', 'Clay Pot', 'Bamboo Basket', 'Wooden Toys',
    'Brass Lamp', 'Terracotta Plate', 'Ikat Fabric', 'Palm Leaf Art',
    'Dokra Figurine', 'Pochampally Dupatta', 'Nirmal Painting',
    'Bidriware Box', 'Lacquerware Bangles', 'Cherial Scroll',
    'Cotton Kurti', 'Brass Urli', 'Khadi Shirt', 'Terracotta Vase',
    'Handwoven Towel', 'Jute Bag'
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

    const handleSearchChange = e => {
        const input = e.target.value;
        setSearchTerm(input);
        setSuggestions(
            input.trim()
                ? dummyProducts.filter(item =>
                    item.toLowerCase().includes(input.toLowerCase())
                )
                : []
        );
    };

    const handleSubmit = e => {
        e.preventDefault();
        const q = searchTerm.trim();
        if (q) {
            navigate(`/products?q=${encodeURIComponent(q)}`);
        } else {
            navigate('/products');
        }
    };

    const handleSuggestionClick = item => {
        setSearchTerm(item);
        navigate(`/products?q=${encodeURIComponent(item)}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const handleStartSelling = () => {
        const token = localStorage.getItem('access');
        if (token) {
            navigate('/signup/seller');
        } else {
            navigate('/signup', { state: { next: '/signup/seller' } });
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm py-3 px-4 sticky-top">
                <Container fluid className="d-flex align-items-center justify-content-between">
                    <div className="hamburger-icon" onClick={() => setSidebarOpen(true)}>
                        <FaBars size={22} />
                    </div>
                    <Navbar.Brand href="/" className="fw-bold text-dark ms-2">
                        KalaMart
                    </Navbar.Brand>

                    <Form
                        onSubmit={handleSubmit}
                        className="d-flex align-items-center position-relative custom-search-form mx-auto"
                        style={{ flex: 1, maxWidth: '550px', margin: '0 20px' }}
                    >
                        <FormControl
                            type="search"
                            placeholder="Search for products..."
                            className="me-2 search-bar-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Button variant="warning" type="submit">Search</Button>

                        {suggestions.length > 0 && (
                            <ul className="dropdown-suggestions">
                                {suggestions.map((item, idx) => (
                                    <li key={idx} onClick={() => handleSuggestionClick(item)}>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Form>

                    <div className="navbar-icons d-flex align-items-center gap-3">
                        <div className="nav-item" onClick={() => navigate('/')}>
                            <FaHome title="Home" />
                        </div>
                        <div className="nav-item" onClick={() => navigate('/products')}>
                            <FaThList title="Products" />
                        </div>
                        <div className="nav-item" onClick={() => navigate('/cart')}>
                            <FaShoppingCart title="Cart" />
                        </div>
                        <div className="nav-item">
                            <FaBell title="Notifications" />
                        </div>
                        <div className="nav-item">
                            <FaHeart title="Wishlist" />
                        </div>

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

                    <Button variant="warning" onClick={handleStartSelling}>
                        Start Selling
                    </Button>
                </Container>
            </Navbar>

            {sidebarOpen && (
                <>
                    <div className="sidebar open">
                        <div className="sidebar-header">
                            <span className="close-btn" onClick={() => setSidebarOpen(false)}>
                                &times;
                            </span>
                        </div>
                        {sidebarItems.map((section, idx) => (
                            <div key={idx} className="sidebar-section">
                                <h5>{section.title}</h5>
                                <ul>
                                    {section.links.map((link, i) => (
                                        <li key={i}>{link}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="overlay" onClick={() => setSidebarOpen(false)} />
                </>
            )}
        </>
    );
}

export default NavbarComponent;
