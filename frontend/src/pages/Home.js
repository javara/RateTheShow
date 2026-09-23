import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getStats } from "../services/api";
import Logo from "../components/Logo";
import TopShowBanner from "../components/TopShowBanner";
import FeaturedShow from "../components/FeaturedShow";

function Home() {
  const location = useLocation();

  const [topShows, setTopShows] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await getStats();
      setStats(response.data);
      setTopShows(response.data.top_3_shows || []);
      setError("");
    } catch (err) {
      console.error("Error loading stats:", err);
      setError("Unable to load platform statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [location.pathname]);

  useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.replace("#", "");
    const scrollTimeout = setTimeout(() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 150);

    return () => clearTimeout(scrollTimeout);
  }, [location.pathname, location.hash]);

  return (
    <div className="page">
      <header className="hero" id="home-info">
        <Logo />
        <h1>Discover & Rate the Best TV Shows</h1>
        <p className="heroSubtitle">
          Explore iconic series, share in-depth reviews, track favorites, and check where to stream.
        </p>
      </header>

      {loading && <p className="loadingIndicator">Loading top shows...</p>}

      {topShows.length > 0 && <FeaturedShow show={topShows[0]} />}

      <section className="section" id="top-shows">
        <h2 className="sectionTitle">Top Rated Shows</h2>
        {error && <p className="errorText">{error}</p>}
        <div className="bannerList">
          {topShows.length > 1 &&
            topShows.slice(1).map((show, index) => (
              <TopShowBanner 
                key={show.id}
                show={show}
                rank={index + 2} 
              />
            ))}
          {topShows.length === 0 && !loading && !error && (
            <p className="emptyState">No shows ranked yet.</p>
          )}
        </div>
      </section>

      <section className="section" id="statistics">
        <h2 className="sectionTitle">Platform Statistics</h2>
        {stats && !error ? (
          <div className="statsGrid">
            <div className="statsCard">
              <span className="statsIcon">📺</span>
              <h3>Total Shows</h3>
              <p className="statsValue">{stats.total_shows}</p>
            </div>
            <div className="statsCard">
              <span className="statsIcon">⭐</span>
              <h3>Average Score</h3>
              <p className="statsValue">{stats.overall_average_rating} / 10</p>
            </div>
            <div className="statsCard">
              <span className="statsIcon">🎭</span>
              <h3>Drama Shows</h3>
              <p className="statsValue">{stats.genre_counts?.drama || 0}</p>
            </div>
            <div className="statsCard">
              <span className="statsIcon">😂</span>
              <h3>Comedy Shows</h3>
              <p className="statsValue">{stats.genre_counts?.comedy || 0}</p>
            </div>
            <div className="statsCard">
              <span className="statsIcon">🚀</span>
              <h3>Sci-Fi Shows</h3>
              <p className="statsValue">{stats.genre_counts?.scifi || 0}</p>
            </div>
            <div className="statsCard">
              <span className="statsIcon">🕵️</span>
              <h3>Crime Shows</h3>
              <p className="statsValue">{stats.genre_counts?.crime || 0}</p>
            </div>
          </div>
        ) : (
          !loading && !error && <p>No statistics available.</p>
        )}
      </section>

      {/* Portfolio About Section */}
      <section className="section aboutSection" id="about">
        <h2 className="sectionTitle">About RateTheShow</h2>
        <p className="aboutLead">
          <strong>RateTheShow</strong> is a modern, cloud-native full-stack application developed by <strong>Javier Aran Alcaide</strong>.
        </p>
        <div className="aboutGrid">
          <div className="aboutCard">
            <h3>Architecture & Stack</h3>
            <ul>
              <li><strong>Frontend:</strong> React 18, React Router, Vanilla CSS design system.</li>
              <li><strong>Backend:</strong> FastAPI (Python), SQLAlchemy ORM, Pydantic validation.</li>
              <li><strong>Database:</strong> PostgreSQL (relational catalog) & MongoDB (catalog storage).</li>
              <li><strong>Storage & Integrations:</strong> MinIO S3 Object Storage, OMDb API, YouTube Trailer search, JustWatch stream finder.</li>
              <li><strong>DevOps:</strong> Docker & Docker Compose containerization, CI/CD automated deployment.</li>
            </ul>
          </div>
          <div className="aboutCard">
            <h3>Key Capabilities</h3>
            <ul>
              <li>Dynamic genre browsing (Drama, Comedy, Sci-Fi, Crime).</li>
              <li>Automated show artwork discovery via external REST API.</li>
              <li>Aggregated scoring algorithm with verified user reviews.</li>
              <li>Local storage favorites management and secure JWT/bcrypt authentication.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
