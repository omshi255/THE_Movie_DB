import { lazy, Suspense } from "react";
import { useEffect } from "react";
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

  useEffect(() => {
    dispatch(getMovies());
  }, [dispatch]);

  return (
    <>
      <Suspense fallback={<div className="text-white p-10">Loading Banner...</div>}>
        <HeroBanner />
      </Suspense>

      <div className="p-4 bg-black min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Popular Movies
        </h1>

        {loading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex gap-4 overflow-x-auto pb-4">
          {movies.map((movie: any) => (
            <div key={movie.id} className="min-w-[180px]">
              <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
            </div>
          ))}
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