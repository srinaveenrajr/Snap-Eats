import axios from "axios";

const API_BASE_URL = "https://snap-eats-backend-9pqv.onrender.com";

// Get user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw (
      error.response?.data || { success: false, error: "Failed to get profile" }
    );
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/user/profile`,
      profileData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Update profile error:", error);
    throw (
      error.response?.data || {
        success: false,
        error: "Failed to update profile",
      }
    );
  }
};
