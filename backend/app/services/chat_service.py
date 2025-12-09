"""
Chat Service - OpenAI GPT Integration for E-commerce Chatbot
"""
import os
from typing import List, Dict
from openai import OpenAI

# Load API key from environment
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# System prompt for e-commerce context
SYSTEM_PROMPT = """You are a helpful customer support assistant for an e-commerce fashion store.
Your role is to:
- Help customers find products (clothing, shoes, accessories)
- Answer questions about orders, shipping, and returns
- Provide size recommendations
- Explain payment methods and checkout process
- Be friendly, concise, and helpful

Store policies:
- Free shipping on orders over $50
- 30-day return policy for unworn items
- We accept credit cards and PayPal
- Typical delivery time: 3-7 business days

Keep responses brief and helpful. If you don't know something specific about an order, 
suggest the customer contact support or check their order status page."""


class ChatService:
    """Service for handling chat with OpenAI GPT"""
    
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
    def chat(cls, messages: List[Dict[str, str]], user_id: str = None) -> str:
        """
        Send chat messages to OpenAI and get response
        
        Args:
            messages: List of {"role": "user"|"assistant", "content": "..."}
            user_id: Optional user ID for context
            
        Returns:
            Assistant's response text
        """
        client = cls.get_client()
        
        # Build full message list with system prompt
        full_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
        full_messages.extend(messages)
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=full_messages,
                max_tokens=300,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            # Log error and return fallback
            print(f"OpenAI API error: {e}")
            return "Sorry, I'm having trouble connecting right now. Please try again later or contact our support team."
