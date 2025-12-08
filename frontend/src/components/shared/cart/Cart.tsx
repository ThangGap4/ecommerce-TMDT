import React from "react";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function Cart() {
  const { isLoggedIn } = useAuth();

  return (
    <Link
      to={isLoggedIn ? "/cart" : "/login"}
      className="hover:opacity-70 flex items-center"
    >
      <ShoppingBagOutlinedIcon />
    </Link>
  );
}
