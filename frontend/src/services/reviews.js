import { getReviews } from "./api";

export const getReviewsForShow = async (showId) => {
  try {
    const response = await getReviews(showId);
    return response.data.map((rev) => ({
      rating: rev.rating,
      comment: rev.comment,
      createdAt: rev.created_at,
    }));
  } catch (error) {
    console.error("Error loading reviews for show:", error);
    return [];
  }
};
