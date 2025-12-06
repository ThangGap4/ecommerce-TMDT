import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea, Box, Chip } from "@mui/material";
import { getImageUrl } from "../../../../utils/imageUtils";

export default function ProductCard({ product }: any) {
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : 0;

  return (
    <Card
      sx={{
        maxWidth: 280,
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        border: "1px solid #eee",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <CardActionArea href={`/products/${product.slug}`}>
        {/* Image Container */}
        <Box sx={{ position: "relative", overflow: "hidden" }}>
          <CardMedia
            component="img"
            sx={{
              height: 220,
              objectFit: "cover",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
              },
            }}
            image={getImageUrl(product.image_url)}
            alt={product.product_name}
          />
          {/* Discount Badge */}
          {hasDiscount && (
            <Chip
              label={`-${discountPercent}%`}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                backgroundColor: "#e94560",
                color: "white",
                fontWeight: 600,
                fontSize: "12px",
              }}
            />
          )}
        </Box>

        <CardContent sx={{ p: 2 }}>
          {/* Product Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              fontSize: "15px",
              lineHeight: 1.4,
              height: "42px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1,
            }}
          >
            {product.product_name}
          </Typography>

          {/* Blurb */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: "13px",
              height: "40px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              mb: 1.5,
            }}
          >
            {product.blurb || "No description"}
          </Typography>

          {/* Price Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {hasDiscount ? (
              <>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "18px",
                    color: "#e94560",
                  }}
                >
                  ${product.sale_price}
                </Typography>
                <Typography
                  sx={{
                    textDecoration: "line-through",
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  ${product.price}
                </Typography>
              </>
            ) : (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: "#1a1a2e",
                }}
              >
                ${product.price}
              </Typography>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
