import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTVDetails, fetchTVCredits, fetchSimilarTV, IMG_BASE_URL } from "../api/tmdb";

interface TVDetailsType {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  first_air_date: string;
  number_of_seasons: number;
  genres: { id: number; name: string }[];
}
type Cast = {
  id: number;
  name: string;
  profile_path?: string;
  character?: string;
};

type TV = {
  id: number;
  name?: string;
  poster_path?: string;
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

const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tv, setTv] = useState<TVDetailsType | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similar, setSimilar] = useState<TV[]>([]);

  const castScrollRef = useRef<HTMLDivElement>(null);
  const similarScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [details, credits, similarData] = await Promise.all([
        fetchTVDetails(id),
        fetchTVCredits(id),
        fetchSimilarTV(id),
      ]);
      setTv(details);
      setCast(credits?.cast?.slice(0, 6) || []);
      setSimilar(similarData?.results || []);
    };
    load();
  }, [id]);

  if (!tv) return <p className="text-white p-5">Loading...</p>;

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
  return (
    <div className="bg-black min-h-screen text-white">

      <div
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage: tv.backdrop_path ? `url(${IMG_BASE_URL}${tv.backdrop_path})` : "none",
          backgroundColor: tv.backdrop_path ? "transparent" : "#111",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex items-center gap-10 h-full px-10">
          <img
            src={tv.poster_path ? `${IMG_BASE_URL}${tv.poster_path}` : "https://via.placeholder.com/200x300?text=No+Image"}
            className="w-52 rounded shadow-lg"
          />
          <div>
            <h1 className="text-4xl font-bold mb-3">{tv.name}</h1>
            <p className="text-gray-300 max-w-xl mb-3">{tv.overview}</p>
            <p className="text-sm text-gray-400">{tv.vote_average} | {tv.first_air_date}</p>
            {tv.number_of_seasons && (
              <p className="text-sm text-gray-400 mt-1">
                 {tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? "s" : ""}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              {tv.genres?.map((g) => (
                <span key={g.id} className="text-xs px-3 py-1 bg-gray-700 rounded-full">{g.name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 mt-10">
        <h2 className="text-2xl font-semibold mb-4">Cast</h2>
        <div className="relative">
          <ArrowButton direction="left" onClick={() => scroll(castScrollRef, "left")} />
          <div ref={castScrollRef} className="flex gap-4 overflow-x-auto pb-2 px-10" style={{ scrollbarWidth: "none" }}>
            {cast.map((actor) => (
              <div key={actor.id} className="min-w-[120px]">
                <img
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

      <div className="px-10 mt-10 pb-10">
        <h2 className="text-2xl font-semibold mb-4">Similar TV Shows</h2>
        <div className="relative">
          <ArrowButton direction="left" onClick={() => scroll(similarScrollRef, "left")} />
          <div ref={similarScrollRef} className="flex gap-4 overflow-x-auto pb-2 px-10" style={{ scrollbarWidth: "none" }}>
            {similar.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/tv/${item.id}`)}
                className="min-w-[150px] cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : "https://via.placeholder.com/150x220?text=No+Image"}
                  className="w-full h-56 object-cover rounded"
                />
                <p className="text-sm mt-1">{item.name}</p>
              </div>
            ))}
          </div>
          <ArrowButton direction="right" onClick={() => scroll(similarScrollRef, "right")} />
        </div>
      </div>

    </div>
  );
};

export default TVDetails;