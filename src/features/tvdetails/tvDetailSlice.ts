import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/tmdb";

export interface Genre {
  id: number;
  name: string;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string | null;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TvDetail {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  status: string;
  tagline: string;
  vote_average: number;
  vote_count: number;
  number_of_episodes: number;
  number_of_seasons: number;
  genres: Genre[];
  seasons: Season[];
  credits?: {
    cast: CastMember[];
  };
  similar?: {
    results: TvDetail[];
  };
  recommendations?: {
    results: TvDetail[];
  };
}

interface TvDetailState {
  cache: Record<number, TvDetail>;
  loading: boolean;
  error: string | null;
}

const initialState: TvDetailState = {
  cache: {},
  loading: false,
  error: null,
};

export const getTvDetail = createAsyncThunk(
  "tvDetail/getTvDetail",
  async (tvId: number, { getState, rejectWithValue }) => {
    const state = getState() as { tvDetail: TvDetailState };

    if (state.tvDetail.cache[tvId]) {
      return state.tvDetail.cache[tvId];
    }

    try {
      const res = await api.get<TvDetail>(`/tv/${tvId}`, {
        params: {
          append_to_response: "credits,similar,recommendations",
        },
      });
      return res.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.status_message ?? error.message
        );
      }
      return rejectWithValue("Failed to fetch TV details");
    }
  }
);

function isAxiosError(e: unknown): e is {
  message: string;
  response?: { data?: { status_message?: string } };
} {
  return typeof e === "object" && e !== null && "response" in e;
}

const tvDetailSlice = createSlice({
  name: "tvDetail",
  initialState,
  reducers: {
    clearTvDetailError: (state) => {
      state.error = null;
    },
    // ✅ Cache clear action add kiya
    clearTvDetailCache: (state) => {
      state.cache = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTvDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTvDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.cache[action.payload.id] = action.payload;
      })
      .addCase(getTvDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearTvDetailError, clearTvDetailCache } = tvDetailSlice.actions;
export default tvDetailSlice.reducer;