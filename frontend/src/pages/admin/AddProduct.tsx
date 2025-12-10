import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { uploadProductImage, createProduct, ICreateProduct } from "../../services/Product";

const PRODUCT_TYPES = ["Tops", "Bottoms", "Shoes", "New Arrivals", "Sale"];

export default function AddProduct() {
  const [formData, setFormData] = useState<ICreateProduct>({
    slug: "",
    product_type: "",
    product_name: "",
    price: 0,
    stock: 0,
    blurb: "",
    description: "",
    image_url: "",
    sale_price: undefined,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "sale_price", "stock"].includes(name) ? Number(value) : value,
    }));
  };

  const handleTypeChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      product_type: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setUploading(true);
    setError("");

    const result = await uploadProductImage(imageFile);
    
    if (result && result.url) {
      setFormData((prev) => ({
        ...prev,
        image_url: result.url,
      }));
      setSuccess(false);
    } else {
      setError("Failed to upload image");
    }

    setUploading(false);
  };

  const generateSlug = () => {
    const slug = formData.product_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      + "-" + Date.now();
    
    setFormData((prev) => ({
      ...prev,
      slug: slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    // Validate required fields
    if (!formData.slug || !formData.product_name || !formData.product_type || !formData.price) {
      setError("Please fill in all required fields");
      setSubmitting(false);
      return;
    }

    const result = await createProduct(formData);

    if (result) {
      setSuccess(true);
      // Reset form
      setFormData({
        slug: "",
        product_type: "",
        product_name: "",
        price: 0,
        stock: 0,
        blurb: "",
        description: "",
        image_url: "",
        sale_price: undefined,
      });
      setImageFile(null);
      setImagePreview("");
    } else {
      setError("Failed to create product");
    }

    setSubmitting(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Add New Product
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Product created successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            {/* Product Name */}
            <TextField
              fullWidth
              label="Product Name *"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            {/* Slug */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Slug *"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                helperText="URL-friendly identifier"
              />
              <Button
                variant="outlined"
                onClick={generateSlug}
                sx={{ whiteSpace: "nowrap" }}
              >
                Auto Generate
              </Button>
            </Box>

            {/* Product Type */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Product Type *</InputLabel>
              <Select
                value={formData.product_type}
                label="Product Type *"
                onChange={handleTypeChange}
              >
                {PRODUCT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Price & Stock */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <TextField
                fullWidth
                label="Price *"
                name="price"
                type="number"
                value={formData.price || ""}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
              <TextField
                fullWidth
                label="Sale Price"
                name="sale_price"
                type="number"
                value={formData.sale_price || ""}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                helperText="Leave empty if no sale"
              />
              <TextField
                fullWidth
                label="Stock *"
                name="stock"
                type="number"
                value={formData.stock || ""}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 1 } }}
                helperText="Số lượng tồn kho ban đầu"
              />
            </Box>

            {/* Blurb */}
            <TextField
              fullWidth
              label="Short Description (Blurb)"
              name="blurb"
              value={formData.blurb}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
            />

            {/* Description */}
            <TextField
              fullWidth
              label="Full Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 3 }}
            />

            {/* Image Upload */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Product Image
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
                <Box>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginBottom: "8px" }}
                  />
                  
                  {imageFile && !formData.image_url && (
                    <Button
                      variant="contained"
                      onClick={handleUploadImage}
                      disabled={uploading}
                      sx={{ mt: 1 }}
                    >
                      {uploading ? <CircularProgress size={24} /> : "Upload Image"}
                    </Button>
                  )}
                </Box>

                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Preview"
                    sx={{
                      width: 150,
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 1,
                      border: "1px solid #ddd",
                    }}
                  />
                )}
              </Box>

              {formData.image_url && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Image uploaded: {formData.image_url.substring(0, 50)}...
                </Alert>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitting}
              sx={{
                py: 1.5,
                backgroundColor: "#1a1a2e",
                "&:hover": { backgroundColor: "#16213e" },
              }}
            >
              {submitting ? <CircularProgress size={24} /> : "Create Product"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
