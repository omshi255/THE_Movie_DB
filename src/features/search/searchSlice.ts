import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { searchMulti } from "../../api/tmdb";

export interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
  release_date?: string;
  first_air_date?: string;
}

interface SearchState {
  results: SearchResult[];
  loading: boolean;
}

const initialState: SearchState = {
  results: [],
  loading: false,
};

export const searchQuery = createAsyncThunk<SearchResult[], string>(
  "search/query",
  async (query: string) => {
    const data = await searchMulti(query);
    return (data.results || []).filter(
      (r: SearchResult) =>
        r.media_type === "movie" ||
        r.media_type === "tv" ||
        r.media_type === "person"
    );
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchQuery.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchQuery.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload.slice(0, 8);
      })
      .addCase(searchQuery.rejected, (state) => {
        state.loading = false;
        state.results = [];
      });
  },
});

export const { clearResults } = searchSlice.actions;
export default searchSlice.reducer;