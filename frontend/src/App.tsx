import React, { useState, createContext } from "react";
import "./App.css";

import Navigation from "./components/shared/navigation/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//Page Imports
import Home from "./pages/home/Home";
import Products from "./pages/product/Products";
import ProductPage from "./pages/product/ProductPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AddProduct from "./pages/admin/AddProduct";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import Profile from "./pages/profile/Profile";
import { ICartContext, ICartItem } from './types/CartTypes';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

export const CartContext = createContext<ICartContext>({
  cart: [],
  setCart: () => {}  // Placeholder function
});

function App() {
  const [cart, setCart] = useState<ICartItem[]>([]);
  return (
    <div className="App">
      <AuthProvider>
        <CartContext.Provider value={{cart, setCart}}>
          <BrowserRouter>
            <Navigation />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
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
            </Routes>
          </BrowserRouter>
        </CartContext.Provider>
      </AuthProvider>
    </div>
  );
}

export default App;
