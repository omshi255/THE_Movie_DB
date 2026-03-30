import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  getTrendingMovies,
  setTime,
} from "../features/trending/trendingSlice";
import MovieCard from "./MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";

const TrendingSection = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, time } = useAppSelector(
    (state) => state.trending
  );

  useEffect(() => {
    dispatch(getTrendingMovies(time));
  }, [dispatch, time]);

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className=" text-xl font-bold">
          Trending
        </h2>

        <div className="flex overflow-hidden">
          <button
            onClick={() => dispatch(setTime("day"))}
            className={`px-4 py-1 ${
              time === "day" ? "bg-white text-black" : "text-white"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => dispatch(setTime("week"))}
            className={`px-4 py-1 ${
              time === "week" ? "bg-white text-black" : "text-white"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

   
      <div className="flex gap-4 overflow-x-auto pb-4">
        {movies.map((movie: any) => (
          <div key={movie.id} className="min-w-[180px]">
            <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
          </div>
        ))}
      </div>

      {loading && <p className="text-white">Loading...</p>}
    </div>
  );
};

export default TrendingSection;