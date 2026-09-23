from pathlib import Path
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, Integer, String, Float, text, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# Determine absolute path to the .env file in the backend directory or workspace root
BASE_DIR = Path(__file__).resolve().parent
ENV_PATH = BASE_DIR / ".env"
if not ENV_PATH.exists():
    ENV_PATH = BASE_DIR.parent / ".env"

load_dotenv(dotenv_path=ENV_PATH)

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Please check the .env configuration file."
    )

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class ShowDB(Base):
    """Database model for TV shows."""
    __tablename__ = "shows"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    creator = Column(String, nullable=False)
    release_year = Column(Integer, nullable=False)
    genre = Column(String, nullable=False, index=True)
    rating = Column(Float, nullable=False, default=0.0, server_default=text("0.0"))
    rating_count = Column(Integer, nullable=False, default=0, server_default=text("0"))

    reviews = relationship("ReviewDB", back_populates="show", cascade="all, delete-orphan")


class User(Base):
    """Database model for registered users."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password = Column(String, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)


class ReviewDB(Base):
    """Database model for show reviews."""
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    show_id = Column(Integer, ForeignKey("shows.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)
    comment = Column(String, nullable=True)
    created_at = Column(String, nullable=False)

    show = relationship("ShowDB", back_populates="reviews")


def init_db():
    """Initializes database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Provides a database session generator for FastAPI dependencies."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
