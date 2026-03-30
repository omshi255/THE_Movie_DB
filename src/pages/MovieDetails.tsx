import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchMovieDetails,
  fetchMovieCredits,
  fetchSimilarMovies,
  IMG_BASE_URL,
} from "../api/tmdb";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [similar, setSimilar] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const details = await fetchMovieDetails(id);
      const credits = await fetchMovieCredits(id);
      const similarData = await fetchSimilarMovies(id);

      setMovie(details);
      setCast(credits?.cast?.slice(0, 6) || []);
      setSimilar(similarData?.results || []);
    };

    loadData();
  }, [id]);

  if (!movie) {
    return <h1 className="text-white p-10">Loading...</h1>;
  }

  return (
    <div className="bg-black text-white min-h-screen">

      {/* 🎬 BACKDROP HERO */}
      <div
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage: movie.backdrop_path
            ? `url(${IMG_BASE_URL}${movie.backdrop_path})`
            : "none",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 flex items-center gap-10 h-full px-10">

          {/* Poster */}
          <img
          loading="lazy"
            src={
              movie.poster_path
                ? `${IMG_BASE_URL}${movie.poster_path}`
                : "https://via.placeholder"
            }
            className="w-60 rounded shadow-lg"
          />

          {/* Text */}
          <div>
            <h1 className="text-4xl font-bold mb-4">
              {movie.title}
            </h1>

            <p className="max-w-xl text-gray-300 mb-4">
              {movie.overview}
            </p>

            <p className="text-sm text-gray-400">
              {movie.vote_average} | {movie.release_date}
            </p>
          </div>
        </div>
      </div>

      {/* 🎭 CAST */}
      <div className="px-10 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Cast</h2>

        <div className="flex gap-4 overflow-x-auto">
          {cast.map((actor) => (
            <div key={actor.id} className="min-w-[120px]">
              <img
              loading="lazy"
                src={
                  actor.profile_path
                    ? `${IMG_BASE_URL}${actor.profile_path}`
                    : "https://via.placeholder"
                }
                className="w-full h-40 object-cover rounded"
              />
              <p className="text-sm mt-1">{actor.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🎥 SIMILAR MOVIES */}
      <div className="px-10 mt-10 pb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Similar Movies
        </h2>

        <div className="flex gap-4 overflow-x-auto">
          {similar.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/movie/${item.id}`)}
              className="min-w-[150px] cursor-pointer hover:scale-105 transition"
            >
              <img
              loading="lazy"
                src={
                  item.poster_path
                    ? `${IMG_BASE_URL}${item.poster_path}`
                    : "https://via.placeholder"
                }
                className="w-full h-56 object-cover rounded"
              />
              <p className="text-sm mt-1">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;