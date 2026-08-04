from pydantic import BaseModel, EmailStr, field_validator
import re
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long.')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least 1 uppercase letter.')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least 1 number.')
        return v

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

