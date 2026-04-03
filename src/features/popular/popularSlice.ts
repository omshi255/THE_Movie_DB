import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPopularByType } from "../../api/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface PopularState {
  movies: Movie[];
  type: string;
  loading: boolean;
  cache: Record<string, Movie[]>; 
}

const initialState: PopularState = {
  movies: [],
  type: "streaming",
  loading: false,
  cache: {}, 
};

export const getPopular = createAsyncThunk<
  { results: Movie[]; type: string },
  string,
  { state: { popular: PopularState } }
>(
  "popular/getPopular",
  async (type, { getState, rejectWithValue }) => {
    const state = getState().popular;

    if (state.cache[type]) {
      return rejectWithValue("already_cached");
    }

    const data = await fetchPopularByType(type);
    return { results: data.results, type };
  }
);

const popularSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;

      if (state.cache[action.payload]) {
        state.movies = state.cache[action.payload];
      } else {
        state.movies = []; // clear for fresh fetch
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopular.pending, (state) => {
        if (!state.cache[state.type]) {
          state.loading = true;
        }
      })
      .addCase(getPopular.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload.results;
        state.cache[action.payload.type] = action.payload.results;
      })
      .addCase(getPopular.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "already_cached") {
          console.error("Failed to fetch popular:", action.error);
        }
      });
  },
});

export const { setType } = popularSlice.actions;
export default popularSlice.reducer;