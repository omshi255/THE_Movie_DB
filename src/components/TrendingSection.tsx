import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getTrendingMovies, setTime } from "../features/trending/trendingSlice";
import MovieCard from "./MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ icons

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
}

const SkeletonCard = () => (
  <div className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] animate-pulse">
    <div className="w-full h-[200px] sm:h-[230px] md:h-[260px] bg-zinc-800 rounded-lg" />
    <div className="mt-2 h-3 bg-zinc-700 rounded w-3/4" />
    <div className="mt-1 h-3 bg-zinc-700 rounded w-1/2" />
  </div>
);

const LazyMovieCard = ({ movie, index }: { movie: Movie; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "120px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] relative"
    >
      <div className="absolute -top-2 -left-2 z-10 bg-white text-black text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow">
        {index + 1}
      </div>

      {visible ? (
        <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
      ) : (
        <SkeletonCard />
      )}
    </div>
  );
};

const TrendingSection = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, time } = useAppSelector((state) => state.trending);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getTrendingMovies(time));
  }, [dispatch, time]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });

  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  return (
    <div className="mt-6 sm:mt-10  ">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
          Top 10 Trending Movies
        </h2>

        {/* Tabs */}
        <div className="flex border border-gray-600 rounded-full overflow-hidden text-xs sm:text-sm">
          <button
            onClick={() => dispatch(setTime("day"))}
            className={`px-3 sm:px-4 py-1 transition ${
              time === "day"
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => dispatch(setTime("week"))}
            className={`px-3 sm:px-4 py-1 transition ${
              time === "week"
                ? "bg-white text-black"
                : "text-white hover:bg-white/10"
            }`}
          >
            This Week
          </button>
        </div>
      </div>

      <div className="relative">

        <button
          onClick={scrollLeft}
          className="flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 items-center justify-center opacity-80"
        >
          <ChevronLeft size={18} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>
                <SkeletonCard />
              </div>
            ))}

          {!loading &&
            movies.slice(0, 10).map((movie: Movie, index: number) => (
              <div key={movie.id} style={{ scrollSnapAlign: "start" }}>
                <LazyMovieCard movie={movie} index={index} />
              </div>
            ))}
        </div>

        <button
          onClick={scrollRight}
          className="flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 items-center justify-center opacity-80"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default TrendingSection;