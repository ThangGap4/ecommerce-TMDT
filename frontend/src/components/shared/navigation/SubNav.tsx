import React from "react";
import Cart from "../cart/Cart";
import { useAuth } from "../../../context/AuthContext";

export default function SubNav() {
  const { user, isLoggedIn, logout } = useAuth();

  return (
    <nav id="sub-nav">
      <ul>
        {!isLoggedIn ? (
          <>
            <li>
              <a href="/register">Dang ky</a>
            </li>
            <li>Free Shipping on Orders Over US$ 100</li>
            <div className="flex gap-4">
              <li>
                <a href="/login">Dang nhap</a>
              </li>
              <Cart />
            </div>
          </>
        ) : (
          <>
            <li>
              Xin chao, {user?.first_name || user?.email}
            </li>
            <li>Free Shipping on Orders Over US$ 100</li>
            <div className="flex gap-4">
              {user?.role === "admin" && (
                <li>
                  <a href="/admin">Admin</a>
                </li>
              )}
              <li>
                <button onClick={logout} style={{ cursor: "pointer", background: "none", border: "none", color: "inherit" }}>
                  Dang xuat
                </button>
              </li>
              <Cart />
            </div>
          </>
        )}
      </ul>
    </nav>
  );
}
