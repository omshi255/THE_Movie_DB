import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMovies } from "../../api/tmdb";

interface MovieState {
  movies: any[];
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  page: 1,
  loading: false,
  error: null,
};

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async (page: number) => {
    const data = await fetchMovies(page);
    return data.results || [];
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    incrementMoviePage: (state) => {
      state.page += 1;
    },
    resetMovies: (state) => {
      state.movies = [];
      state.page = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.loading = false;
        const unique = action.payload.filter(
          (item: any) => !state.movies.some((m) => m.id === item.id)
        );
        state.movies = [...state.movies, ...unique];
      })
      .addCase(getMovies.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch movies";
      });
  },
});

export const { incrementMoviePage, resetMovies } = movieSlice.actions;
export default movieSlice.reducer;