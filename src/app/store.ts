import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movies/movieSlice";
import trendingReducer from "../features/trending/trendingSlice";
import popularReducer from "../features/popular/popularSlice";
export const store = configureStore({
  reducer: {
    movie: movieReducer,
    trending: trendingReducer,
    popular: popularReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;