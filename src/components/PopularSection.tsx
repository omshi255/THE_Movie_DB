/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getPopular, setType } from "../features/popular/popularSlice";
import MovieCard from "./MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

/* ✅ Responsive Skeleton */
const SkeletonCard = () => (
  <div className="min-w-[130px] sm:min-w-[150px] md:min-w-[170px] animate-pulse">
    <div className="w-full h-[180px] sm:h-[200px] md:h-[220px] bg-zinc-800 rounded-lg" />
    <div className="mt-2 h-3 bg-zinc-700 rounded w-3/4" />
    <div className="mt-1 h-3 bg-zinc-700 rounded w-1/2" />
  </div>
);

const renderedCache = new Set<number>();

const LazyMovieCard = ({ movie }: { movie: Movie }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(() => renderedCache.has(movie.id));

  useEffect(() => {
    if (visible) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          renderedCache.add(movie.id);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "120px" }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [movie.id, visible]);

  return (
    <div
      ref={ref}
      className="min-w-[130px] sm:min-w-[150px] md:min-w-[170px]"
    >
      {visible ? (
        <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
      ) : (
        <SkeletonCard />
      )}
    </div>
  );
};

const TABS = ["streaming", "tv", "rent", "theaters"];

const PopularSection = () => {
  const dispatch = useAppDispatch();
  const { movies, type, loading } = useAppSelector((state) => state.popular);
  const scrollRef = useRef<HTMLDivElement>(null);

  const prevType = useRef(type);

  useEffect(() => {
    if (prevType.current !== type) {
      scrollRef.current?.scrollTo({ left: 0, behavior: "auto" });
      prevType.current = type;
    }
    dispatch(getPopular(type));
  }, [dispatch, type]);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-6 sm:mt-8 ">

      {/* Tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto text-white">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => dispatch(setType(tab))}
            className={`px-3 py-1 whitespace-nowrap rounded-full border text-xs sm:text-sm transition
              ${type === tab
                ? "bg-white text-black border-white"
                : "border-gray-500 hover:bg-white/10"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="relative">

        {/* LEFT ARROW */}
        <button
          onClick={scrollLeft}
          className="flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 items-center justify-center opacity-80"
        >
          <ChevronLeft size={18} />
        </button>

        {/* SCROLL AREA */}
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
            movies.slice(0, 10).map((movie: Movie) => (
              <div key={movie.id} style={{ scrollSnapAlign: "start" }}>
                <LazyMovieCard movie={movie} />
              </div>
            ))}
        </div>

        {/* RIGHT ARROW */}
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

export default PopularSection;