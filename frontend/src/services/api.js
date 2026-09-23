import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:28001";

const API = axios.create({
  baseURL: API_BASE_URL,
});

// Shows endpoints
export const getShows = (genre) => {
  if (genre) {
    return API.get(`/shows?genre=${encodeURIComponent(genre)}`);
  }
  return API.get("/shows");
};

export const getCategory = (categoryName) => {
  return API.get(`/shows?genre=${encodeURIComponent(categoryName)}`);
};

export const getShowById = (id) => API.get(`/shows/${id}`);

export const addShow = (show) => API.post("/shows", show);

export const deleteShow = (id) => API.delete(`/shows/${id}`);

export const rateShow = (id, rating, comment = "") =>
  API.post(`/shows/${id}/rate`, { rating, comment });

export const getReviews = (id) => API.get(`/shows/${id}/reviews`);

export const searchShows = (title) =>
  API.get(`/shows/search/?title=${encodeURIComponent(title)}`);

export const getStats = () => API.get("/stats");

export default API;
