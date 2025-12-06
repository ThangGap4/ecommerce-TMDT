import React from "react";
import { Link } from "react-router-dom";
import Cart from "../cart/Cart";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../LanguageSwitcher";

export default function SubNav() {
  const { user, isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <nav id="sub-nav">
      <ul>
        {!isLoggedIn ? (
          <>
            <li>
              <Link to="/register">{t("nav.register")}</Link>
            </li>
            <li>{t("general.free_shipping")}</li>
            <div className="flex gap-4 items-center">
              <li>
                <Link to="/login">{t("nav.login")}</Link>
              </li>
              <LanguageSwitcher />
              <Cart />
            </div>
          </>
        ) : (
          <>
            <li>
              <Link to="/profile" style={{ textDecoration: "none", color: "inherit" }}>
                {t("nav.welcome")}, {user?.first_name || user?.email}
              </Link>
            </li>
            <li>{t("general.free_shipping")}</li>
            <div className="flex gap-4 items-center">
              {user?.role === "admin" && (
                <li>
                  <Link to="/admin">{t("nav.admin")}</Link>
                </li>
              )}
              <li>
                <Link to="/profile">{t("nav.account")}</Link>
              </li>
              <li>
                <button onClick={logout} style={{ cursor: "pointer", background: "none", border: "none", color: "inherit" }}>
                  {t("nav.logout")}
                </button>
              </li>
              <LanguageSwitcher />
              <Cart />
            </div>
          </>
        )}
      </ul>
    </nav>
  );
}
