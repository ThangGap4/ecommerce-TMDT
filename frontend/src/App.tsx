import React from "react";
import "./App.css";

import Navigation from "./components/shared/navigation/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Page Imports
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductPage from "./pages/product/ProductPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AddProduct from "./pages/admin/AddProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Profile from "./pages/profile/Profile";
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import OrderSuccessPage from "./pages/checkout/OrderSuccessPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CurrencyProvider } from "./context/CurrencyContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <BrowserRouter>
              <Navigation />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:productID/" element={<ProductPage />} />
              
              {/* User routes - Protected */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <CartPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-success/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderSuccessPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderDetailPage />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-product"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <ChatWidget />
          </BrowserRouter>
        </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
