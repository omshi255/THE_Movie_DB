import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movies/movieSlice";
import trendingReducer from "../features/trending/trendingSlice";
import popularReducer from "../features/popular/popularSlice";
import peopleReducer from "../features/people/peopleSlice";
import tvReducer from "../features/tv/tvSlice"; 

export const store = configureStore({
  reducer: {
    movie: movieReducer,
    trending: trendingReducer,
    popular: popularReducer,
    people: peopleReducer,
    tv: tvReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;