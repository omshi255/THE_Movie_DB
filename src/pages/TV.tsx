import { Suspense, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import {
  getTV,
  incrementTVPage,
  resetTV,
  setTVCategory,
} from "../features/tv/tvSlice";
import type { TVCategory } from "../features/tv/tvSlice";
import { IMG_BASE_URL } from "../api/tmdb";

const CATEGORY_LABELS: Record<TVCategory, string> = {
  popular: "Popular TV Shows",
  top_rated: "Top Rated TV Shows",
  on_the_air: "On TV",
  airing_today: "Airing Today",
};

/* ✅ Responsive Skeleton */
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full aspect-[2/3] bg-zinc-800 rounded-lg" />
    <div className="mt-2 h-3 bg-zinc-700 rounded w-3/4" />
    <div className="mt-1 h-3 bg-zinc-700 rounded w-1/2" />
  </div>
);

/* ✅ Fallback */
const TVSkeletonFallback = () => (
  <div className="bg-black min-h-screen px-3 sm:px-5 md:px-8 py-5">
    <div className="h-6 w-32 bg-zinc-800 rounded mb-4 animate-pulse" />
    <div className="
      grid gap-3
      grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
    ">
      {Array.from({ length: 18 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-6">
    <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-zinc-600 border-t-white rounded-full animate-spin" />
  </div>
);

const TVContent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categoryFromURL = (searchParams.get("category") ||
    "popular") as TVCategory;

  const { shows, page, loading, category } = useAppSelector(
    (state) => state.tv
  );

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetTV());
    };
  }, []);

  /* ✅ FIX: reset on category change */
  useEffect(() => {
    dispatch(resetTV());
    dispatch(setTVCategory(categoryFromURL));
  }, [categoryFromURL, dispatch]);

  useEffect(() => {
    dispatch(getTV({ page, category }));
  }, [page, category, dispatch]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        dispatch(incrementTVPage());
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [loading, dispatch]);

  const isInitialLoad = loading && shows.length === 0;

  return (
    <div className="bg-black min-h-screen px-3 sm:px-5 md:px-8 lg:px-10 py-5">

      {/* Title */}
      <h2 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        {CATEGORY_LABELS[category] || "TV Shows"}
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

        {/* Shows */}
        {shows.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/tv/${t.id}`)}
            className="cursor-pointer group"
          >
            {t.poster_path ? (
              <img
                loading="lazy"
                src={`${IMG_BASE_URL}${t.poster_path}`}
                alt={t.name}
                className="
                  w-full aspect-[2/3] object-cover rounded-lg
                  transition-transform duration-300 
                  group-hover:scale-105
                "
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center rounded-lg">
                <span className="text-zinc-500 text-xs">No Image</span>
              </div>
            )}

            <p className="
              text-white text-[10px] sm:text-xs md:text-sm 
              mt-1 line-clamp-2
            ">
              {t.name}
            </p>
          </div>
        ))}

        {/* Initial Skeleton */}
        {isInitialLoad &&
          Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Loader */}
      {loading && shows.length > 0 && <Spinner />}

      {/* Infinite Scroll */}
      <div ref={observerRef} className="h-[40px]" />
    </div>
  );
};

const TV = () => (
  <Suspense fallback={<TVSkeletonFallback />}>
    <TVContent />
  </Suspense>
);

export default TV;