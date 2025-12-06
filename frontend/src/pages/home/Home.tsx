import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography, Container, Box, Grid, Skeleton } from "@mui/material";
import { getProductList } from "../../services/Product";
import ProductCard from "../../components/ui/cards/ProductCard/ProductCard";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PaymentIcon from "@mui/icons-material/Payment";

// Category data với icons
const categories = [
  { name: "New Arrivals", icon: "new_releases", color: "#e94560" },
  { name: "Tops", icon: "checkroom", color: "#0f3460" },
  { name: "Bottoms", icon: "straighten", color: "#16213e" },
  { name: "Shoes", icon: "directions_run", color: "#1a1a2e" },
  { name: "Accessories", icon: "watch", color: "#533483" },
  { name: "Sale", icon: "local_offer", color: "#e94560" },
];

// Features section
const features = [
  { icon: <LocalShippingIcon sx={{ fontSize: 40 }} />, title: "Free Shipping", desc: "On orders over $100" },
  { icon: <SupportAgentIcon sx={{ fontSize: 40 }} />, title: "24/7 Support", desc: "Dedicated support" },
  { icon: <PaymentIcon sx={{ fontSize: 40 }} />, title: "Secure Payment", desc: "100% secure payment" },
  { icon: <ShoppingBagIcon sx={{ fontSize: 40 }} />, title: "Easy Returns", desc: "30 days return policy" },
];

export default function Home() {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const response = await getProductList({ page: 0, limit: 8 });
      setFeaturedProducts(response || []);
      setLoading(false);
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <main>
      {/* Hero Banner - Modern Gradient with Pattern */}
      <section
        className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <Container maxWidth="lg" className="relative z-10">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "14px",
                    fontWeight: 600,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    mb: 2,
                  }}
                >
                  New Collection 2024
                </Typography>
                <Typography
                  variant="h1"
                  sx={{
                    color: "white",
                    fontSize: { xs: "2.5rem", md: "4rem" },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Discover Your
                  <br />
                  <span style={{ color: "#ffd93d" }}>Perfect Style</span>
                </Typography>
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: { xs: "1rem", md: "1.25rem" },
                    mb: 4,
                    maxWidth: "500px",
                    mx: { xs: "auto", md: 0 },
                  }}
                >
                  Explore our curated collection of premium fashion items. 
                  Quality meets style at unbeatable prices.
                </Typography>
                <Box sx={{ display: "flex", gap: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
                  <Button
                    variant="contained"
                    size="large"
                    href="/products"
                    sx={{
                      backgroundColor: "#ffd93d",
                      color: "#1a1a2e",
                      padding: "14px 36px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "50px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#ffcd00",
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 20px rgba(255,217,61,0.4)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    Shop Now
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    href="/products?category=new-arrivals"
                    sx={{
                      borderColor: "white",
                      color: "white",
                      padding: "14px 36px",
                      fontSize: "1rem",
                      fontWeight: 600,
                      borderRadius: "50px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                        borderColor: "white",
                      },
                    }}
                  >
                    New Arrivals
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Features Bar */}
      <section className="py-6 bg-white border-b">
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box sx={{ color: "#667eea" }}>{feature.icon}</Box>
                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "14px" }}>
                      {feature.title}
                    </Typography>
                    <Typography sx={{ fontSize: "12px", color: "#666" }}>
                      {feature.desc}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              sx={{
                color: "#667eea",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Categories
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
              }}
            >
              Shop by Category
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={4} md={2} key={index}>
                <a
                  href={`/products?product_type=${category.name.toLowerCase().replace(" ", "-")}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    sx={{
                      p: 3,
                      backgroundColor: "white",
                      borderRadius: "16px",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      border: "1px solid #eee",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                        borderColor: category.color,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "50%",
                        backgroundColor: `${category.color}15`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                      }}
                    >
                      <ShoppingBagIcon sx={{ fontSize: 28, color: category.color }} />
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1a1a2e",
                      }}
                    >
                      {category.name}
                    </Typography>
                  </Box>
                </a>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              sx={{
                color: "#667eea",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Best Sellers
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
              }}
            >
              Featured Products
            </Typography>
          </Box>

          {loading ? (
            <Grid container spacing={3}>
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="text" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="60%" />
                </Grid>
              ))}
            </Grid>
          ) : featuredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {featuredProducts.map((product: any, index: number) => (
                <Grid item xs={6} sm={4} md={3} key={product.id || index}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="body1" color="text.secondary">
                No products available yet.
              </Typography>
            </Box>
          )}

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              size="large"
              href="/products"
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "14px 48px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(102,126,234,0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </section>

      {/* Promo Banner */}
      <section
        className="py-20"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                color: "#ffd93d",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              Limited Time Offer
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "white",
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 700,
                mb: 2,
              }}
            >
              Get 20% Off Your First Order
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "1.1rem",
                mb: 4,
              }}
            >
              Sign up now and receive exclusive discounts and offers!
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="/register"
              sx={{
                backgroundColor: "#e94560",
                padding: "14px 48px",
                fontSize: "1rem",
                fontWeight: 600,
                borderRadius: "50px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#d63050",
                },
              }}
            >
              Sign Up Now
            </Button>
          </Box>
        </Container>
      </section>
    </main>
  );
}
