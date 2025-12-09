import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";
import { Link } from "react-router-dom";

interface CategoryBanner {
  id: number;
  name: string;
  imageUrl: string;
  link: string;
  bgColor?: string;
}

const defaultCategories: CategoryBanner[] = [
  {
    id: 1,
    name: "Tops",
    imageUrl: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=300&h=200&fit=crop",
    link: "/products?type=Tops",
    bgColor: "#e3f2fd",
  },
  {
    id: 2,
    name: "Bottoms",
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=300&h=200&fit=crop",
    link: "/products?type=Bottoms",
    bgColor: "#fce4ec",
  },
  {
    id: 3,
    name: "Shoes",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
    link: "/products?type=Shoes",
    bgColor: "#fff3e0",
  },
  {
    id: 4,
    name: "Accessories",
    imageUrl: "https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=300&h=200&fit=crop",
    link: "/products?type=Accessories",
    bgColor: "#e8f5e9",
  },
  {
    id: 5,
    name: "New Arrivals",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
    link: "/products?sort=newest",
    bgColor: "#f3e5f5",
  },
  {
    id: 6,
    name: "Sale",
    imageUrl: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=300&h=200&fit=crop",
    link: "/products?sale=true",
    bgColor: "#ffebee",
  },
];

interface CategoryBannersProps {
  categories?: CategoryBanner[];
}

export default function CategoryBanners({
  categories = defaultCategories,
}: CategoryBannersProps) {
  return (
    <Paper sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: { xs: 1, sm: 2 } }}>
      <Typography sx={{ mb: { xs: 1.5, sm: 2 }, fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
        Shop by Category
      </Typography>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {categories.map((category) => (
          <Grid item key={category.id} xs={4} sm={4} md={4}>
            <Box
              component={Link}
              to={category.link}
              sx={{
                display: "block",
                textDecoration: "none",
                borderRadius: { xs: 1, sm: 2 },
                overflow: "hidden",
                bgcolor: category.bgColor || "#f5f5f5",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  paddingTop: { xs: "80%", sm: "70%" },
                  overflow: "hidden",
                }}
              >
                <Box
                  component="img"
                  src={category.imageUrl}
                  alt={category.name}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>
              <Box sx={{ p: { xs: 0.75, sm: 1.5 }, textAlign: "center" }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: "#333",
                    fontSize: { xs: "0.7rem", sm: "0.95rem" },
                  }}
                >
                  {category.name}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
