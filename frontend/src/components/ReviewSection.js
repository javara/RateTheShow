import React, { useEffect, useState } from "react";
import { getReviewsForShow } from "../services/reviews";

function ReviewSection({ showId, onRate }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    const list = await getReviewsForShow(showId);
    setReviews(list);
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [showId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericRating = Number(rating);

    if (!numericRating || numericRating < 1 || numericRating > 10) {
      alert("Please provide a rating between 1 and 10.");
      return;
    }

    try {
      setSubmitting(true);
      await onRate(showId, numericRating, comment.trim());
      await fetchReviews();
      setRating("");
      setComment("");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reviewSection">
      <button
        type="button"
        className="toggleReviewButton"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? "▲ Hide Reviews" : "▼ Reviews & Comments"}
      </button>

      {isOpen && (
        <div className="reviewContainer">
          <h4>Rate & Review</h4>

          <form onSubmit={handleSubmit} className="reviewForm">
            <div className="ratingInputRow">
              <input
                type="number"
                min="1"
                max="10"
                placeholder="Score (1-10)"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              />
              <span className="ratingHint">/ 10 ⭐</span>
            </div>

            <textarea
              placeholder="Write your review or thoughts on this show..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
            />

            <button type="submit" className="primaryButton" disabled={submitting}>
              {submitting ? "Saving..." : "Submit Review"}
            </button>
          </form>

          <div className="reviewList">
            {reviews.length === 0 ? (
              <p className="noReviewsText">No reviews submitted yet. Be the first to rate!</p>
            ) : (
              reviews.map((rev, index) => (
                <div key={index} className="reviewItem">
                  <div className="reviewHeader">
                    <span className="reviewScore">⭐ {rev.rating}/10</span>
                    <small className="reviewDate">{rev.createdAt}</small>
                  </div>
                  {rev.comment && <p className="reviewComment">{rev.comment}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewSection;
