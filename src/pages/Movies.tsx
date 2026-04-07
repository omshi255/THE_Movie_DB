import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  getMovies,
  incrementMoviePage,
  setMovieCategory,
  resetMovies,
} from "../features/movies/movieSlice";
import type { MovieCategory } from "../features/movies/movieSlice";

const CATEGORY_LABELS: Record<string, string> = {
  popular: "Popular Movies",
  now_playing: "Now Playing",
  upcoming: "Upcoming Movies",
  top_rated: "Top Rated Movies",
};

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full aspect-[2/3] bg-gray-800 rounded-lg" />
    <div className="mt-2 h-3 bg-gray-700 rounded w-4/5" />
  </div>
);

const Movies = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryFromURL = (searchParams.get("category") ||
    "popular") as MovieCategory;

  const { movies, page, loading, category } = useAppSelector(
    (state) => state.movie
  );

  const observerRef = useRef<HTMLDivElement | null>(null);
  const initialized = movies.length > 0;

  useEffect(() => {
    return () => {
      dispatch(resetMovies());
    };
  }, []);

  /* ✅ Reset + set category (important fix) */
  useEffect(() => {
    dispatch(resetMovies());
    dispatch(setMovieCategory(categoryFromURL));
  }, [categoryFromURL, dispatch]);

  useEffect(() => {
    dispatch(getMovies({ page, category }));
  }, [page, category, dispatch]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        dispatch(incrementMoviePage());
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, dispatch]);

  return (
    <div className="bg-black min-h-screen px-3 sm:px-5 md:px-8 lg:px-10 py-5">

      {/* Title */}
      <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        {CATEGORY_LABELS[category] || "Movies"}
      </h2>

      {/* Grid */}
      <div className="
        grid gap-3 sm:gap-4
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6 
        2xl:grid-cols-8
      ">

        {/* Initial Skeleton */}
        {!initialized && loading &&
          Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}

        {/* Movies */}
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/movie/${m.id}`)}
            className="cursor-pointer group"
          >
            {m.poster_path ? (
              <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w342${m.poster_path}`}
                alt={m.title}
                className="
                  w-full aspect-[2/3] object-cover rounded-lg
                  transition-transform duration-300 
                  group-hover:scale-105
                "
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-gray-800 flex items-center justify-center rounded-lg">
                <span className="text-gray-500 text-xs">No Image</span>
              </div>
            )}

            <p className="
              text-white text-[10px] sm:text-xs md:text-sm 
              mt-1 line-clamp-2
            ">
              {m.title}
            </p>
          </div>
        ))}

        {/* Load More Skeleton */}
        {initialized && loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
      </div>

      {/* Loader */}
      {initialized && loading && (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-gray-600 border-t-[#01b4e4] rounded-full animate-spin" />
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-[40px]" />
    </div>
  );
};

export default Movies;