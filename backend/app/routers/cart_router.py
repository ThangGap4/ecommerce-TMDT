from fastapi import APIRouter, Depends
from app.schemas.cart_schemas import CartBase, AddToCartRequest, UpdateCartItemRequest
from app.services.cart_service import CartService
from app.services.user_service import require_user
from app.models.sqlalchemy.user import User

cart_router = APIRouter()


@cart_router.get("/cart", response_model=CartBase)
def get_user_cart(current_user: User = Depends(require_user)):
    """Get current user's cart"""
    return CartService.get_cart(str(current_user.uuid))


@cart_router.post("/cart", response_model=CartBase)
def add_to_cart(request: AddToCartRequest, current_user: User = Depends(require_user)):
    """Add item to current user's cart"""
    return CartService.add_to_cart(str(current_user.uuid), request)


@cart_router.put("/cart/{cart_item_id}", response_model=CartBase)
def update_cart_item(
    cart_item_id: int,
    request: UpdateCartItemRequest,
    current_user: User = Depends(require_user)
):
    """Update quantity of a cart item"""
    return CartService.update_cart_item(str(current_user.uuid), cart_item_id, request.quantity)


@cart_router.delete("/cart/{cart_item_id}", response_model=CartBase)
def remove_from_cart(cart_item_id: int, current_user: User = Depends(require_user)):
    """Remove item from cart"""
    return CartService.remove_from_cart(str(current_user.uuid), cart_item_id)


@cart_router.delete("/cart", response_model=CartBase)
def clear_cart(current_user: User = Depends(require_user)):
    """Clear all items from cart"""
    return CartService.clear_cart(str(current_user.uuid))
