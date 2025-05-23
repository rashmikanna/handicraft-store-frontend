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
import SignUp from './pages/Signup';

function App() {
  return (
    <>
    <div className="main-wrapper">
      <NavbarComponent />
      <Routes>
        {/* Default route */}
        <Route index element={<HomePage />} />

        {/* Explicit routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Catch-all fallback to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
    </>
  );
}

export default App;
