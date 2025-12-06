import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { getProductInfo } from "../../services/Product";

import AddToCart from "../../components/ui/buttons/AddToCart/AddToCart";
import RadioProduct from "../../components/ui/buttons/RadioProduct/RadioProduct";

import {
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Skeleton,
  Rating,
  Divider,
  Chip,
  IconButton,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Avatar,
} from "@mui/material";
import {
  Home,
  FavoriteBorder,
  Share,
  LocalShipping,
  Verified,
  Loop,
  Security,
} from "@mui/icons-material";
import { getImageUrl } from "../../utils/imageUtils";

import { Product } from "../../types/types";

export default function ProductPage() {
  const { productID } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [productInfo, setProductInfo] = useState<Product>();
  const [color, setColor] = useState<string>("red");
  const [size, setSize] = useState<string>("s");
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [tabValue, setTabValue] = useState(0);

  // Mock multiple images
  const productImages = productInfo ? [productInfo.image_url, productInfo.image_url, productInfo.image_url] : [];

  React.useEffect(() => {
    const fetchProduct = async () => {
      if (productID) {
        const response = await getProductInfo(productID);
        const product = new Product(response);
        setProductInfo(product);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productID]);

  const discountPercent = productInfo?.sale_price
    ? Math.round(((productInfo.price - productInfo.sale_price) / productInfo.price) * 100)
    : 0;

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <Box sx={{ bgcolor: "white", py: 2, borderBottom: "1px solid #eee" }}>
        <Box className="container mx-auto px-4">
          <Breadcrumbs>
            <Link
              underline="hover"
              color="inherit"
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <Home sx={{ mr: 0.5 }} fontSize="small" />
              {t("nav.home")}
            </Link>
            <Link
              underline="hover"
              color="inherit"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/products")}
            >
              {t("nav.products")}
            </Link>
            {productInfo && (
              <Typography color="text.primary">{productInfo.product_name}</Typography>
            )}
          </Breadcrumbs>
        </Box>
      </Box>

      <Box className="container mx-auto px-4 py-6">
        {loading ? (
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ display: "flex", gap: 4, flexWrap: { xs: "wrap", md: "nowrap" } }}>
              <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2 }} />
                <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" height={40} width="80%" />
                <Skeleton variant="text" height={30} width="40%" />
                <Skeleton variant="text" height={50} width="30%" sx={{ my: 2 }} />
                <Skeleton variant="rectangular" height={100} />
              </Box>
            </Box>
          </Paper>
        ) : productInfo ? (
          <>
            {/* Main Product Section */}
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: "flex", gap: 4, flexWrap: { xs: "wrap", md: "nowrap" } }}>
                {/* Product Images */}
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "#f8f8f8",
                      mb: 2,
                    }}
                  >
                    <img
                      src={getImageUrl(productImages[selectedImage])}
                      alt={productInfo.product_name}
                      style={{
                        width: "100%",
                        height: "500px",
                        objectFit: "cover",
                      }}
                    />
                    {productInfo.sale_price && (
                      <Chip
                        label={`-${discountPercent}%`}
                        color="error"
                        sx={{
                          position: "absolute",
                          top: 16,
                          left: 16,
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "column", gap: 1 }}>
                      <IconButton sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" } }}>
                        <FavoriteBorder />
                      </IconButton>
                      <IconButton sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f5f5f5" } }}>
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>
                  {/* Thumbnail images */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {productImages.map((img, idx) => (
                      <Box
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: "hidden",
                          cursor: "pointer",
                          border: selectedImage === idx ? "2px solid #1976d2" : "2px solid transparent",
                          opacity: selectedImage === idx ? 1 : 0.6,
                          transition: "all 0.2s ease",
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${productInfo.product_name} ${idx + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Product Info */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" fontWeight={600} gutterBottom>
                    {productInfo.product_name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Rating value={4.5} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary">
                      (128 {t("review.title")})
                    </Typography>
                    <Chip
                      icon={<Verified sx={{ fontSize: 16 }} />}
                      label={t("product.in_stock")}
                      color="success"
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  {/* Price */}
                  <Box sx={{ mb: 3 }}>
                    {productInfo.sale_price ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Typography variant="h4" color="error" fontWeight={700}>
                          ${productInfo.sale_price}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{ textDecoration: "line-through", color: "#999" }}
                        >
                          ${productInfo.price}
                        </Typography>
                        <Chip
                          label={`Save $${(productInfo.price - productInfo.sale_price).toFixed(2)}`}
                          color="error"
                          size="small"
                        />
                      </Box>
                    ) : (
                      <Typography variant="h4" fontWeight={700}>
                        ${productInfo.price}
                      </Typography>
                    )}
                  </Box>

                  <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
                    {productInfo.blurb}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  {/* Color Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      {t("product.color")}: <span style={{ fontWeight: 400 }}>{color}</span>
                    </Typography>
                    <RadioProduct value={["Red", "Black", "Green", "White"]} setState={setColor} />
                  </Box>

                  {/* Size Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                      {t("product.size")}: <span style={{ fontWeight: 400 }}>{size.toUpperCase()}</span>
                    </Typography>
                    <RadioProduct value={["S", "M", "L", "XL"]} setState={setSize} />
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Add to Cart */}
                  <Box sx={{ mb: 3 }}>
                    <AddToCart product={productInfo} size={size} color={color} />
                  </Box>

                  {/* Trust badges */}
                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalShipping color="primary" />
                      <Typography variant="body2">{t("general.free_shipping")}</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Loop color="primary" />
                      <Typography variant="body2">30-Day Returns</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Security color="primary" />
                      <Typography variant="body2">Secure Payment</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>

            {/* Description & Reviews Tabs */}
            <Paper sx={{ borderRadius: 2 }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{ borderBottom: "1px solid #eee", px: 3 }}
              >
                <Tab label={t("product.description")} />
                <Tab label={`${t("review.title")} (128)`} />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {tabValue === 0 && (
                  <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    <br /><br />
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </Typography>
                )}

                {tabValue === 1 && (
                  <Box>
                    {/* Review Form */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {t("review.write_review")}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Typography>{t("review.rating")}:</Typography>
                        <Rating size="large" />
                      </Box>
                      <TextField
                        multiline
                        rows={4}
                        placeholder={t("review.comment")}
                        fullWidth
                        sx={{ mb: 2 }}
                      />
                      <Button variant="contained" sx={{ textTransform: "none" }}>
                        {t("common.submit")}
                      </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Mock Reviews */}
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Customer Reviews
                    </Typography>
                    {[1, 2, 3].map((review) => (
                      <Box key={review} sx={{ py: 2, borderBottom: "1px solid #eee" }}>
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Avatar>U</Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                              <Typography fontWeight={600}>User {review}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                2 days ago
                              </Typography>
                            </Box>
                            <Rating value={5} size="small" readOnly sx={{ mb: 1 }} />
                            <Typography color="text.secondary">
                              Great product! Exactly as described. Fast shipping and excellent quality.
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Paper>
          </>
        ) : (
          <Paper sx={{ p: 8, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              {t("product.not_found")}
            </Typography>
            <Button variant="contained" onClick={() => navigate("/products")}>
              {t("cart.continue_shopping")}
            </Button>
          </Paper>
        )}
      </Box>
    </Box>
  );
}
