import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to extract and flatten menu items from Swiggy's complex nested API
const extractMenuItems = (menuData) => {
  const items = [];
  try {
    const cards = menuData?.data?.cards || [];
    let regularCards = null;
    
    // Iterate to find the regular menu group
    for (const card of cards) {
      if (card?.groupedCard?.cardGroupMap?.REGULAR?.cards) {
        regularCards = card.groupedCard.cardGroupMap.REGULAR.cards;
        break;
      }
    }

    if (!regularCards) return items;

    // Filter and iterate to find item categories
    for (const category of regularCards) {
      const itemCards = category?.card?.card?.itemCards;
      if (itemCards) {
        const categoryName = category?.card?.card?.title || 'Other';
        itemCards.forEach(item => {
          const info = item?.card?.info;
          if (info) {
            items.push({
              id: info.id || `item-${Math.random()}`,
              name: info.name || 'Unknown Item',
              price: info.price ? info.price / 100 : (info.defaultPrice ? info.defaultPrice / 100 : 0),
              description: info.description || '',
              image: info.imageId 
                ? `https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_208,h_208,c_fit/${info.imageId}` 
                : null,
              category: categoryName
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error extracting menu items:", error);
  }
  return items;
};

// Async thunk for fetching menu for a specific restaurant
export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/menu/${restaurantId}`);
      if (!response.data.success) {
        return rejectWithValue('Failed to fetch menu from proxy');
      }
      return extractMenuItems(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch menu');
    }
  }
);

const initialState = {
  items: [],
  restaurantId: null,
  loading: false,
  error: null,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    clearMenu(state) {
      state.items = [];
      state.restaurantId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.restaurantId = action.meta.arg; // The restaurant ID that was passed
        state.error = null;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMenu } = menuSlice.actions;
export default menuSlice.reducer;
