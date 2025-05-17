import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NavbarComponent from './components/NavbarComponent';
import SellerProductList from './pages/seller/SellerProductList';
import SellerProductForm from './pages/seller/SellerProductForm';

function App() {
    return (
        <>
            {/* Navbar remains global */}
            <NavbarComponent />

            <main className="p-4">
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductListing />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* Seller Panel routes */}
                    <Route path="/seller" element={<SellerProductList />} />
                    <Route path="/seller/new" element={<SellerProductForm />} />
                    <Route path="/seller/:id/edit" element={<SellerProductForm />} />

                    {/* Optional 404 fallback */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Routes>
            </main>
        </>
    );
}

export default App;
