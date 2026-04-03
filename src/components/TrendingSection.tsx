import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getTrendingMovies, setTime } from "../features/trending/trendingSlice";
import MovieCard from "./MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
}

const SkeletonCard = () => (
  <div className="min-w-[180px] animate-pulse">
    <div className="w-full h-[260px] bg-zinc-800 rounded-lg" />
    <div className="mt-2 h-3 bg-zinc-700 rounded w-3/4" />
    <div className="mt-1 h-3 bg-zinc-700 rounded w-1/2" />
  </div>
);

const TrendingSection = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, time } = useAppSelector((state) => state.trending);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getTrendingMovies(time));
  }, [dispatch, time]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Top 10 Trending Movies</h2>

        {/* Tab filters */}
        <div className="flex overflow-hidden border border-gray-600 rounded-full">
          <button
            onClick={() => dispatch(setTime("day"))}
            className={`px-4 py-1 text-sm ${
              time === "day" ? "bg-white text-black" : "text-white"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => dispatch(setTime("week"))}
            className={`px-4 py-1 text-sm ${
              time === "week" ? "bg-white text-black" : "text-white"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 px-10"
          style={{ scrollbarWidth: "none" }}
        >
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="min-w-[180px] relative">
                {/* Badge placeholder */}
                <div className="absolute -top-3 -left-2 z-10 bg-zinc-700 w-6 h-6 rounded-full animate-pulse" />
                <SkeletonCard />
              </div>
            ))}

          {!loading &&
            movies.slice(0, 10).map((movie: Movie, index: number) => (
              <div key={movie.id} className="min-w-[180px] relative">
                {/* Top 10 number badge */}
                <div className="absolute -top-3 -left-2 z-10 bg-white text-black text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                  {index + 1}
                </div>
                <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
              </div>
            ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TrendingSection;