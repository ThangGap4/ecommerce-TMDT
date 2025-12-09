import React from "react";
import { Link } from "react-router-dom";
import Cart from "../cart/Cart";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Person } from "@mui/icons-material";

export default function SubNav() {
  const { user, isLoggedIn } = useAuth();
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
              <Cart />
            </div>
          </>
        ) : (
          <>
            <li>{t("general.free_shipping")}</li>
            <div className="flex gap-4 items-center">
              {user?.role === "admin" && (
                <li>
                  <Link to="/admin">{t("nav.admin")}</Link>
                </li>
              )}
              <li>
                <Link to="/profile" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Person sx={{ fontSize: 18 }} />
                  {user?.first_name || user?.email?.split("@")[0]}
                </Link>
              </li>
              <Cart />
            </div>
          </>
        )}
      </ul>
    </nav>
  );
}
