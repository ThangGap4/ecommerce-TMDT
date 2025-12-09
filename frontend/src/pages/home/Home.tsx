import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Typography, Button, Skeleton } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

import { getProductList } from "../../services/Product";
import ProductCard from "../../components/ui/cards/ProductCard/ProductCard";
import SidebarCategories, { CategoryMenuButton } from "../../components/home/SidebarCategories";
import BannerSlider from "../../components/home/BannerSlider";
import FlashDeals from "../../components/home/FlashDeals";
import CategoryBanners from "../../components/home/CategoryBanners";
import ProductHighlightCarousel from "../../components/home/ProductHighlightCarousel";
import FeaturedPopupBanner from "../../components/home/FeaturedPopupBanner";

const features = [
  { icon: <LocalShippingIcon sx={{ fontSize: { xs: 24, sm: 32, md: 36 } }} />, title: "Free Shipping", desc: "On orders over $100" },
  { icon: <SupportAgentIcon sx={{ fontSize: { xs: 24, sm: 32, md: 36 } }} />, title: "24/7 Support", desc: "Dedicated support" },
  { icon: <PaymentIcon sx={{ fontSize: { xs: 24, sm: 32, md: 36 } }} />, title: "Secure Payment", desc: "100% secure payment" },
  { icon: <ShoppingBagIcon sx={{ fontSize: { xs: 24, sm: 32, md: 36 } }} />, title: "Easy Returns", desc: "30 days return policy" },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, arrivals] = await Promise.all([
          getProductList({ page: 0, limit: 12 }),
          getProductList({ page: 0, limit: 8 }),
        ]);
        setFeaturedProducts(featured || []);
        setNewArrivals(arrivals || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Box sx={{ bgcolor: "#f5f5fa", minHeight: "100vh" }}>
      <FeaturedPopupBanner
        title="Flash Sale"
        subtitle="Don't miss out on our biggest sale of the season!"
        discount="Up to 50% OFF"
        ctaLabel="Shop Sale"
        ctaHref="/products?sale=true"
      />

      <CategoryMenuButton onClick={() => setSidebarOpen(true)} />
      <SidebarCategories isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box sx={{ bgcolor: "white", borderBottom: "1px solid #eee", py: { xs: 1.5, sm: 2 } }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 1, sm: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 }, justifyContent: { xs: "center", md: "flex-start" } }}>
                  <Box sx={{ color: "#667eea" }}>{feature.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: "11px", sm: "13px" } }}>{feature.title}</Typography>
                    <Typography sx={{ fontSize: { xs: "9px", sm: "11px" }, color: "#666", display: { xs: "none", sm: "block" } }}>{feature.desc}</Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>
        <Box sx={{ display: "flex", gap: { xs: 0, md: 3 } }}>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <SidebarCategories />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Banner Slider - Tiki style */}
            <BannerSlider />

            {/* Flash Deals Section */}
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              {loading ? (
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
              ) : (
                <FlashDeals products={featuredProducts.slice(0, 8)} />
              )}
            </Box>

            {/* Category Banners Grid */}
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              <CategoryBanners />
            </Box>

            {/* New Arrivals Carousel */}
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              {loading ? (
                <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, overflow: "hidden" }}>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} variant="rectangular" width={250} height={300} sx={{ borderRadius: { xs: 1, sm: 2 }, flexShrink: 0 }} />
                  ))}
                </Box>
              ) : (
                <ProductHighlightCarousel title="New Arrivals" subtitle="Just dropped" products={newArrivals} />
              )}
            </Box>

            {/* Promo Banner */}
            <Box
              sx={{
                mt: { xs: 2, sm: 3 },
                p: { xs: 2, sm: 3 },
                borderRadius: { xs: 1, sm: 2 },
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                <Typography sx={{ color: "#ffd93d", fontSize: { xs: "10px", sm: "11px" }, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>
                  Limited Time Offer
                </Typography>
                <Typography sx={{ color: "white", fontWeight: 700, mb: 0.5, fontSize: { xs: "1.1rem", sm: "1.5rem" } }}>
                  Get 20% Off Your First Order
                </Typography>
                <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  Sign up now and receive exclusive discounts!
                </Typography>
              </Box>
              <Button
                variant="contained"
                href="/register"
                size="small"
                sx={{ bgcolor: "#e94560", px: { xs: 2.5, sm: 3 }, py: { xs: 0.75, sm: 1 }, fontWeight: 600, borderRadius: "50px", textTransform: "none", whiteSpace: "nowrap", fontSize: { xs: "0.8rem", sm: "0.875rem" }, "&:hover": { bgcolor: "#d63050" } }}
              >
                Sign Up Now
              </Button>
            </Box>

            {/* Featured Products */}
            <Box sx={{ mt: { xs: 2, sm: 3 } }}>
              <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                <Typography sx={{ color: "#667eea", fontSize: { xs: "10px", sm: "11px" }, fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", mb: 0.5 }}>
                  Our Collection
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                  Featured Products
                </Typography>
              </Box>

              {loading ? (
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {[...Array(8)].map((_, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Skeleton variant="rectangular" height={280} sx={{ borderRadius: { xs: 1, sm: 2 } }} />
                    </Grid>
                  ))}
                </Grid>
              ) : featuredProducts.length > 0 ? (
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  {featuredProducts.map((product, index) => (
                    <Grid item xs={6} sm={4} md={3} key={product.id || index}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
                  <Typography variant="body1" color="text.secondary">No products available yet.</Typography>
                </Box>
              )}

              <Box sx={{ textAlign: "center", mt: { xs: 2, sm: 4 } }}>
                <Button
                  variant="contained"
                  href="/products"
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    px: { xs: 4, sm: 6 },
                    py: { xs: 1, sm: 1.5 },
                    fontWeight: 600,
                    borderRadius: "50px",
                    textTransform: "none",
                    fontSize: { xs: "0.85rem", sm: "1rem" },
                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 8px 20px rgba(102,126,234,0.4)" },
                    transition: "all 0.3s ease",
                  }}
                >
                  View All Products
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: { xs: 2, sm: 4 } }}>
              {!loading && featuredProducts.length > 0 && (
                <ProductHighlightCarousel title="Best Sellers" subtitle="Top picks this week" products={featuredProducts.slice(0, 8)} />
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
