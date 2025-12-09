"""
Chat Router - API endpoints for chatbot
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.chat_service import ChatService

chat_router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    user_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str


@chat_router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat with AI assistant
    
    Send conversation history and get AI response
    """
    try:
        # Convert to dict format for OpenAI
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        
        response = ChatService.chat(messages, request.user_id)
        
        return ChatResponse(message=response)
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Chat service not configured")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Chat service error")
