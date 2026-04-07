import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPersonDetails, fetchPersonMovieCredits, IMG_BASE_URL } from "../api/tmdb";

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

// ✅ FIX 1: added moviesCount param
const useScrollState = (
  ref: React.RefObject<HTMLDivElement | null>,
  moviesCount: number
) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(update, 150);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(timer);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ref, moviesCount]); // ✅ FIX 2: moviesCount in deps array

  return { canScrollLeft, canScrollRight };
};

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [person, setPerson] = useState<Person | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showFullBio, setShowFullBio] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ FIX 3: pass movies.length so arrows show after movies load
  const { canScrollLeft, canScrollRight } = useScrollState(scrollRef, movies.length);

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

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = Math.floor(el.clientWidth * 0.75);
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  if (!person)
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );

  const bioLimit = 400;
  const isLongBio = (person.biography?.length ?? 0) > bioLimit;
  const displayBio = showFullBio || !isLongBio
    ? person.biography
    : person.biography?.slice(0, bioLimit) + "...";

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">

      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 md:pt-16 pb-8">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 items-center sm:items-start">

          {/* PROFILE IMAGE */}
          <div className="flex-shrink-0 w-36 sm:w-48 md:w-56 lg:w-64">
            <img
              src={
                person.profile_path
                  ? `${IMG_BASE_URL}${person.profile_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={person.name}
              className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] ring-2 ring-white/15"
            />
          </div>

          {/* INFO */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight tracking-tight">
              {person.name}
            </h1>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
              {person.known_for_department && (
                <span className="text-xs px-3 py-1">{person.known_for_department}</span>
              )}
              <span className="text-xs px-3 py-1">
                {person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "N/A"}
              </span>
            </div>

            <div className="space-y-1 mb-4 text-xs sm:text-sm text-gray-400">
              {person.birthday && (
                <p>
                  <span className="text-gray-500">Born: </span>
                  <span className="text-gray-300">{person.birthday}</span>
                  {person.deathday && (
                    <> &nbsp;—&nbsp; <span className="text-gray-300">{person.deathday}</span></>
                  )}
                </p>
              )}
              {person.place_of_birth && (
                <p>
                  <span className="text-gray-500">From: </span>
                  <span className="text-gray-300">{person.place_of_birth}</span>
                </p>
              )}
            </div>

            {person.biography && (
              <div>
                <h2 className="text-sm sm:text-base font-semibold mb-2 text-white">Biography</h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{displayBio}</p>
                {isLongBio && (
                  <button
                    onClick={() => setShowFullBio(!showFullBio)}
                    className="mt-2 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {showFullBio ? "Show less" : "Read more"}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <hr className="border-gray-800" />
      </div>

      {/* KNOWN FOR */}
      {movies.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-8 sm:mt-10 pb-12 sm:pb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Known For</h2>

          <div className="flex items-center gap-2">

            {/* LEFT ARROW */}
            <button
              onClick={() => scroll(scrollRef, "left")}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >‹</button>

            {/* SCROLL CONTAINER */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 flex-1"
              style={{ scrollbarWidth: "none" }}
            >
              {movies.map((movie) => (
                <div
                  key={`${movie.id}-${movie.credit_id}`}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="min-w-[100px] sm:min-w-[130px] md:min-w-[145px] flex-shrink-0 cursor-pointer group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={
                        movie.poster_path
                          ? `${IMG_BASE_URL}${movie.poster_path}`
                          : "https://via.placeholder.com/140x210?text=No+Image"
                      }
                      alt={movie.title || movie.name}
                      className="w-full h-[145px] sm:h-[185px] md:h-[210px] object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 font-medium leading-snug">{movie.title || movie.name}</p>
                  {movie.character && (
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-snug mt-0.5">{movie.character}</p>
                  )}
                </div>
              ))}
            </div>

            {/* RIGHT ARROW */}
            <button
              onClick={() => scroll(scrollRef, "right")}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >›</button>

          </div>
        </div>
      )}

    </div>
  );
};

export default PersonDetails;