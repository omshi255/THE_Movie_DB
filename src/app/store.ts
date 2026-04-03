import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "../features/movies/movieSlice";
import trendingReducer from "../features/trending/trendingSlice";
import popularReducer from "../features/popular/popularSlice";
import peopleReducer from "../features/people/peopleSlice";
import tvReducer from "../features/tv/tvSlice"; 
import searchReducer from "../features/search/searchSlice";
import movieDetailReducer from "../features/movieddetails/movieDetailSlice";
import tvDetailReducer from "../features/tvdetails/tvDetailSlice"; 
export const store = configureStore({
  reducer: {
    movie: movieReducer,
    trending: trendingReducer,
    popular: popularReducer,
    people: peopleReducer,
    tv: tvReducer, 
        search: searchReducer,
         movieDetail: movieDetailReducer,
             tvDetail: tvDetailReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;