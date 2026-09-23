from datetime import datetime
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from bcrypt import checkpw, gensalt, hashpw

from database import ShowDB, User, ReviewDB, get_db, init_db
from models import (
    Show,
    ShowCreate,
    RatingCreate,
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    Review,
    ReviewCreate,
)

app = FastAPI(
    title="RateTheShow API",
    description="REST API for discovering, rating, and reviewing TV shows.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.get("/")
def read_root():
    """Root health check endpoint."""
    return {"message": "Welcome to RateTheShow API"}


@app.get("/shows", response_model=List[Show])
def get_shows(genre: Optional[str] = None, db: Session = Depends(get_db)):
    """Fetch all shows with optional genre filtering."""
    query = db.query(ShowDB)
    if genre:
        query = query.filter(ShowDB.genre.ilike(genre.strip()))
    return query.all()


@app.get("/shows/search/", response_model=List[Show])
def search_shows(title: Optional[str] = None, db: Session = Depends(get_db)):
    """Search shows by title substring."""
    if not title:
        return []
    return db.query(ShowDB).filter(ShowDB.title.ilike(f"%{title.strip()}%")).all()


@app.get("/shows/{show_id}", response_model=Show)
def get_show(show_id: int, db: Session = Depends(get_db)):
    """Retrieve a single show by its ID."""
    show = db.query(ShowDB).filter(ShowDB.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show


@app.post("/shows", response_model=Show, status_code=status.HTTP_201_CREATED)
def create_show(show: ShowCreate, db: Session = Depends(get_db)):
    """Add a new TV show to the catalog."""
    new_show = ShowDB(
        title=show.title.strip(),
        creator=show.creator.strip(),
        release_year=show.release_year,
        genre=show.genre.strip().lower(),
    )
    db.add(new_show)
    db.commit()
    db.refresh(new_show)
    return new_show


@app.delete("/shows/{show_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_show(show_id: int, db: Session = Depends(get_db)):
    """Delete a show from the catalog."""
    show = db.query(ShowDB).filter(ShowDB.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    db.delete(show)
    db.commit()
    return None


@app.post("/shows/{show_id}/rate", response_model=Show)
def rate_show(show_id: int, review_in: ReviewCreate, db: Session = Depends(get_db)):
    """Submit a rating and optional review for a TV show, updating its aggregate score."""
    show = db.query(ShowDB).filter(ShowDB.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")

    new_review = ReviewDB(
        show_id=show_id,
        rating=review_in.rating,
        comment=review_in.comment.strip() if review_in.comment else None,
        created_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
    )
    db.add(new_review)

    current_total = show.rating * show.rating_count
    show.rating_count += 1
    show.rating = round((current_total + review_in.rating) / show.rating_count, 1)

    db.commit()
    db.refresh(show)
    return show


@app.get("/shows/{show_id}/reviews", response_model=List[Review])
def get_show_reviews(show_id: int, db: Session = Depends(get_db)):
    """Retrieve all submitted reviews for a given show."""
    show = db.query(ShowDB).filter(ShowDB.id == show_id).first()
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return db.query(ReviewDB).filter(ReviewDB.show_id == show_id).order_by(ReviewDB.id.desc()).all()


@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Provides overall platform metrics, genre counts, and top-rated shows."""
    total_shows = db.query(ShowDB).count()
    if total_shows == 0:
        return {
            "total_shows": 0,
            "overall_average_rating": 0.0,
            "genre_counts": {},
            "genre_ratings": {},
            "top_3_shows": [],
        }

    overall_avg = db.query(func.avg(ShowDB.rating)).scalar() or 0.0

    genres = ["drama", "comedy", "scifi", "crime"]
    genre_counts = {}
    genre_ratings = {}

    for g in genres:
        count = db.query(ShowDB).filter(ShowDB.genre.ilike(g)).count()
        avg = db.query(func.avg(ShowDB.rating)).filter(ShowDB.genre.ilike(g)).scalar() or 0.0
        genre_counts[g] = count
        genre_ratings[g] = round(float(avg), 1)

    top_3 = (
        db.query(ShowDB)
        .order_by(ShowDB.rating.desc(), ShowDB.rating_count.desc())
        .limit(3)
        .all()
    )

    return {
        "total_shows": total_shows,
        "overall_average_rating": round(float(overall_avg), 1),
        "genre_counts": genre_counts,
        "genre_ratings": genre_ratings,
        "top_3_shows": top_3,
    }


@app.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Registers a new user."""
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email is already registered")

    hashed_pw = hashpw(request.password.encode("utf-8"), gensalt()).decode("utf-8")
    user = User(
        email=request.email,
        password=hashed_pw,
        first_name=request.first_name,
        last_name=request.last_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    alias = f"{user.first_name} {user.last_name}".strip() or user.email.split("@")[0]
    return LoginResponse(email=user.email, alias=alias)


@app.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticates a user and returns an alias."""
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not checkpw(request.password.encode("utf-8"), user.password.encode("utf-8")):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    alias = f"{user.first_name or ''} {user.last_name or ''}".strip() or user.email.split("@")[0]
    return LoginResponse(email=user.email, alias=alias)
