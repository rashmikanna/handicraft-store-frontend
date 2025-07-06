import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductListing from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';
import CraftsPage from './components/CraftsPage';
import CraftDetail from './components/CraftDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import ExploreCollections from './pages/ExploreCollections';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sellers from './pages/Sellers'; 
import OrderHistory from './pages/OrderHistory';
import OrderSummary from './pages/OrderSummary'; 
import WishlistPage from './pages/WishlistPage';  
import HelpFAQ from './pages/HelpFAQ';
// Seller pages
import SellerSignup from './pages/seller/SellerSignup';
import SellerProductList from './pages/seller/SellerProductList';
import SellerProductForm from './pages/seller/SellerProductForm';
import SellerStatus from './pages/seller/SellerStatus';
import Verify from './pages/Verify';  
import SellerOrders from './pages/seller/SellerOrders';

function App() {
    return (
        <>

        <div className="main-wrapper">
            <NavbarComponent />
            <ScrollToTop />

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
                    <Route path="/crafts/:slug" element={<CraftDetail />} />                    {/* Cart & Checkout */}
                    <Route path="/crafts/:slug" element={<CraftDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders/history" element={<OrderHistory />} />
                    <Route path="/orders/:id" element={<OrderSummary />} />


                    {/* Static */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<HelpFAQ />} />
                    {/* Wishlist */}
                    <Route path="/wishlist" element={<WishlistPage />} />

                    {/* Auth */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    {/* New: Account verification */}
                    <Route path="/verify/:uidb64/:token" element={<Verify />} />

                    {/* Seller signup */}
                    <Route path="/signup/seller" element={<SellerSignup />} />
                    <Route path="/seller-panel/status" element={<SellerStatus />} />

                    {/* Seller panel */}
                    <Route path="/seller" element={<SellerProductList />} />
                    <Route path="/seller/new" element={<SellerProductForm />} />
                    <Route path="/seller/:id/edit" element={<SellerProductForm />} />

                    {/*Meet the Seller */}
                    <Route path="/sellers" element={<Sellers />} />

                    {/*Explore Collections */}
                    <Route path="/collections" element={<ExploreCollections />} />

                    
                    <Route path="/seller/orders" element={<SellerOrders />} />

                    {/* Catch-all fallback to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            </div>
        </>
    );}
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
