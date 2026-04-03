import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getPopular, setType } from "../features/popular/popularSlice";
import MovieCard from "./MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

const SkeletonCard = () => (
  <div className="min-w-[150px] animate-pulse">
    <div className="w-full h-[220px] bg-zinc-800 rounded-lg" />
    <div className="mt-2 h-3 bg-zinc-700 rounded w-3/4" />
    <div className="mt-1 h-3 bg-zinc-700 rounded w-1/2" />
  </div>
);

const PopularSection = () => {
  const dispatch = useAppDispatch();
  const { movies, type, loading } = useAppSelector((state) => state.popular); // ✅ loading added
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getPopular(type));
  }, [dispatch, type]);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });

  return (
    <div className="mt-5">
      <div className="mb-3 text-white">
        {["streaming", "tv", "rent", "theaters"].map((tab) => (
          <button
            key={tab}
            onClick={() => dispatch(setType(tab))}
            className={`mr-2 px-3 py-1 cursor-pointer rounded-full border text-sm
              ${type === tab
                ? "bg-white text-black border-white"
                : "bg-transparent text-white border-gray-500"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto px-10"
          style={{ scrollbarWidth: "none" }}
        >
          {loading && Array.from({ length: 10 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

          {!loading && movies.slice(0, 10).map((movie: Movie) => (
            <div key={movie.id} className="min-w-[150px]">
              <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
            </div>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PopularSection;