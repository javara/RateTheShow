import React, { useState } from "react";
import { addShow } from "../services/api";

function ShowForm({ reloadShows, defaultGenre = "drama" }) {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [genre, setGenre] = useState(defaultGenre);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !creator.trim() || !releaseYear) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      await addShow({
        title: title.trim(),
        creator: creator.trim(),
        release_year: parseInt(releaseYear, 10),
        genre: genre.trim().toLowerCase(),
      });

      setTitle("");
      setCreator("");
      setReleaseYear("");
      setGenre(defaultGenre);

      reloadShows();
    } catch (err) {
      console.error("Error adding show:", err);
      alert("Failed to add show. Please verify the input.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card formCard">
      <h2>Add a New TV Show</h2>

      <form className="showForm" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Title</label>
          <input
            type="text"
            placeholder="e.g. Breaking Bad"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="formGroup">
          <label>Creator / Showrunner</label>
          <input
            type="text"
            placeholder="e.g. Vince Gilligan"
            value={creator}
            onChange={(e) => setCreator(e.target.value)}
            required
          />
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label>Release Year</label>
            <input
              type="number"
              placeholder="e.g. 2008"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label>Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option value="drama">Drama</option>
              <option value="comedy">Comedy</option>
              <option value="scifi">Sci-Fi</option>
              <option value="crime">Crime</option>
            </select>
          </div>
        </div>

        <button type="submit" className="primaryButton" disabled={submitting}>
          {submitting ? "Adding..." : "+ Add TV Show"}
        </button>
      </form>
    </div>
  );
}

export default ShowForm;
