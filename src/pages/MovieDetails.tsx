import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchSimilarMovies,
  IMG_BASE_URL,
} from "../api/tmdb";
type Movie = {
  id: number;
  title?: string;
  overview?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  release_date?: string;
};

type Cast = {
  id: number;
  name: string;
  profile_path?: string;
  character?: string;
};
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

  const [movie, setMovie] = useState<Movie | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);

  const castScrollRef = useRef<HTMLDivElement>(null);
  const similarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      const [details, credits, similarData] = await Promise.all([
        fetchMovieDetails(id),
        fetchMovieCredits(id),
        fetchSimilarMovies(id),
      ]);
      setMovie(details);
      setCast(credits?.cast?.slice(0, 6) || []);
      setSimilar(similarData?.results || []);
    };
    loadData();
  }, [id]);

const scroll = (
  ref: React.RefObject<HTMLDivElement | null>,
  dir: "left" | "right"
) => {
  if (!ref.current) return;

  ref.current.scrollBy({
    left: dir === "left" ? -400 : 400,
    behavior: "smooth",
  });
};

  if (!movie) return <h1 className="text-white p-10">Loading...</h1>;

  return (
    <div className="bg-black text-white min-h-screen">

      {/* BACKDROP HERO */}
      <div
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${IMG_BASE_URL}${movie.backdrop_path})`
            : "none",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 flex items-center gap-10 h-full px-10">
          <img
            loading="lazy"
            src={movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
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
            {cast.map((actor) => (
              <div key={actor.id} className="min-w-[120px]">
                <img
                  loading="lazy"
                  src={actor.profile_path ? `${IMG_BASE_URL}${actor.profile_path}` : "https://via.placeholder.com/120x160?text=No+Image"}
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
            {similar.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/movie/${item.id}`)}
                className="min-w-[150px] cursor-pointer hover:scale-105 transition"
              >
                <img
                  loading="lazy"
                  src={item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : "https://via.placeholder.com/150x220?text=No+Image"}
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