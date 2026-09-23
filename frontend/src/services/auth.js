import API from "./api";

const AUTH_STORAGE_KEY = "ratetheshow_user";

export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/login", { email, password });
    const user = response.data;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Login failed. Please check your credentials.");
  }
};

export const registerUser = async (name, email, password) => {
  try {
    const [firstName, ...rest] = name.trim().split(" ");
    const lastName = rest.join(" ") || "";

    const response = await API.post("/register", {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.detail) {
      throw new Error(error.response.data.detail);
    }
    throw new Error("Registration failed. Please try again.");
  }
};

export const logoutUser = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  window.dispatchEvent(new Event("authChange"));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(AUTH_STORAGE_KEY);
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
