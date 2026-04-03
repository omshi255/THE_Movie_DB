import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTrendingMovies } from "../../api/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface TrendingState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  time: "day" | "week";
  cache: Record<string, Movie[]>; 
}

const initialState: TrendingState = {
  movies: [],
  loading: false,
  error: null,
  time: "day",
  cache: {},
};

export const getTrendingMovies = createAsyncThunk<
  { results: Movie[]; time: string },
  "day" | "week",
  { state: { trending: TrendingState } }
>(
  "trending/getTrendingMovies",
  async (time, { getState, rejectWithValue }) => {
    const state = getState().trending;

    if (state.cache[time]) {
      return rejectWithValue("already_cached");
    }

    const data = await fetchTrendingMovies(time);
    return { results: data.results, time };
  }
);

const trendingSlice = createSlice({
  name: "trending",
  initialState,
  reducers: {
    setTime: (state, action: { payload: "day" | "week" }) => {
      state.time = action.payload;

      if (state.cache[action.payload]) {
        state.movies = state.cache[action.payload];
      } else {
        state.movies = []; // clear for fresh fetch
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingMovies.pending, (state) => {
        if (!state.cache[state.time]) {
          state.loading = true;
        }
      })
      .addCase(getTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.cache[action.payload.time] = action.payload.results;
      })
      .addCase(getTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "already_cached") {
          state.error = "Failed to fetch trending";
        }
      });
  },
});

export const { setTime } = trendingSlice.actions;
export default trendingSlice.reducer;