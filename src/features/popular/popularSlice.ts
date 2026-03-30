import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPopularByType } from "../../api/tmdb";

interface PopularState {
  movies: unknown[];
  loading: boolean;
  type: string;
}

const initialState: PopularState = {
  movies: [],
  loading: false,
  type: "streaming",
};

export const getPopular = createAsyncThunk(
  "popular/getPopular",
  async (type: string) => {
    const data = await fetchPopularByType(type);
    return data.results;
  }
);

const popularSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {
    setType: (state, action) => {
      state.type = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopular.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPopular.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      });
  },
});

export const { setType } = popularSlice.actions;
export default popularSlice.reducer;