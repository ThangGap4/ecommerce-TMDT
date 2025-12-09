import React, { useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function MainNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Trang chu", href: "/" },
    { label: "San pham", href: "/products" },
    { label: "Ao", href: "/products?type=Tops" },
    { label: "Quan", href: "/products?type=Bottoms" },
    { label: "Giay", href: "/products?type=Shoes" },
    { label: "Giam gia", href: "/products?sale=true" },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile Drawer content
  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <Box
          component="img"
          src="/logo-ltk.png"
          alt="LTK"
          sx={{ height: 40 }}
        />
        <IconButton onClick={handleDrawerToggle} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton
              component={Link}
              to={link.href}
              onClick={handleDrawerToggle}
              sx={{
                py: 1.5,
                "&:hover": {
                  bgcolor: "rgba(102, 126, 234, 0.1)",
                  color: "#667eea",
                },
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile hamburger button - fixed position */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1200,
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            bgcolor: "#667eea",
            color: "white",
            width: 56,
            height: 56,
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.5)",
            "&:hover": { bgcolor: "#5a6fd6" },
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Navigation */}
      <nav id="main-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
