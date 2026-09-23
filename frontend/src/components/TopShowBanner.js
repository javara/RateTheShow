import React, { useEffect, useState } from "react";
import { getPoster } from "../services/omdb";

function TopShowBanner({ show, rank }) {
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

  const getRankBadge = () => {
    if (rank === 2) return <span className="topRankBadge silver">🥈 #2 Ranked</span>;
    if (rank === 3) return <span className="topRankBadge bronze">🥉 #3 Ranked</span>;
    return <span className="topRankBadge">#{rank}</span>;
  };

  return (
    <div className={`bannerCard rank-${rank}`}>
      <div className="bannerPosterWrapper">
        {poster ? (
          <img src={poster} alt={show.title} className="bannerPoster" />
        ) : (
          <div className="bannerPlaceholder">📺</div>
        )}
      </div>

      <div className="bannerContent">
        {getRankBadge()}
        <h3>{show.title}</h3>
        <p className="bannerMeta">
          <span>{show.creator}</span> • <span>{show.release_year}</span> • <span>{show.genre}</span>
        </p>
        <p className="bannerRating">⭐ {show.rating} / 10</p>

        <div className="bannerButtonRow">
          <button className="trailerButton" onClick={handleTrailerClick}>
            ▶ Trailer
          </button>
          <button className="streamButton" onClick={handleStreamingClick}>
            📺 Stream
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopShowBanner;
