import json
import os
from urllib import error, request
from database import SessionLocal, User
from bcrypt import hashpw, gensalt

API_URL = os.getenv("API_URL", "http://localhost:8000/shows")

SHOWS = [
    # --- DRAMA ---
    {"title": "Breaking Bad", "creator": "Vince Gilligan", "release_year": 2008, "genre": "drama"},
    {"title": "The Sopranos", "creator": "David Chase", "release_year": 1999, "genre": "drama"},
    {"title": "Succession", "creator": "Jesse Armstrong", "release_year": 2018, "genre": "drama"},
    {"title": "Chernobyl", "creator": "Craig Mazin", "release_year": 2019, "genre": "drama"},
    {"title": "The Wire", "creator": "David Simon", "release_year": 2002, "genre": "drama"},
    {"title": "Game of Thrones", "creator": "David Benioff & D.B. Weiss", "release_year": 2011, "genre": "drama"},

    # --- COMEDY ---
    {"title": "Ted Lasso", "creator": "Brendan Hunt, Joe Kelly & Bill Lawrence", "release_year": 2020, "genre": "comedy"},
    {"title": "The Office", "creator": "Greg Daniels", "release_year": 2005, "genre": "comedy"},
    {"title": "Fleabag", "creator": "Phoebe Waller-Bridge", "release_year": 2016, "genre": "comedy"},
    {"title": "Brooklyn Nine-Nine", "creator": "Dan Goor & Michael Schur", "release_year": 2013, "genre": "comedy"},
    {"title": "The Bear", "creator": "Christopher Storer", "release_year": 2022, "genre": "comedy"},
    {"title": "What We Do in the Shadows", "creator": "Jemaine Clement", "release_year": 2019, "genre": "comedy"},

    # --- SCI-FI ---
    {"title": "Stranger Things", "creator": "The Duffer Brothers", "release_year": 2016, "genre": "scifi"},
    {"title": "Severance", "creator": "Dan Erickson", "release_year": 2022, "genre": "scifi"},
    {"title": "Dark", "creator": "Baran bo Odar & Jantje Friese", "release_year": 2017, "genre": "scifi"},
    {"title": "Black Mirror", "creator": "Charlie Brooker", "release_year": 2011, "genre": "scifi"},
    {"title": "The Expanse", "creator": "Mark Fergus & Hawk Ostby", "release_year": 2015, "genre": "scifi"},

    # --- CRIME ---
    {"title": "Better Call Saul", "creator": "Vince Gilligan & Peter Gould", "release_year": 2015, "genre": "crime"},
    {"title": "Peaky Blinders", "creator": "Steven Knight", "release_year": 2013, "genre": "crime"},
    {"title": "True Detective", "creator": "Nic Pizzolatto", "release_year": 2014, "genre": "crime"},
    {"title": "Fargo", "creator": "Noah Hawley", "release_year": 2014, "genre": "crime"},
    {"title": "Mindhunter", "creator": "Joe Penhall", "release_year": 2017, "genre": "crime"},
    {"title": "Sherlock", "creator": "Mark Gatiss & Steven Moffat", "release_year": 2010, "genre": "crime"},
]

def insert_show(show: dict) -> tuple[bool, str]:
    """Posts a TV show to the RateTheShow API."""
    data = json.dumps(show).encode("utf-8")
    req = request.Request(
        API_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with request.urlopen(req) as response:
            if response.getcode() in [200, 201]:
                return True, f"Added: {show['title']}"
            return False, f"HTTP {response.getcode()}: {show['title']}"
    except Exception as e:
        return False, f"Connection error for '{show['title']}': {str(e)}"

def seed():
    print(f"Connecting to {API_URL}...")
    success_count = 0
    for show in SHOWS:
        ok, msg = insert_show(show)
        print(("  [OK] " if ok else "  [FAILED] ") + msg)
        if ok:
            success_count += 1
    print(f"Seeding complete: {success_count}/{len(SHOWS)} shows added.")

if __name__ == "__main__":
    seed()
