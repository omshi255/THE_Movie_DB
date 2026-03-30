import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPopularMovies } from "../../api/tmdb";

interface MovieState {
  movies: any[];
  loading: boolean;
  error: string | null;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
};

export const getMovies = createAsyncThunk(
  "movies/getMovies",
  async () => {
    const pages = [1, 2, 3, 4];

    const responses = await Promise.all(
      pages.map((page) => fetchPopularMovies(page))
    );

    const allMovies = responses
      .flatMap((res) => res.results)
      .filter(
        (movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
      );

    return allMovies;
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    resetMovies: (state) => {
      state.movies = [];
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
        state.movies = action.payload;
      })
      .addCase(getMovies.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch movies";
      });
  },
});


export const { resetMovies } = movieSlice.actions;
export default movieSlice.reducer;