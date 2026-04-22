import axios from "axios";

const API_BASE_URL = "https://snap-eats-backend-9pqv.onrender.com/api/auth";

// Set up axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register user
export const register = async (userData) => {
  try {
    const response = await api.post("/register", userData);

    if (response.data.success) {
      // Store token and user data
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
      };
    } else {
      throw new Error(response.data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Registration failed",
      message: error.response?.data?.message || error.message,
    };
  }
};

// Login user
export const login = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);

    if (response.data.success) {
      // Store token and user data
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data.user));

      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token,
      };
    } else {
      throw new Error(response.data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);

    return {
      success: false,
      error: error.response?.data?.error || "Login failed",
      message: error.response?.data?.message || error.message,
    };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const response = await api.get("/me");

    if (response.data.success) {
      return {
        success: true,
        user: response.data.data.user,
      };
    } else {
      throw new Error(response.data.message || "Failed to get user data");
    }
  } catch (error) {
    console.error("Get current user error:", error);

    // Clear invalid token
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return {
      success: false,
      error: error.response?.data?.error || "Failed to get user data",
      message: error.response?.data?.message || error.message,
    };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return { success: true };
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

// Get stored user data
export const getStoredUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get stored token
export const getStoredToken = () => {
  return localStorage.getItem("token");
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  isLoggedIn,
  getStoredUser,
  getStoredToken,
};
