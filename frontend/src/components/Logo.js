import React from "react";
import { Link } from "react-router-dom";

function Logo() {
  return (
    <Link to="/" className="brandLogo">
      <svg
        className="brandIcon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="2" />
        <polygon points="10,9 16,12.5 10,16" fill="currentColor" />
        <line x1="8" y1="2" x2="10" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="16" y1="2" x2="14" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="brandText">
        Rate<span className="brandHighlight">TheShow</span>
      </span>
    </Link>
  );
}

export default Logo;
