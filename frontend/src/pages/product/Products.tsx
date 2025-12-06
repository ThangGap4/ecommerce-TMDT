import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

// Methods
import { getProductList, IProductFilters } from "../../services/Product";

// Components
import ProductCard from "../../components/ui/cards/ProductCard/ProductCard";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Skeleton,
  Typography,
  Chip,
  Slider,
  Drawer,
  IconButton,
  Divider,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Breadcrumbs,
  Link,
  Paper,
} from "@mui/material";
import {
  Search,
  FilterList,
  Close,
  GridView,
  ViewList,
  Sort,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const PRODUCT_TYPES = [
  { value: "", label: "product.filter.all_types" },
  { value: "Tops", label: "product.filter.tops" },
  { value: "Bottoms", label: "product.filter.bottoms" },
  { value: "Shoes", label: "product.filter.shoes" },
  { value: "Accessories", label: "product.filter.accessories" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "product.sort.newest" },
  { value: "price_asc", label: "product.sort.price_low" },
  { value: "price_desc", label: "product.sort.price_high" },
  { value: "popular", label: "product.sort.popular" },
];

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filter states
  const [search, setSearch] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000000]);
  const [sortBy, setSortBy] = useState<string>("newest");

  const fetchProducts = useCallback(async (filters: IProductFilters) => {
    setLoading(true);
    try {
      const response = await getProductList(filters);
      setProducts(response || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchProducts({ page: 0, limit: 20 });
  }, [fetchProducts]);

  const handleSearch = () => {
    const filters: IProductFilters = {
      page: 0,
      limit: 20,
      search: search || undefined,
      product_type: productType || undefined,
      min_price: priceRange[0] || undefined,
      max_price: priceRange[1] < 10000000 ? priceRange[1] : undefined,
    };
    fetchProducts(filters);
    setMobileFilterOpen(false);
  };

  const handleReset = () => {
    setSearch("");
    setProductType("");
    setPriceRange([0, 10000000]);
    setSortBy("newest");
    fetchProducts({ page: 0, limit: 20 });
  };

  const activeFiltersCount = [
    search,
    productType,
    priceRange[0] > 0 || priceRange[1] < 10000000,
  ].filter(Boolean).length;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Filter sidebar content
  const filterContent = (
    <Box sx={{ p: 3, width: { xs: 280, md: "100%" } }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          {t("product.filter.title")}
        </Typography>
        <IconButton 
          onClick={handleReset}
          size="small"
          sx={{ display: { md: "none" } }}
        >
          <Close />
        </IconButton>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
          {t("product.filter.search")}
        </Typography>
        <TextField
          fullWidth
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("product.filter.search_placeholder")}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Product Type */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          {t("product.filter.category")}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {PRODUCT_TYPES.map((type) => (
            <Chip
              key={type.value}
              label={t(type.label)}
              onClick={() => setProductType(type.value)}
              color={productType === type.value ? "primary" : "default"}
              variant={productType === type.value ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          {t("product.filter.price_range")}
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          valueLabelFormat={formatPrice}
          min={0}
          max={10000000}
          step={100000}
          sx={{ mx: 1 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {formatPrice(priceRange[0])}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatPrice(priceRange[1])}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSearch}
          sx={{ textTransform: "none" }}
        >
          {t("product.filter.apply")}
        </Button>
        <Button
          variant="outlined"
          fullWidth
          onClick={handleReset}
          sx={{ textTransform: "none" }}
        >
          {t("product.filter.reset")}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Breadcrumbs */}
      <Box sx={{ bgcolor: "white", py: 2 }}>
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
            <Typography color="text.primary">{t("nav.products")}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Box className="container mx-auto px-4 py-6">
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Desktop Sidebar Filter */}
          <Paper
            sx={{
              display: { xs: "none", md: "block" },
              width: 280,
              flexShrink: 0,
              alignSelf: "flex-start",
              position: "sticky",
              top: 20,
              borderRadius: 2,
              overflow: "hidden",
            }}
            elevation={0}
          >
            {filterContent}
          </Paper>

          {/* Main Content */}
          <Box sx={{ flex: 1 }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={0}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                <Box>
                  <Typography variant="h5" fontWeight={600}>
                    {productType ? t(`product.filter.${productType.toLowerCase()}`) : t("product.all_products")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {products.length} {t("product.items_found")}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={() => setMobileFilterOpen(true)}
                    sx={{ display: { md: "none" }, textTransform: "none" }}
                  >
                    {t("product.filter.title")}
                    {activeFiltersCount > 0 && (
                      <Chip
                        label={activeFiltersCount}
                        size="small"
                        color="primary"
                        sx={{ ml: 1, height: 20, minWidth: 20 }}
                      />
                    )}
                  </Button>

                  {/* Sort */}
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Sort fontSize="small" />
                        {t("product.sort.label")}
                      </Box>
                    </InputLabel>
                    <Select
                      value={sortBy}
                      label={t("product.sort.label")}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      {SORT_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.label)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* View Mode */}
                  <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, value) => value && setViewMode(value)}
                    size="small"
                  >
                    <ToggleButton value="grid">
                      <GridView fontSize="small" />
                    </ToggleButton>
                    <ToggleButton value="list">
                      <ViewList fontSize="small" />
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </Paper>

            {/* Active Filters */}
            {(search || productType || priceRange[0] > 0 || priceRange[1] < 10000000) && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {search && (
                  <Chip
                    label={`"${search}"`}
                    onDelete={() => setSearch("")}
                    size="small"
                  />
                )}
                {productType && (
                  <Chip
                    label={t(`product.filter.${productType.toLowerCase()}`)}
                    onDelete={() => setProductType("")}
                    size="small"
                  />
                )}
                {(priceRange[0] > 0 || priceRange[1] < 10000000) && (
                  <Chip
                    label={`${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                    onDelete={() => setPriceRange([0, 10000000])}
                    size="small"
                  />
                )}
                <Chip
                  label={t("product.filter.clear_all")}
                  onClick={handleReset}
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </Box>
            )}

            {/* Products Grid */}
            {loading ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 2,
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <Paper key={i} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Skeleton variant="rectangular" height={200} />
                    <Box sx={{ p: 2 }}>
                      <Skeleton variant="text" height={24} />
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  </Paper>
                ))}
              </Box>
            ) : products.length > 0 ? (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: viewMode === "grid" 
                    ? { xs: "repeat(2, 1fr)", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" }
                    : "1fr",
                  gap: 2,
                }}
              >
                {products.map((product, i) => (
                  <ProductCard key={product.id || i} product={product} />
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 8, textAlign: "center", borderRadius: 2 }} elevation={0}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    mx: "auto",
                    mb: 3,
                    borderRadius: "50%",
                    bgcolor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Search sx={{ fontSize: 40, color: "#bbb" }} />
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {t("product.no_products_found")}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {t("product.try_different_filters")}
                </Typography>
                <Button variant="contained" onClick={handleReset}>
                  {t("product.filter.reset")}
                </Button>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      >
        {filterContent}
      </Drawer>
    </Box>
  );
}
