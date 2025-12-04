import React, { useState, useEffect, useCallback } from "react";

//Methods
import { getProductList, IProductFilters } from "../../services/Product";

//Components
import ProductCard from "../../components/ui/cards/ProductCard/ProductCard";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

const PRODUCT_TYPES = [
  { value: "", label: "Tat ca" },
  { value: "Tops", label: "Ao" },
  { value: "Bottoms", label: "Quan" },
  { value: "Shoes", label: "Giay" },
  { value: "Accessories", label: "Phu kien" },
];

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter states
  const [search, setSearch] = useState<string>("");
  const [productType, setProductType] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const fetchProducts = useCallback(async (filters: IProductFilters) => {
    setLoading(true);
    try {
      const response = await getProductList(filters);
      setProducts(response || []);
    } catch (error) {
      console.error("Loi khi tai san pham:", error);
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
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
    };
    fetchProducts(filters);
  };

  const handleReset = () => {
    setSearch("");
    setProductType("");
    setMinPrice("");
    setMaxPrice("");
    fetchProducts({ page: 0, limit: 20 });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <section id="filters" className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Loc san pham</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Search */}
          <TextField
            label="Tim kiem"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nhap ten san pham..."
            fullWidth
          />

          {/* Product Type */}
          <FormControl size="small" fullWidth>
            <InputLabel>Loai san pham</InputLabel>
            <Select
              value={productType}
              label="Loai san pham"
              onChange={(e) => setProductType(e.target.value)}
            >
              {PRODUCT_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Min Price */}
          <TextField
            label="Gia tu"
            variant="outlined"
            size="small"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            fullWidth
          />

          {/* Max Price */}
          <TextField
            label="Gia den"
            variant="outlined"
            size="small"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="10000000"
            fullWidth
          />

          {/* Buttons */}
          <Box className="flex gap-2">
            <Button
              variant="contained"
              onClick={handleSearch}
              fullWidth
            >
              Loc
            </Button>
            <Button
              variant="outlined"
              onClick={handleReset}
              fullWidth
            >
              Xoa loc
            </Button>
          </Box>
        </div>
      </section>

      {/* Products Section */}
      <section id="product-info">
        {loading ? (
          <div className="flex justify-center py-12">
            <CircularProgress />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id || i} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Khong tim thay san pham nao
          </div>
        )}
      </section>
    </main>
  );
}
