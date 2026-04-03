import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMovieDetail } from "../features/movieddetails/movieDetailSlice";
import { IMG_BASE_URL } from "../api/tmdb";
import type { Movie, Cast } from "../features/movieddetails/movieDetailSlice";


const ArrowButton = ({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
    style={{ [direction]: 0 }}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {direction === "left"
        ? <polyline points="15 18 9 12 15 6" />
        : <polyline points="9 18 15 12 9 6" />}
    </svg>
  </button>
);

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { cache, loading } = useAppSelector((state) => state.movieDetail);
  const data = id ? cache[id] : null;

  const castScrollRef = useRef<HTMLDivElement | null>(null);
  const similarScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (id) dispatch(getMovieDetail(id));
  }, [id, dispatch]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    ref.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  if (loading || !data) return <h1 className="text-white p-10">Loading...</h1>;

  const { movie, cast, similar } = data;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* BACKDROP HERO */}
      <div
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{ backgroundImage: movie.backdrop_path ? `url(${IMG_BASE_URL}${movie.backdrop_path})` : "none" }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex items-center gap-10 h-full px-10">
          <img
            loading="lazy"
            src={movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
            alt={movie.title || "Movie poster"}
            className="w-60 rounded shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="max-w-xl text-gray-300 mb-4">{movie.overview}</p>
            <p className="text-sm text-gray-400">{movie.vote_average} | {movie.release_date}</p>
          </div>
        </div>
      </div>

      {/* CAST */}
      <div className="px-10 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Cast</h2>
        <div className="relative">
          <ArrowButton direction="left" onClick={() => scroll(castScrollRef, "left")} />
          <div ref={castScrollRef} className="flex gap-4 overflow-x-auto pb-2 px-10" style={{ scrollbarWidth: "none" }}>
            {cast.map((actor: Cast) => (
              <div key={actor.id} className="min-w-[120px]">
                <img
                  loading="lazy"
                  src={actor.profile_path ? `${IMG_BASE_URL}${actor.profile_path}` : "https://via.placeholder.com/120x160?text=No+Image"}
                  alt={actor.name}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="text-sm mt-1">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
          <ArrowButton direction="right" onClick={() => scroll(castScrollRef, "right")} />
        </div>
      </div>

      {/* SIMILAR MOVIES */}
      <div className="px-10 mt-10 pb-10">
        <h2 className="text-2xl font-semibold mb-4">Similar Movies</h2>
        <div className="relative">
          <ArrowButton direction="left" onClick={() => scroll(similarScrollRef, "left")} />
          <div ref={similarScrollRef} className="flex gap-4 overflow-x-auto pb-2 px-10" style={{ scrollbarWidth: "none" }}>
            {similar.map((item: Movie) => (
              <div
                key={item.id}
                onClick={() => navigate(`/movie/${item.id}`)}
                className="min-w-[150px] cursor-pointer hover:scale-105 transition"
              >
                <img
                  loading="lazy"
                  src={item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : "https://via.placeholder.com/150x220?text=No+Image"}
                  alt={item.title || "Movie poster"}
                  className="w-full h-56 object-cover rounded"
                />
                <p className="text-sm mt-1">{item.title}</p>
              </div>
            ))}
          </div>
          <ArrowButton direction="right" onClick={() => scroll(similarScrollRef, "right")} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;