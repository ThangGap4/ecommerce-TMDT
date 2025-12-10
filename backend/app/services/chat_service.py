"""
Chat Service - Intelligent AI Assistant for E-commerce
Enhanced with product search, recommendations, and contextual help
"""
import os
import json
from typing import List, Dict, Optional
from openai import OpenAI
from app.db import get_db_session
from app.models.sqlalchemy import Product
from sqlalchemy import or_, desc

# Load API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Enhanced system prompt with function calling
SYSTEM_PROMPT = """You are an intelligent shopping assistant for an e-commerce fashion store.

Your capabilities:
1. **Product Search** - Help customers find specific products
2. **Recommendations** - Suggest products based on preferences
3. **Order Support** - Answer questions about orders, shipping, returns
4. **Shopping Guidance** - Size advice, style tips, product comparisons

When customers ask about products:
- Search the catalog and recommend specific items
- Provide product details (name, price, description)
- Suggest alternatives or similar items
- Help with size and fit questions

Store Information:
- Free shipping on orders over $100
- 30-day return policy (unworn, tags attached)
- Payment: Credit cards, PayPal, Stripe
- Delivery: 3-7 business days
- Categories: Tops, Bottoms, Shoes, Accessories

Communication Style:
- Friendly and helpful
- Concise but informative
- Use emojis sparingly (👕 🛍️ ✨)
- Always provide actionable next steps"""


class ChatService:
    """Intelligent chat service with product search integration"""
    
    _client: OpenAI = None
    
    @classmethod
    def get_client(cls) -> OpenAI:
        """Get or create OpenAI client"""
        if cls._client is None:
            if not OPENAI_API_KEY:
                raise ValueError("OPENAI_API_KEY not configured")
            cls._client = OpenAI(api_key=OPENAI_API_KEY)
        return cls._client
    
    @classmethod
    def search_products(cls, query: str, category: str = None, limit: int = 5) -> List[Dict]:
        """
        Search products in database based on query
        
        Args:
            query: Search keywords
            category: Optional category filter
            limit: Max results
            
        Returns:
            List of product dicts with name, price, description, slug
        """
        db = get_db_session()
        try:
            products_query = db.query(Product)
            
            # Search in product name, description, blurb, and product_type
            if query:
                search_filter = or_(
                    Product.product_name.ilike(f"%{query}%"),
                    Product.description.ilike(f"%{query}%"),
                    Product.blurb.ilike(f"%{query}%"),
                    Product.product_type.ilike(f"%{query}%")
                )
                products_query = products_query.filter(search_filter)
            
            # Filter by category
            if category:
                products_query = products_query.filter(Product.product_type.ilike(f"%{category}%"))
            
            # Get results - order by id DESC (latest products first)
            products = products_query.order_by(desc(Product.id)).limit(limit).all()
            
            return [{
                "name": p.product_name,
                "price": float(p.sale_price or p.price),
                "original_price": float(p.price) if p.sale_price else None,
                "category": p.product_type,
                "description": p.blurb or p.description[:100] if p.description else "",
                "slug": p.slug,
                "stock": p.stock,
                "on_sale": bool(p.sale_price)
            } for p in products]
        except Exception as e:
            print(f"Product search error: {e}")
            return []
        finally:
            db.close()
    
    @classmethod
    def get_featured_products(cls, limit: int = 4) -> List[Dict]:
        """Get featured/popular products for recommendations"""
        db = get_db_session()
        try:
            # Get products with stock, order by id DESC (latest)
            products = db.query(Product).filter(
                Product.stock > 0
            ).order_by(desc(Product.id)).limit(limit).all()
            
            return [{
                "name": p.product_name,
                "price": float(p.sale_price or p.price),
                "original_price": float(p.price) if p.sale_price else None,
                "slug": p.slug,
                "category": p.product_type,
                "description": p.blurb or p.description[:100] if p.description else "",
                "stock": p.stock,
                "on_sale": bool(p.sale_price)
            } for p in products]
        except Exception as e:
            print(f"Featured products error: {e}")
            return []
        finally:
            db.close()
    
    @classmethod
    def detect_intent(cls, message: str) -> Dict[str, any]:
        """
        Detect user intent from message
        
        Returns:
            {
                "intent": "product_search|recommendations|order_help|general",
                "keywords": [...],
                "category": "..." or None
            }
        """
        message_lower = message.lower()
        
        # Product search intent
        product_keywords = ["looking for", "find", "search", "show me", "need", "want to buy"]
        if any(kw in message_lower for kw in product_keywords):
            # Extract category
            categories = ["tops", "bottoms", "shoes", "accessories", "dress", "shirt", "pants"]
            detected_category = next((cat for cat in categories if cat in message_lower), None)
            
            return {
                "intent": "product_search",
                "keywords": message_lower.split(),
                "category": detected_category
            }
        
        # Recommendations intent
        rec_keywords = ["recommend", "suggest", "what should", "best", "popular", "trending"]
        if any(kw in message_lower for kw in rec_keywords):
            return {
                "intent": "recommendations",
                "keywords": message_lower.split(),
                "category": None
            }
        
        # Order/shipping help
        order_keywords = ["order", "shipping", "delivery", "track", "return", "refund"]
        if any(kw in message_lower for kw in order_keywords):
            return {
                "intent": "order_help",
                "keywords": message_lower.split(),
                "category": None
            }
        
        return {
            "intent": "general",
            "keywords": [],
            "category": None
        }
    
    
    @classmethod
    def chat(cls, messages: List[Dict[str, str]], user_id: str = None) -> Dict[str, any]:
        """
        Enhanced chat with product search and recommendations
        
        Args:
            messages: List of {"role": "user"|"assistant", "content": "..."}
            user_id: Optional user ID for personalization
            
        Returns:
            {
                "message": "AI response text",
                "products": [...],  # Suggested products if any
                "intent": "..."     # Detected intent
            }
        """
        client = cls.get_client()
        
        # Get last user message for intent detection
        last_message = next((m for m in reversed(messages) if m["role"] == "user"), None)
        if not last_message:
            return {
                "message": "Hello! How can I help you today?",
                "products": [],
                "intent": "general"
            }
        
        # Detect intent
        intent_data = cls.detect_intent(last_message["content"])
        intent = intent_data["intent"]
        
        # Search products if needed
        products = []
        product_context = ""
        
        if intent == "product_search":
            # Search for products based on user query
            search_query = last_message["content"]
            category = intent_data.get("category")
            
            # If category detected, prioritize category search
            # Otherwise search by full query
            if category:
                products = cls.search_products(
                    query=category,
                    limit=5
                )
            else:
                products = cls.search_products(
                    query=search_query,
                    limit=5
                )
            
            if products:
                product_context = f"\n\nAvailable products matching the query:\n"
                for i, p in enumerate(products, 1):
                    price_str = f"${p['price']:.2f}"
                    if p.get('on_sale') and p.get('original_price'):
                        price_str = f"${p['price']:.2f} (was ${p['original_price']:.2f})"
                    product_context += f"{i}. {p['name']} - {price_str} - {p['category']}\n"
                    if p.get('description'):
                        product_context += f"   Description: {p['description']}\n"
                    product_context += f"   Stock: {p['stock']} available\n"
                product_context += "\n**IMPORTANT**: Only mention the EXACT product information provided above. DO NOT make up or invent descriptions, features, or details that are not listed. If no description is given, just mention the product name, price, and availability."
        
        elif intent == "recommendations":
            # Get featured products
            products = cls.get_featured_products(limit=4)
            if products:
                product_context = f"\n\nFeatured products to recommend:\n"
                for i, p in enumerate(products, 1):
                    price_str = f"${p['price']:.2f}"
                    if p.get('on_sale') and p.get('original_price'):
                        price_str = f"${p['price']:.2f} (was ${p['original_price']:.2f})"
                    product_context += f"{i}. {p['name']} - {price_str} - {p['category']}\n"
                    if p.get('description'):
                        product_context += f"   Description: {p['description']}\n"
                    product_context += f"   Stock: {p['stock']} available\n"
                product_context += "\n**IMPORTANT**: Only recommend the EXACT products listed above. DO NOT make up product names or details."
        
        # Build enhanced prompt with product context
        enhanced_system = SYSTEM_PROMPT
        if product_context:
            enhanced_system += product_context
        
        # Build full message list
        full_messages = [{"role": "system", "content": enhanced_system}]
        full_messages.extend(messages)
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=full_messages,
                max_tokens=400,
                temperature=0.7,
            )
            
            ai_message = response.choices[0].message.content
            
            return {
                "message": ai_message,
                "products": products,
                "intent": intent
            }
            
        except Exception as e:
            # Log error and return fallback with products if available
            print(f"OpenAI API error: {e}")
            
            # Provide fallback response with products
            if products:
                fallback_msg = "I found some products for you! Check them out below. "
                fallback_msg += "Let me know if you need more information or have questions."
            else:
                fallback_msg = "Sorry, I'm having trouble right now. Please try again or contact our support team."
            
            return {
                "message": fallback_msg,
                "products": products,
                "intent": intent
            }
