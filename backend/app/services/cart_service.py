from typing import Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import joinedload

from app.models.sqlalchemy.cart import Cart, Cart_Item
from app.models.sqlalchemy.product import Product, ProductSize
from app.models.sqlalchemy.user import User
from app.schemas.cart_schemas import CartBase, CartItemBase, AddToCartRequest
from app.db import get_db_session
from app.i18n_keys import I18nKeys


class CartService:
    @staticmethod
    def get_or_create_cart(user_id: str) -> Cart:
        """Get existing cart or create new one for user"""
        db = get_db_session()
        try:
            cart = db.query(Cart).filter(Cart.user_id == user_id).first()
            if not cart:
                cart = Cart(user_id=user_id)
                db.add(cart)
                db.commit()
                db.refresh(cart)
            return cart
        finally:
            db.close()

    @staticmethod
    def get_cart(user_id: str) -> CartBase:
        """Get user's cart with all items"""
        db = get_db_session()
        try:
            cart = db.query(Cart).options(
                joinedload(Cart.items).joinedload(Cart_Item.product_size).joinedload(ProductSize.product)
            ).filter(Cart.user_id == user_id).first()

            if not cart:
                # Create empty cart
                cart = Cart(user_id=user_id)
                db.add(cart)
                db.commit()
                db.refresh(cart)
                return CartBase(
                    id=cart.id,
                    user_id=str(cart.user_id),
                    items=[],
                    subtotal=0.0,
                    total=0.0
                )

            # Build response
            items = []
            subtotal = 0.0
            
            for item in cart.items or []:
                product = item.product_size.product if item.product_size else None
                unit_price = product.sale_price or product.price if product else item.price
                total_price = unit_price * item.quantity
                subtotal += total_price
                
                items.append(CartItemBase(
                    id=item.id,
                    product_id=item.product_id,
                    product_name=product.product_name if product else None,
                    product_image=product.image_url if product else None,
                    product_slug=product.slug if product else None,
                    product_size=item.product_size.size if item.product_size else "",
                    quantity=item.quantity,
                    unit_price=unit_price,
                    total_price=total_price
                ))

            return CartBase(
                id=cart.id,
                user_id=str(cart.user_id),
                items=items,
                subtotal=subtotal,
                total=subtotal  # Can add shipping/discount later
            )
        finally:
            db.close()

    @staticmethod
    def add_to_cart(user_id: str, request: AddToCartRequest) -> CartBase:
        """Add item to cart"""
        db = get_db_session()
        try:
            # Get or create cart
            cart = db.query(Cart).filter(Cart.user_id == user_id).first()
            if not cart:
                cart = Cart(user_id=user_id)
                db.add(cart)
                db.commit()
                db.refresh(cart)

            # Find product and size
            product = db.query(Product).filter(Product.id == request.product_id).first()
            if not product:
                raise HTTPException(status_code=404, detail=I18nKeys.PRODUCT_NOT_FOUND)

            product_size = db.query(ProductSize).filter(
                ProductSize.product_id == request.product_id,
                ProductSize.size == request.size
            ).first()

            if not product_size:
                # Create size if not exists (for products without explicit sizes)
                product_size = ProductSize(
                    product_id=request.product_id,
                    size=request.size,
                    stock_quantity=100
                )
                db.add(product_size)
                db.commit()
                db.refresh(product_size)

            # Check if item already in cart
            existing_item = db.query(Cart_Item).filter(
                Cart_Item.cart_id == cart.id,
                Cart_Item.product_id == request.product_id,
                Cart_Item.product_size_id == product_size.size_id
            ).first()

            unit_price = product.sale_price or product.price

            if existing_item:
                existing_item.quantity += request.quantity
                existing_item.price = unit_price
            else:
                new_item = Cart_Item(
                    cart_id=cart.id,
                    product_id=request.product_id,
                    product_size_id=product_size.size_id,
                    quantity=request.quantity,
                    price=unit_price
                )
                db.add(new_item)

            db.commit()
            return CartService.get_cart(user_id)
        finally:
            db.close()

    @staticmethod
    def update_cart_item(user_id: str, cart_item_id: int, quantity: int) -> CartBase:
        """Update quantity of cart item"""
        db = get_db_session()
        try:
            cart = db.query(Cart).filter(Cart.user_id == user_id).first()
            if not cart:
                raise HTTPException(status_code=404, detail=I18nKeys.CART_EMPTY)

            cart_item = db.query(Cart_Item).filter(
                Cart_Item.id == cart_item_id,
                Cart_Item.cart_id == cart.id
            ).first()

            if not cart_item:
                raise HTTPException(status_code=404, detail=I18nKeys.CART_ITEM_NOT_FOUND)

            cart_item.quantity = quantity
            db.commit()
            return CartService.get_cart(user_id)
        finally:
            db.close()

    @staticmethod
    def remove_from_cart(user_id: str, cart_item_id: int) -> CartBase:
        """Remove item from cart"""
        db = get_db_session()
        try:
            cart = db.query(Cart).filter(Cart.user_id == user_id).first()
            if not cart:
                raise HTTPException(status_code=404, detail=I18nKeys.CART_EMPTY)

            cart_item = db.query(Cart_Item).filter(
                Cart_Item.id == cart_item_id,
                Cart_Item.cart_id == cart.id
            ).first()

            if not cart_item:
                raise HTTPException(status_code=404, detail=I18nKeys.CART_ITEM_NOT_FOUND)

            db.delete(cart_item)
            db.commit()
            return CartService.get_cart(user_id)
        finally:
            db.close()

    @staticmethod
    def clear_cart(user_id: str) -> CartBase:
        """Remove all items from cart"""
        db = get_db_session()
        try:
            cart = db.query(Cart).filter(Cart.user_id == user_id).first()
            if cart:
                db.query(Cart_Item).filter(Cart_Item.cart_id == cart.id).delete()
                db.commit()
            return CartService.get_cart(user_id)
        finally:
            db.close()
