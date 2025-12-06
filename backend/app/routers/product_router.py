from typing import Optional
from fastapi import APIRouter, FastAPI, HTTPException, Query, Path, UploadFile, File, Depends
from fastapi.responses import JSONResponse
from app.schemas.product_schemas import ProductBase, ProductCreate, ProductResponse, ProductUpdate
from app.models.sqlalchemy import Product
from app.services.product_service import Product_Service
from app.services.cloudinary_service import CloudinaryService
from app.services.user_service import require_admin
from app.i18n_keys import I18nKeys

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
def create_product(product: ProductCreate, current_user = Depends(require_admin)):
    """Create a new product (admin only)"""
    return Product_Service.create_product(product)


@product_router.put("/products/{product_slug}", response_model=dict)
def update_product(product_slug: str, product: ProductUpdate, current_user = Depends(require_admin)):
    """Update a product (admin only)"""
    return Product_Service.update_product(product_slug, product.dict(exclude_unset=True))


@product_router.delete("/products/{product_slug}")
def delete_product(product_slug: str, current_user = Depends(require_admin)):
    """Delete a product (admin only)"""
    Product_Service.delete_product(product_slug)
    return {"message": I18nKeys.PRODUCT_DELETED}


@product_router.post("/upload-image")
async def upload_product_image(file: UploadFile = File(...)):
    """Upload product image to Cloudinary"""
    result = CloudinaryService.upload_image(file, folder="products")
    return result

@product_router.post("/product/{product_slug}/cart")
def add_product_to_cart(product_slug: str):
    #Implement product/cart logic
    return {"message": I18nKeys.PRODUCT_ADDED_TO_CART, "product_slug": product_slug}

@product_router.post("/product/{product_slug}/review")
def post_review_product(product_slug: str):
    #Implement product/review logic
    return {"message": I18nKeys.REVIEW_POSTED, "product_slug": product_slug}
