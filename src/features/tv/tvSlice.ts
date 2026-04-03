import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTVByCategory } from "../../api/tmdb";

export type TVCategory = "popular" | "top_rated" | "on_the_air" | "airing_today";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
}

interface TVState {
  shows: TVShow[];
  page: number;
  loading: boolean;
  error: string | null;
  category: TVCategory;
  fetchedPages: Record<string, number[]>;
}

const initialState: TVState = {
  shows: [],
  page: 1,
  loading: false,
  error: null,
  category: "popular",
  fetchedPages: {},
};

export const getTV = createAsyncThunk<
  { results: TVShow[]; page: number; category: TVCategory },
  { page: number; category: TVCategory },
  { state: { tv: TVState } }
>(
  "tv/getTV",
  async ({ page, category }, { getState, rejectWithValue }) => {
    const state = getState().tv;
    const fetched = state.fetchedPages[category] || [];

    if (fetched.includes(page)) {
      return rejectWithValue("already_fetched");
    }

    const data = await fetchTVByCategory(category, page);
    return { results: data.results || [], page, category };
  }
);

const tvSlice = createSlice({
  name: "tv",
  initialState,
  reducers: {
    incrementTVPage: (state) => {
      state.page += 1;
    },
    setTVCategory: (state, action: { payload: TVCategory }) => {
      if (state.category !== action.payload) {
        state.category = action.payload;
        state.shows = [];
        state.page = 1;
        state.error = null;
        state.loading = false;
      }
    },
    resetTV: (state) => {
      state.shows = [];
      state.page = 1;
      state.error = null;
      state.loading = false;
      state.fetchedPages = {};
      state.category = "popular";
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
        const { results, page, category } = action.payload;

        if (!state.fetchedPages[category]) state.fetchedPages[category] = [];
        if (!state.fetchedPages[category].includes(page)) {
          state.fetchedPages[category].push(page);
        }

        const unique = results.filter(
          (item) => !state.shows.some((s) => s.id === item.id)
        );
        state.shows = [...state.shows, ...unique];
      })
      .addCase(getTV.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== "already_fetched") {
          state.error = "Failed to fetch TV shows";
        }
      });
  },
});

export const { incrementTVPage, setTVCategory, resetTV } = tvSlice.actions;
export default tvSlice.reducer;