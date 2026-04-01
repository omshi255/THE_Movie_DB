import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPersonDetails,
  fetchPersonMovieCredits,
  IMG_BASE_URL,
} from "../api/tmdb";

// ✅ TYPES
type Person = {
  id: number;
  name: string;
  profile_path: string;
  birthday?: string;
  deathday?: string;
  place_of_birth?: string;
  biography?: string;
  gender: number;
  known_for_department?: string;
};

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  character?: string;
  popularity: number;
  credit_id: string;
};

const ArrowButton = ({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="absolute top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center"
    style={{ [direction]: 0 }}
  >
    {direction === "left" ? "←" : "→"}
  </button>
);

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ no any
  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const [details, credits] = await Promise.all([
        fetchPersonDetails(id),
        fetchPersonMovieCredits(id),
      ]);

      setPerson(details);

      const sorted = (credits?.cast || [])
        .sort((a: Movie, b: Movie) => b.popularity - a.popularity)
        .slice(0, 20);

      setMovies(sorted);
    };

    load();
  }, [id]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  if (!person) return <p className="text-white p-5">Loading...</p>;

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="flex flex-col md:flex-row gap-10 px-10 pt-10 pb-6">
        <img
          src={
            person.profile_path
              ? `${IMG_BASE_URL}${person.profile_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          className="w-56 rounded-lg"
        />

        <div>
          <h1 className="text-4xl font-bold mb-2">{person.name}</h1>

          <p className="text-gray-400 text-sm">
            {person.birthday || "N/A"}
            {person.deathday && ` — ${person.deathday}`}
          </p>

          <p className="text-gray-400 text-sm">
            {person.place_of_birth || "N/A"}
          </p>

          <p className="text-gray-400 text-sm">
            Known for: {person.known_for_department || "N/A"}
          </p>

          <p className="text-gray-400 text-sm mb-4">
            {person.gender === 1
              ? "Female"
              : person.gender === 2
              ? "Male"
              : "N/A"}
          </p>

          <h2 className="text-lg font-semibold mb-2">Biography</h2>
          <p className="text-gray-300 text-sm">
            {person.biography || "No biography available."}
          </p>
        </div>
      </div>

      <hr className="border-gray-800 mx-10" />

      <div className="px-10 mt-8 pb-10">
        <h2 className="text-2xl mb-4">Known For</h2>

        <div className="relative">
          <ArrowButton direction="left" onClick={() => scroll("left")} />

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto px-10"
          >
            {movies.map((movie) => (
              <div
                key={`${movie.id}-${movie.credit_id}`}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="min-w-[140px] cursor-pointer"
              >
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_BASE_URL}${movie.poster_path}`
                      : "https://via.placeholder.com/140x210?text=No+Image"
                  }
                  className="w-full h-52 object-cover rounded"
                />
                <p className="text-sm">{movie.title || movie.name}</p>
                <p className="text-xs text-gray-400">
                  {movie.character}
                </p>
              </div>
            ))}
          </div>

          <ArrowButton direction="right" onClick={() => scroll("right")} />
        </div>
      </div>
    </div>
  );
};

export default PersonDetails;