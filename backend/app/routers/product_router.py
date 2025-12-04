from typing import Optional
from fastapi import APIRouter, FastAPI, HTTPException, Query, Path, UploadFile, File
from fastapi.responses import JSONResponse
from app.schemas.product_schemas import ProductBase, ProductCreate, ProductResponse
from app.models.sqlalchemy import Product
from app.services.product_service import Product_Service
from app.services.cloudinary_service import CloudinaryService

product_router = APIRouter()

@product_router.get("/products")
def read_products(
    page: int = Query(0, ge=0, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category name"),
    product_type: Optional[str] = Query(None, description="Filter by product type (Tops, Bottoms, Shoes, etc.)"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search by product name or description")
):
    """Get products with optional filters"""
    return Product_Service.get_products(
        page=page,
        limit=limit,
        category=category,
        product_type=product_type,
        min_price=min_price,
        max_price=max_price,
        search=search
    )

@product_router.get("/products/{product_slug}", response_model=ProductBase)
def read_product(product_slug: str):
    return Product_Service.get_product(product_slug)

@product_router.post("/products", response_model=dict)
def create_product(product: ProductCreate):
    """Create a new product"""
    return Product_Service.create_product(product)

@product_router.post("/upload-image")
async def upload_product_image(file: UploadFile = File(...)):
    """Upload product image to Cloudinary"""
    result = CloudinaryService.upload_image(file, folder="products")
    return result

@product_router.post("/product/{product_slug}/cart")
def add_product_to_cart(product_slug: str):
    #Implement product/cart logic
    return {"message": "Product added to cart", "product_id": product_id}

@product_router.post("/product/{product_slug}/review")
def post_review_product(product_slug: str):
    #Implement product/review logic
    return {"message": "Review posted", "product_id": product_id}
