import React from "react";
import ShowCard from "./ShowCard";

function ShowList({ shows, onDelete, onRate }) {
  if (!shows || shows.length === 0) {
    return (
      <div className="emptyState">
        <p>No TV shows found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="showGrid">
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
          onDelete={onDelete}
          onRate={onRate}
        />
      ))}
    </div>
  );
}

export default ShowList;
