import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurants: [],
  searchTerm: "",
  selectedId: null,
  filter: "all",
  loading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurants(state, action) {
      state.restaurants = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setSelectedRestaurant(state, action) {
      state.selectedId = action.payload;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { 
  setRestaurants, 
  setLoading, 
  setError, 
  setSearchTerm, 
  setSelectedRestaurant, 
  setFilter, 
  clearError 
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
