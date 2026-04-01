// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchPopularByType } from "../../api/tmdb";

// interface PopularState {
//   movies: unknown[];
//   loading: boolean;
//   type: string;
// }

// const initialState: PopularState = {
//   movies: [],
//   loading: false,
//   type: "streaming",
// };

// export const getPopular = createAsyncThunk(
//   "popular/getPopular",
//   async (type: string) => {
//     const data = await fetchPopularByType(type);
//     return data.results;
//   }
// );

// const popularSlice = createSlice({
//   name: "popular",
//   initialState,
//   reducers: {
//     setType: (state, action) => {
//       state.type = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(getPopular.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getPopular.fulfilled, (state, action) => {
//         state.loading = false;
//         state.movies = action.payload;
//       });
//   },
// });

// export const { setType } = popularSlice.actions;
// export default popularSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPopularByType } from "../../api/tmdb";

// ✅ Movie type
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
}

const initialState: PopularState = {
  movies: [],
  type: "streaming",
  loading: false,
};

// ✅ thunk typed
export const getPopular = createAsyncThunk<Movie[], string>(
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
      state.movies = []; // reset on tab change
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
      })
      .addCase(getPopular.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setType } = popularSlice.actions;
export default popularSlice.reducer;