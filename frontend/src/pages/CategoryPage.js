import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategory,
  deleteShow,
  rateShow,
  searchShows,
} from "../services/api";
import ShowForm from "../components/ShowForm";
import ShowList from "../components/ShowList";

function CategoryPage() {
  const { name } = useParams();
  const navigate = useNavigate();
  const [shows, setShows] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadShows = async () => {
    try {
      setLoading(true);
      const response = await getCategory(name);
      setShows(response.data);
      setError("");
    } catch (err) {
      console.error("Error loading category shows:", err);
      setError("Unable to load shows for this genre.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShows();
  }, [name]);

  const handleDelete = async (id) => {
    try {
      setShows((prev) => prev.filter((show) => show.id !== id));
      await deleteShow(id);
      setError("");
    } catch (err) {
      console.error("Error deleting show:", err);
      setError("Failed to delete show.");
      loadShows();
    }
  };

  const handleRate = async (id, rating, comment = "") => {
    try {
      await rateShow(id, rating, comment);
      setError("");
      loadShows();
    } catch (err) {
      console.error("Error rating show:", err);
      setError("Failed to submit rating.");
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      loadShows();
      return;
    }

    try {
      const response = await searchShows(search);
      const filtered = response.data.filter(
        (show) => show.genre?.toLowerCase() === name.toLowerCase()
      );
      setShows(filtered);
      setError("");
    } catch (err) {
      console.error("Error searching shows:", err);
      setShows([]);
      setError("No shows found matching search.");
    }
  };

  return (
    <div className="page">
      <section className="section">
        <div className="pageActions">
          <button className="backButton" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
          <button className="categoryButton" onClick={() => navigate("/favorites")}>
            ★ Favorites
          </button>
        </div>

        <h1 className="genreHeader">{name.toUpperCase()} SHOWS</h1>

        <div className="searchBar">
          <input
            type="text"
            placeholder={`Search ${name} shows...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={handleSearch} className="primaryButton">Search</button>
          <button onClick={loadShows} className="secondaryButton">Reset</button>
        </div>

        {error && <p className="errorText">{error}</p>}
        {loading && <p className="loadingIndicator">Loading shows...</p>}
      </section>

      <section className="section">
        <ShowForm reloadShows={loadShows} defaultGenre={name} />
      </section>

      <section className="section">
        <ShowList
          shows={shows}
          onDelete={handleDelete}
          onRate={handleRate}
        />
      </section>
    </div>
  );
}

export default CategoryPage;
