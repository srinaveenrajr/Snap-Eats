import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

/**
 * Fetch menu items for a specific restaurant from our proxy server
 * @param {string} restaurantId - The ID of the restaurant
 * @param {object} location - Location coordinates {lat, lng}
 * @returns {Promise} - Menu items data
 */
export const fetchMenuItems = async (
  restaurantId,
  location = { lat: 13.0895, lng: 80.2739 },
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/menu`, {
      params: {
        restaurantId,
        lat: location.lat,
        lng: location.lng,
      },
      timeout: 15000,
    });

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        restaurantId: response.data.restaurantId,
        total: response.data.total,
      };
    } else {
      throw new Error(response.data.message || "Failed to fetch menu");
    }
  } catch (error) {
    console.error("Menu API Error:", error);

    // Return structured error
    return {
      success: false,
      error:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch menu",
      details: error.response?.data?.details || null,
    };
  }
};

/**
 * Group menu items by category
 * @param {Array} menuItems - Array of menu items
 * @returns {Object} - Grouped menu items by category
 */
export const groupMenuByCategory = (menuItems) => {
  if (!Array.isArray(menuItems)) return {};

  return menuItems.reduce((groups, item) => {
    const category = item.category || "Other";
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

export default { fetchMenuItems, groupMenuByCategory };
