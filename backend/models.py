from typing import Optional
from pydantic import BaseModel, Field


class ShowBase(BaseModel):
    """Base schema for TV show information."""
    title: str
    creator: str
    release_year: int
    genre: str


class ShowCreate(ShowBase):
    """Payload schema for creating a new TV show."""
    pass


class Show(ShowBase):
    """TV show representation with rating metrics."""
    id: int
    rating: float = 0.0
    rating_count: int = 0

    class Config:
        from_attributes = True


class RatingCreate(BaseModel):
    """Payload schema for submitting a rating."""
    rating: float = Field(..., ge=1, le=10)


class LoginRequest(BaseModel):
    """Credentials for authentication."""
    email: str
    password: str


class LoginResponse(BaseModel):
    """Authentication response payload."""
    email: str
    alias: str


class RegisterRequest(BaseModel):
    """User registration payload."""
    email: str
    password: str
    first_name: str
    last_name: str


class ReviewCreate(BaseModel):
    """Payload for submitting a review and rating."""
    rating: int = Field(..., ge=1, le=10)
    comment: Optional[str] = None


class Review(BaseModel):
    """Public representation of a show review."""
    id: int
    show_id: int
    rating: int
    comment: Optional[str] = None
    created_at: str

    class Config:
        from_attributes = True
