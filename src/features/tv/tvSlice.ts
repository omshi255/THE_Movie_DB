import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTV } from "../../api/tmdb";

interface TVState {
  shows: any[];
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: TVState = {
  shows: [],
  page: 1,
  loading: false,
  error: null,
};

export const getTV = createAsyncThunk(
  "tv/getTV",
  async (page: number) => {
    const data = await fetchTV(page);
    return data.results || [];
  }
);

const tvSlice = createSlice({
  name: "tv",
  initialState,
  reducers: {
    incrementTVPage: (state) => {
      state.page += 1;
    },
    resetTV: (state) => {
      state.shows = [];
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTV.fulfilled, (state, action) => {
        state.loading = false;
        const unique = action.payload.filter(
          (item: any) => !state.shows.some((s) => s.id === item.id)
        );
        state.shows = [...state.shows, ...unique];
      })
      .addCase(getTV.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch TV shows";
      });
  },
});

export const { incrementTVPage, resetTV } = tvSlice.actions;
export default tvSlice.reducer;