import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTrendingMovies } from "../../api/tmdb";

interface TrendingState {
  movies: any[];
  loading: boolean;
  error: string | null;
  time: "day" | "week";
}

const initialState: TrendingState = {
  movies: [],
  loading: false,
  error: null,
  time: "day",
};

export const getTrendingMovies = createAsyncThunk(
  "trending/getTrendingMovies",
  async (time: "day" | "week") => {
    const data = await fetchTrendingMovies(time);
    return data.results;
  }
);

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    setTime: (state, action) => {
      state.time = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(getTrendingMovies.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch trending";
      });
  },
});

export const { setTime } = trendingSlice.actions;
export default trendingSlice.reducer;