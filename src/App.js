import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Seller pages
import SellerSignup from './pages/seller/SellerSignup';
import SellerProductList from './pages/seller/SellerProductList';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerStatus from './pages/seller/SellerStatus';

function App() {
    return (
        <>

        <div className="main-wrapper">
            <NavbarComponent />

            <main className="p-4">
                <Routes>

                    {/* Default route */}
                    <Route index element={<HomePage />} />

                    {/* Home */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />

                    {/* Products */}
                    <Route path="/products" element={<ProductListing />} />
                    <Route path="/products/:id" element={<ProductDetails />} />

                    {/* Cart & Checkout */}
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />

                    {/* Static */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Seller signup */}
                    <Route path="/signup/seller" element={<SellerSignup />} />
                    <Route path="/seller-panel/status" element={<SellerStatus />} />

                    {/* Seller panel */}
                    <Route path="/seller" element={<SellerProductList />} />
                    <Route path="/seller/new" element={<SellerProductForm />} />
                    <Route path="/seller/:id/edit" element={<SellerProductForm />} />

                    {/* Catch-all fallback to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            </div>
        </>
    );
}

export default App;                