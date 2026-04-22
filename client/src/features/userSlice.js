import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserProfile, updateUserProfile } from '../services/userApi';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserProfile();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUserProfileData = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(profileData);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  error: null,
  isProfileComplete: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
      state.isProfileComplete = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.isProfileComplete = action.payload?.isProfileComplete || false;
    }
  },
  extraReducers: (builder) => {
    // Fetch profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isProfileComplete = action.payload?.isProfileComplete || false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to fetch profile';
      });

    // Update profile
    builder
      .addCase(updateUserProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfileData.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.isProfileComplete = action.payload?.isProfileComplete || false;
      })
      .addCase(updateUserProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || 'Failed to update profile';
      });
  }
});

export const { clearUser, clearError, setProfile } = userSlice.actions;

// Selectors
export const selectUserProfile = (state) => state.user.profile;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;
export const selectIsProfileComplete = (state) => state.user.isProfileComplete;

export default userSlice.reducer;
