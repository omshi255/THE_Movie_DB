import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getTvDetail } from "../features/tvdetails/tvDetailSlice";
import { IMG_BASE_URL } from "../api/tmdb";
import type { CastMember, TvDetail } from "../features/tvdetails/tvDetailSlice";
import { clearMovieDetailCache } from "../features/movieddetails/movieDetailSlice";

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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  </button>
);

const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { cache, loading, error } = useAppSelector((state) => state.tvDetail);

  const tvId = Number(id);
  const tv = cache[tvId];

  const castScrollRef = useRef<HTMLDivElement | null>(null);
  const similarScrollRef = useRef<HTMLDivElement | null>(null);

  // ✅ Single useEffect — movie cache clear + tv fetch
  useEffect(() => {
    if (!tvId) return;
    dispatch(clearMovieDetailCache());
    dispatch(getTvDetail(tvId));
  }, [tvId, dispatch]);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    ref.current?.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );

  if (!tv) return null;

  const cast: CastMember[] = tv.credits?.cast?.slice(0, 12) ?? [];
  const similar: TvDetail[] = tv.similar?.results ?? [];

  return (
    <div className="bg-black min-h-screen text-white">

      {/* Hero */}
      <div
        className="w-full h-[70vh] bg-cover bg-center relative"
        style={{
          backgroundImage: tv.backdrop_path
            ? `url(${IMG_BASE_URL}${tv.backdrop_path})`
            : "none",
          backgroundColor: tv.backdrop_path ? "transparent" : "#111",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex items-center gap-10 h-full px-10">
          <img
            loading="lazy"
            src={
              tv.poster_path
                ? `${IMG_BASE_URL}${tv.poster_path}`
                : "https://via.placeholder.com/200x300?text=No+Image"
            }
            className="w-52 rounded shadow-lg"
            alt={tv.name}
          />
          <div>
            <h1 className="text-4xl font-bold mb-3">{tv.name}</h1>
            {tv.tagline && (
              <p className="text-gray-400 italic text-sm mb-2">{tv.tagline}</p>
            )}
            <p className="text-gray-300 max-w-xl mb-3">{tv.overview}</p>
            <p className="text-sm text-gray-400">
              ⭐ {tv.vote_average.toFixed(1)} &nbsp;|&nbsp; {tv.first_air_date}
            </p>
            {tv.number_of_seasons && (
              <p className="text-sm text-gray-400 mt-1">
                {tv.number_of_seasons} Season{tv.number_of_seasons > 1 ? "s" : ""}
                &nbsp;·&nbsp;
                {tv.number_of_episodes} Episodes
              </p>
            )}
            {tv.status && (
              <p className="text-sm text-gray-400 mt-1">
                Status: <span className="text-white">{tv.status}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              {tv.genres?.map((g) => (
                <span key={g.id} className="text-xs px-3 py-1 bg-gray-700 rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cast */}
      {cast.length > 0 && (
        <div className="px-10 mt-10">
          <h2 className="text-2xl font-semibold mb-4">Cast</h2>
          <div className="relative">
            <ArrowButton direction="left" onClick={() => scroll(castScrollRef, "left")} />
            <div
              ref={castScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 px-10"
              style={{ scrollbarWidth: "none" }}
            >
              {cast.map((actor) => (
                <div key={actor.id} className="min-w-[120px]">
                  <img
                    loading="lazy"
                    src={
                      actor.profile_path
                        ? `${IMG_BASE_URL}${actor.profile_path}`
                        : "https://via.placeholder.com/120x160?text=No+Image"
                    }
                    className="w-full h-40 object-cover rounded"
                    alt={actor.name}
                  />
                  <p className="text-sm mt-1">{actor.name}</p>
                  <p className="text-xs text-gray-400">{actor.character}</p>
                </div>
              ))}
            </div>
            <ArrowButton direction="right" onClick={() => scroll(castScrollRef, "right")} />
          </div>
        </div>
      )}

      {/* Similar TV Shows */}
      {similar.length > 0 && (
        <div className="px-10 mt-10 pb-10">
          <h2 className="text-2xl font-semibold mb-4">Similar TV Shows</h2>
          <div className="relative">
            <ArrowButton direction="left" onClick={() => scroll(similarScrollRef, "left")} />
            <div
              ref={similarScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 px-10"
              style={{ scrollbarWidth: "none" }}
            >
              {similar.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/tv/${item.id}`)}
                  className="min-w-[150px] cursor-pointer hover:scale-105 transition"
                >
                  <img
                    loading="lazy"
                    src={
                      item.poster_path
                        ? `${IMG_BASE_URL}${item.poster_path}`
                        : "https://via.placeholder.com/150x220?text=No+Image"
                    }
                    className="w-full h-56 object-cover rounded"
                    alt={item.name}
                  />
                  <p className="text-sm mt-1">{item.name}</p>
                </div>
              ))}
            </div>
            <ArrowButton direction="right" onClick={() => scroll(similarScrollRef, "right")} />
          </div>
        </div>
      )}

    </div>
  );
};

export default TVDetails;