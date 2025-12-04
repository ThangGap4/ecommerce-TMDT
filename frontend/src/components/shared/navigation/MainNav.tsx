import React from "react";

export default function MainNav() {
  const navLinks = [
    {
      label: "Trang chu",
      href: "/",
    },
    {
      label: "San pham",
      href: "/products",
    },
    {
      label: "Ao",
      href: "/products?type=Tops",
    },
    {
      label: "Quan",
      href: "/products?type=Bottoms",
    },
    {
      label: "Giay",
      href: "/products?type=Shoes",
    },
    {
      label: "Giam gia",
      href: "/products?sale=true",
    },
  ];
  return (
    <nav id="main-nav">
      <ul>
        {navLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
