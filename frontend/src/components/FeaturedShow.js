import React, { useEffect, useState } from "react";
import { getPoster } from "../services/omdb";

function FeaturedShow({ show }) {
  const [poster, setPoster] = useState(null);

  useEffect(() => {
    if (!show) return;
    const loadPoster = async () => {
      const result = await getPoster(show.title);
      setPoster(result);
    };

    loadPoster();
  }, [show]);

  if (!show) return null;

  const handleTrailerClick = () => {
    const query = `${show.title} official trailer`;
    window.open(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleStreamingClick = () => {
    window.open(
      `https://www.justwatch.com/us/search?q=${encodeURIComponent(show.title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="featuredShowSection">
      <div className="featuredShowCard">
        <div className="featuredPosterWrapper">
          {poster ? (
            <img src={poster} alt={show.title} className="featuredPoster" />
          ) : (
            <div className="featuredPosterPlaceholder">📺</div>
          )}
        </div>

        <div className="featuredContent">
          <span className="topRankBadge gold">🥇 #1 Top Rated Show</span>
          <h2>{show.title}</h2>
          <p className="featuredMeta">
            <span><strong>Creator:</strong> {show.creator}</span>
            <span> • </span>
            <span><strong>Year:</strong> {show.release_year}</span>
            <span> • </span>
            <span className="genreTag">{show.genre?.toUpperCase()}</span>
          </p>

          <p className="featuredRating">
            Rating: <span className="highlightRating">⭐ {show.rating}</span> / 10 ({show.rating_count} ratings)
          </p>

          <div className="featuredButtonRow">
            <button className="trailerButton" onClick={handleTrailerClick}>
              ▶ Watch Trailer
            </button>
            <button className="streamButton" onClick={handleStreamingClick}>
              📺 Find Streaming
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedShow;
