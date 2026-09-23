const FAVORITES_KEY = "ratetheshow_favorites";

export const getFavorites = () => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const isFavorite = (showId) => {
  const favorites = getFavorites();
  return favorites.some((show) => show.id === showId);
};

export const toggleFavorite = (show) => {
  const favorites = getFavorites();
  const exists = favorites.some((fav) => fav.id === show.id);

  let updatedFavorites;

  if (exists) {
    updatedFavorites = favorites.filter((fav) => fav.id !== show.id);
  } else {
    updatedFavorites = [...favorites, show];
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
};
