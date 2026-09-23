import axios from "axios";

const OMDB_API_KEY = "trilogy";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

export const getPoster = async (title) => {
  try {
    const response = await axios.get(OMDB_BASE_URL, {
      params: {
        apikey: OMDB_API_KEY,
        t: title,
      },
    });

    if (response.data && response.data.Poster && response.data.Poster !== "N/A") {
      return response.data.Poster;
    }

    return null;
  } catch (error) {
    console.error("Error loading poster from OMDb:", error);
    return null;
  }
};
