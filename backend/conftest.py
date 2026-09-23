"""Pytest fixtures for RateTheShow backend testing."""
import os
import pytest

# Ensure testing uses an isolated SQLite test database
os.environ["DATABASE_URL"] = "sqlite:///./test_ratetheshow.db"

from fastapi.testclient import TestClient
from database import init_db, SessionLocal, ShowDB
from main import app

@pytest.fixture(scope="session", autouse=True)
def initialize_database():
    """Initializes tables once before running test session."""
    init_db()
    yield
    # Cleanup test db file after session
    if os.path.exists("./test_ratetheshow.db"):
        try:
            os.remove("./test_ratetheshow.db")
        except Exception:
            pass

@pytest.fixture(scope="function")
def db_session():
    """Fixture providing an isolated database session."""
    session = SessionLocal()
    yield session
    session.close()

@pytest.fixture(scope="function")
def client():
    """Fixture providing a FastAPI TestClient."""
    return TestClient(app)

@pytest.fixture(scope="function")
def sample_show(db_session):
    """Fixture inserting a sample test show, cleaned up after test."""
    test_show = ShowDB(
        title="Test Pilot Show",
        creator="Test Creator",
        release_year=2024,
        genre="drama",
        rating=8.5,
        rating_count=2
    )
    db_session.add(test_show)
    db_session.commit()
    db_session.refresh(test_show)
    show_id = test_show.id

    yield test_show

    # Cleanup
    item = db_session.query(ShowDB).filter(ShowDB.id == show_id).first()
    if item:
        db_session.delete(item)
        db_session.commit()
