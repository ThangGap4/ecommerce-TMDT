import React from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { getProductList } from "../../services/Product";
import ProductCard from "../../components/ui/cards/ProductCard/ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const response = await getProductList({ page: 0, limit: 4 });
      setFeaturedProducts(response || []);
      setLoading(false);
    };
    fetchFeaturedProducts();
  }, []);

  return (
    <main>
      {/* Hero Banner */}
      <section
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        }}
      >
        <div className="text-center text-white px-4">
          <Typography
            variant="h2"
            component="h1"
            className="font-bold mb-4"
            sx={{
              fontSize: { xs: "2rem", md: "3.5rem" },
              fontWeight: 700,
              marginBottom: "1rem",
            }}
          >
            Welcome to Our Store
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontSize: { xs: "1rem", md: "1.5rem" },
              marginBottom: "2rem",
              opacity: 0.9,
            }}
          >
            Discover the latest trends in fashion
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/products"
            sx={{
              backgroundColor: "#e94560",
              padding: "12px 40px",
              fontSize: "1.1rem",
              "&:hover": {
                backgroundColor: "#d63050",
              },
            }}
          >
            Shop Now
          </Button>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            className="text-center mb-8"
            sx={{
              fontWeight: 600,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Featured Products
          </Typography>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="flex flex-wrap gap-6 justify-center">
              {featuredProducts.map((product: any, index: number) => (
                <ProductCard key={product.id || index} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Typography variant="body1" color="text.secondary">
                No products available yet.
              </Typography>
            </div>
          )}

          <Box className="text-center mt-8">
            <Button
              variant="outlined"
              size="large"
              href="/products"
              sx={{
                padding: "10px 30px",
                borderColor: "#1a1a2e",
                color: "#1a1a2e",
                "&:hover": {
                  borderColor: "#e94560",
                  color: "#e94560",
                },
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-gray-100">
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 600,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Shop by Category
          </Typography>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["New Arrivals", "Tops", "Bottoms", "Shoes"].map((category) => (
              <a
                key={category}
                href={`/products?category=${category.toLowerCase().replace(" ", "-")}`}
                className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {category}
                </Typography>
              </a>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
