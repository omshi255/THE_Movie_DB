import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMoviesByCategory } from "../../api/tmdb";

export type MovieCategory = "popular" | "now_playing" | "upcoming" | "top_rated";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MovieState {
  movies: Movie[];
  page: number;
  loading: boolean;
  error: string | null;
  fetchedPages: number[];
  category: MovieCategory;
}

const initialState: MovieState = {
  movies: [],
  page: 1,
  loading: false,
  error: null,
  fetchedPages: [],
  category: "popular",
};

export const getMovies = createAsyncThunk<
  { results: Movie[]; page: number; category: MovieCategory },
  { page: number; category: MovieCategory }
>(
  "movies/getMovies",
  async ({ page, category }, { getState, rejectWithValue }) => {
    const state = getState() as { movie: MovieState };
    if (state.movie.category === category && state.movie.fetchedPages.includes(page)) {
      return rejectWithValue("already_fetched");
    }
    const data = await fetchMoviesByCategory(category, page);
    return { results: data.results, page, category };
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    incrementMoviePage: (state) => { state.page += 1; },
    resetMovies: (state) => {
      state.movies = [];
      state.page = 1;
      state.error = null;
      state.fetchedPages = [];
    },
    setMovieCategory: (state, action: { payload: MovieCategory }) => {
      if (state.category !== action.payload) {
        state.category = action.payload;
        state.movies = [];
        state.page = 1;
        state.fetchedPages = [];
        state.error = null;
      }
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
        const { results, page } = action.payload;
        if (!state.fetchedPages.includes(page)) state.fetchedPages.push(page);
        const unique = results.filter((item: Movie) => !state.movies.some((m) => m.id === item.id));
        state.movies = [...state.movies, ...unique];
      })
      .addCase(getMovies.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "already_fetched") state.error = "Failed to fetch movies";
      });
  },
});

export const { incrementMoviePage, resetMovies, setMovieCategory } = movieSlice.actions;
export default movieSlice.reducer;