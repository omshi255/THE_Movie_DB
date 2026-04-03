/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMovies } from "../features/movies/movieSlice";
import MovieCard from "../components/MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";

const HeroBanner = lazy(() => import("../components/HeroBanner"));
const TrendingSection = lazy(() => import("../components/TrendingSection"));
const PopularSection = lazy(() => import("../components/PopularSection"));

const Home = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, error } = useAppSelector((state) => state.movie);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getMovies({ page: 1, category: "popular" }));
  }, [dispatch]);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <>
      <Suspense fallback={<div className="text-white p-10">Loading Banner...</div>}>
        <HeroBanner />
      </Suspense>

      <div className="p-4 bg-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-white">Top 10 Popular Movies</h1>

        {loading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

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
            {movies.slice(0, 10).map((movie: any) => (
              <div key={movie.id} className="min-w-[180px]">
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

        <Suspense fallback={<div className="text-white">Loading Trending...</div>}>
          <TrendingSection />
        </Suspense>

        <Suspense fallback={<div className="text-white">Loading Popular...</div>}>
          <PopularSection />
        </Suspense>
      </div>
    </>
  );
};

export default Home;