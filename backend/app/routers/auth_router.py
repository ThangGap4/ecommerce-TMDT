from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta
import traceback
from typing import List

from app.schemas.user_schemas import UserCreate, UserResponse, LoginRequest, TokenResponse
from app.services.user_service import UserServices, require_user, require_admin
from app.models.sqlalchemy import User
from app.db import get_db_session


router = APIRouter()


# Registration route
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    try:
        user_obj = UserServices.register(user.model_dump())
        return user_obj
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Register error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# Login route
@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest):
    user = UserServices.authenticate(login_data.email, login_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Email hoac mat khau khong dung")

    access_token = UserServices.create_access_token(
        str(user.uuid),
        user.role,
        timedelta(minutes=UserServices.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    user_response = UserResponse.model_validate(user)
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


# Get current user info
@router.get("/me", response_model=UserResponse)
def get_me(current_user = Depends(require_user)):
    return UserResponse.model_validate(current_user)


# Protected route example (user only)
@router.get("/protected")
def protected_route(current_user = Depends(require_user)):
    return {"message": "Day la route can dang nhap", "user": current_user.email}


# Admin only route example
@router.get("/admin-only")
def admin_only_route(current_user = Depends(require_admin)):
    return {"message": "Day la route chi danh cho admin", "user": current_user.email}


# Get all users (admin only)
@router.get("/users", response_model=List[UserResponse])
def get_all_users(current_user = Depends(require_admin)):
    db = get_db_session()
    try:
        users = db.query(User).all()
        return [UserResponse.model_validate(u) for u in users]
    finally:
        db.close()


# Promote user to admin (admin only)
@router.put("/users/{user_id}/promote", response_model=UserResponse)
def promote_user(user_id: str, current_user = Depends(require_admin)):
    db = get_db_session()
    try:
        user = db.query(User).filter(User.uuid == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Khong tim thay user")
        
        if user.role == "admin":
            raise HTTPException(status_code=400, detail="User da la admin")
        
        user.role = "admin"
        db.commit()
        db.refresh(user)
        return UserResponse.model_validate(user)
    finally:
        db.close()


# Demote admin to user (admin only)
@router.put("/users/{user_id}/demote", response_model=UserResponse)
def demote_user(user_id: str, current_user = Depends(require_admin)):
    db = get_db_session()
    try:
        user = db.query(User).filter(User.uuid == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Khong tim thay user")
        
        if str(user.uuid) == str(current_user.uuid):
            raise HTTPException(status_code=400, detail="Khong the tu ha cap chinh minh")
        
        if user.role == "user":
            raise HTTPException(status_code=400, detail="User da la user thuong")
        
        user.role = "user"
        db.commit()
        db.refresh(user)
        return UserResponse.model_validate(user)
    finally:
        db.close()

