

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMovies, incrementMoviePage } from "../features/movies/movieSlice";
import { IMG_BASE_URL } from "../api/tmdb";

const Movies = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { movies, page, loading } = useAppSelector((state) => state.movie);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(getMovies(page));
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        dispatch(incrementMoviePage());
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="bg-black min-h-screen p-5">
      <h2 className="text-white text-2xl text-bold mb-4">Movies</h2>
      <div className="grid grid-cols-[repeat(auto-fill,150px)] gap-3">
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/movie/${m.id}`)}
            className="cursor-pointer"
          >
            <img loading="lazy" src={`${IMG_BASE_URL}${m.poster_path}`} className="w-full" />
            <p className="text-white text-xs">{m.title}</p>
          </div>
        ))}
      </div>
      {loading && <p className="text-white text-center py-4">Loading...</p>}
      <div ref={observerRef} className="h-[40px]" />
    </div>
  );
};

export default Movies;