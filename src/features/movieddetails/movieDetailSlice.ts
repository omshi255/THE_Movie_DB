import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/tmdb";


export interface Movie {
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  vote_average: number;
  release_date?: string;
  runtime?: number;
  tagline?: string;
  status?: string;
  genres?: { id: number; name: string }[];
}

export interface Cast {
  id: number;
  name: string;
  profile_path?: string | null;
  character?: string;
  order?: number;
}

interface MovieDetailData {
  movie: Movie;
  cast: Cast[];
  similar: Movie[];
}

interface MovieDetailState {
  cache: Record<string, MovieDetailData>;
  loading: boolean;
  error: string | null;
}


const initialState: MovieDetailState = {
  cache: {},
  loading: false,
  error: null,
};


export const getMovieDetail = createAsyncThunk(
  "movieDetail/get",
  async (id: string, { getState, rejectWithValue }) => {
    const state = getState() as { movieDetail: MovieDetailState };

    // Return cached — no extra API call on revisit
    if (state.movieDetail.cache[id]) {
      return { id, data: state.movieDetail.cache[id] };
    }

    try {
      const res = await api.get<Movie & {
        credits: { cast: Cast[] };
        similar: { results: Movie[] };
      }>(`/movie/${id}`, {
        params: {
          append_to_response: "credits,similar",
        },
      });

      const raw = res.data;

      return {
        id,
        data: {
          movie: raw,
          cast: raw.credits?.cast?.slice(0, 12) ?? [],
          similar: raw.similar?.results ?? [],
        },
      };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.status_message ?? error.message
        );
      }
      return rejectWithValue("Failed to fetch movie details");
    }
  }
);

function isAxiosError(e: unknown): e is {
  message: string;
  response?: { data?: { status_message?: string } };
} {
  return typeof e === "object" && e !== null && "response" in e;
}


const movieDetailSlice = createSlice({
  name: "movieDetail",
  initialState,
  reducers: {
    clearMovieDetailError: (state) => {
      state.error = null;
    },
      clearMovieDetailCache: (state) => {
      state.cache = {};
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovieDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMovieDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.cache[action.payload.id] = action.payload.data;
      })
      .addCase(getMovieDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMovieDetailError ,  clearMovieDetailCache} = movieDetailSlice.actions;
export default movieDetailSlice.reducer;