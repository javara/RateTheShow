"""Integration tests for RateTheShow API."""
import pytest

def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    assert "RateTheShow" in response.json()["message"]

def test_get_shows(client, sample_show):
    response = client.get("/shows")
    assert response.status_code == 200
    shows = response.json()
    assert isinstance(shows, list)
    assert any(s["id"] == sample_show.id for s in shows)

def test_search_shows(client, sample_show):
    response = client.get(f"/shows/search/?title={sample_show.title}")
    assert response.status_code == 200
    results = response.json()
    assert len(results) >= 1
    assert results[0]["title"] == sample_show.title

def test_rate_show(client, sample_show):
    rate_payload = {"rating": 9, "comment": "Outstanding premiere episode!"}
    response = client.post(f"/shows/{sample_show.id}/rate", json=rate_payload)
    assert response.status_code == 200
    updated_show = response.json()
    assert updated_show["rating_count"] == sample_show.rating_count + 1

    # Check review list
    reviews_res = client.get(f"/shows/{sample_show.id}/reviews")
    assert reviews_res.status_code == 200
    reviews = reviews_res.json()
    assert len(reviews) >= 1
    assert reviews[0]["comment"] == "Outstanding premiere episode!"

def test_get_stats(client, sample_show):
    response = client.get("/stats")
    assert response.status_code == 200
    data = response.json()
    assert "total_shows" in data
    assert data["total_shows"] >= 1
