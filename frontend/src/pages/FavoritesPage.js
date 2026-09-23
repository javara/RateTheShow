import React, { useEffect, useState } from "react";
import { getFavorites } from "../services/favorites";
import ShowList from "../components/ShowList";
import { deleteShow, rateShow, getShowById } from "../services/api";
import { useNavigate } from "react-router-dom";

function FavoritesPage() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      const favoriteShows = getFavorites();

      if (!favoriteShows || favoriteShows.length === 0) {
        setShows([]);
        setError("");
        return;
      }

      const updated = await Promise.all(
        favoriteShows.map((show) =>
          getShowById(show.id)
            .then((response) => response.data)
            .catch(() => show)
        )
      );

      setShows(updated);
      setError("");
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Could not load favorite shows.");
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteShow(id);
      setError("");
      loadFavorites();
    } catch (err) {
      console.error("Error deleting show:", err);
      setError("Could not delete show.");
    }
  };

  const handleRate = async (id, rating, comment = "") => {
    try {
      await rateShow(id, rating, comment);
      setError("");
      loadFavorites();
    } catch (err) {
      console.error("Error rating show:", err);
      setError("Could not rate show.");
    }
  };

  return (
    <div className="page">
      <section className="section">
        <div className="pageActions">
          <button className="backButton" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>

        <h1 className="genreHeader">My Favorite Shows</h1>

        {error && <p className="errorText">{error}</p>}

        <ShowList shows={shows} onDelete={handleDelete} onRate={handleRate} />
      </section>
    </div>
  );
}

export default FavoritesPage;
