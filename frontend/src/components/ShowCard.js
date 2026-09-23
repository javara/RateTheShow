import React, { useEffect, useState } from "react";
import { getPoster } from "../services/omdb";
import { isFavorite, toggleFavorite } from "../services/favorites";
import ReviewSection from "./ReviewSection";

function ShowCard({ show, onDelete, onRate }) {
  const [poster, setPoster] = useState(null);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const loadPoster = async () => {
      const result = await getPoster(show.title);
      setPoster(result);
    };

    loadPoster();
    setFavorite(isFavorite(show.id));
  }, [show]);

  const handleFavoriteToggle = () => {
    toggleFavorite(show);
    setFavorite(isFavorite(show.id));
  };

  const handleTrailerClick = () => {
    const confirmed = window.confirm(
      "Notice: You are being redirected to YouTube to watch the trailer. Do you want to continue?"
    );

    if (confirmed) {
      const query = `${show.title} official trailer`;
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  const handleStreamingClick = () => {
    const confirmed = window.confirm(
      "Notice: You are being redirected to JustWatch to find available streaming providers. Do you want to continue?"
    );

    if (confirmed) {
      window.open(
        `https://www.justwatch.com/us/search?q=${encodeURIComponent(show.title)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="showCard">
      <div className="cardPosterWrapper">
        {poster ? (
          <img src={poster} alt={show.title} className="posterImage" />
        ) : (
          <div className="posterPlaceholder">
            <span>📺</span>
            <small>{show.title}</small>
          </div>
        )}
        <span className="genreBadge">{show.genre}</span>
      </div>

      <div className="cardDetails">
        <h3 className="showTitle">{show.title}</h3>
        <p className="cardMeta">
          <span><strong>Creator:</strong> {show.creator}</span>
          <span><strong>Year:</strong> {show.release_year}</span>
        </p>

        <div className="ratingBadgeRow">
          <span className="starRating">⭐ {show.rating || "N/A"}</span>
          <span className="reviewCount">({show.rating_count || 0} reviews)</span>
        </div>

        <div className="cardActions">
          <button
            className={`favoriteButton ${favorite ? "isFavorite" : ""}`}
            onClick={handleFavoriteToggle}
          >
            {favorite ? "★ Saved in Favorites" : "☆ Add to Favorites"}
          </button>

          <div className="externalActions">
            <button className="trailerButton" onClick={handleTrailerClick}>
              ▶ Trailer
            </button>
            <button className="streamButton" onClick={handleStreamingClick}>
              📺 Stream
            </button>
          </div>

          <div className="cardFooter">
            <button onClick={() => onDelete(show.id)} className="dangerButton">
              Delete Show
            </button>
          </div>
        </div>

        <ReviewSection showId={show.id} onRate={onRate} />
      </div>
    </div>
  );
}

export default ShowCard;
