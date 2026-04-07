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
    className="absolute top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center shadow-lg transition-colors duration-200"
    style={{ [direction]: "6px" }}
  >
    {direction === "left" ? "‹" : "›"}
  </button>
);

const TVDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { cache, loading, error } = useAppSelector((state) => state.tvDetail);

  const tvId = Number(id);
  const tv = cache[tvId];

  const castRef = useRef<HTMLDivElement | null>(null);
  const similarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tvId) return;
    dispatch(clearMovieDetailCache());
    dispatch(getTvDetail(tvId));
  }, [tvId, dispatch]);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    dir: "left" | "right"
  ) => {
    ref.current?.scrollBy({
      left: dir === "left" ? -250 : 250,
      behavior: "smooth",
    });
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
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      {/* ── HERO BACKDROP ── */}
      <div
        className="w-full min-h-[420px] sm:min-h-[500px] md:min-h-[65vh] lg:min-h-[75vh] bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: tv.backdrop_path
            ? `url(${IMG_BASE_URL}${tv.backdrop_path})`
            : "none",
        }}
      >
        {/* Single combined overlay — dark left/bottom, image visible right */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 100%), linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 35%, transparent 70%)",
          }}
        />

        <div
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20
                      min-h-[420px] sm:min-h-[500px] md:min-h-[65vh] lg:min-h-[75vh]
                      flex flex-col justify-center"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 md:gap-12">

            {/* POSTER */}
            <div className="flex-shrink-0 w-32 sm:w-44 md:w-56 lg:w-64">
              <img
                loading="lazy"
                src={
                  tv.poster_path
                    ? `${IMG_BASE_URL}${tv.poster_path}`
                    : "https://via.placeholder.com/300x450"
                }
                alt={tv.name}
                className="w-full aspect-[2/3] object-cover rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] ring-2 ring-white/15"
              />
            </div>

            {/* INFO */}
            <div className="text-center sm:text-left flex-1 min-w-0 pb-1">

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 leading-tight tracking-tight">
                {tv.name}
              </h1>

              {/* Tagline */}
              {tv.tagline && (
                <p className="text-gray-400 italic text-xs sm:text-sm mb-3 sm:mb-4">
                  "{tv.tagline}"
                </p>
              )}

              {/* Overview */}
              <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-none max-w-2xl">
                {tv.overview}
              </p>

              {/* Rating & Date */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-xs sm:text-sm mb-2">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                  ⭐ {tv.vote_average.toFixed(1)}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-300">{tv.first_air_date}</span>
              </div>

              {/* Seasons & Episodes */}
              {tv.number_of_seasons && (
                <p className="text-xs sm:text-sm text-gray-400 font-medium mb-4">
                  {tv.number_of_seasons} Season(s) &nbsp;·&nbsp; {tv.number_of_episodes} Episodes
                </p>
              )}

              {/* Genre Badges */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                {tv.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="text-xs px-3 py-1 broder rounded-full  cursor-default"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── CAST ── */}
      {cast.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Cast</h2>

          <div className="relative">
            <ArrowButton direction="left" onClick={() => scroll(castRef, "left")} />

            <div
              ref={castRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {cast.map((actor) => (
                <div
                  key={actor.id}
                  className="min-w-[90px] sm:min-w-[115px] md:min-w-[130px] flex-shrink-0 group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      loading="lazy"
                      src={
                        actor.profile_path
                          ? `${IMG_BASE_URL}${actor.profile_path}`
                          : "https://via.placeholder.com/120x160"
                      }
                      className="w-full h-[120px] sm:h-[155px] md:h-[175px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      alt={actor.name}
                    />
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 font-semibold leading-snug">{actor.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-snug mt-0.5">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>

            <ArrowButton direction="right" onClick={() => scroll(castRef, "right")} />
          </div>
        </div>
      )}

      {/* ── SIMILAR SHOWS ── */}
      {similar.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-10 sm:mt-12 pb-12 sm:pb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Similar Shows</h2>

          <div className="relative">
            <ArrowButton direction="left" onClick={() => scroll(similarRef, "left")} />

            <div
              ref={similarRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 scroll-smooth"
              style={{ scrollbarWidth: "none" }}
            >
              {similar.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/tv/${item.id}`)}
                  className="min-w-[100px] sm:min-w-[140px] md:min-w-[155px] flex-shrink-0 cursor-pointer group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      loading="lazy"
                      src={
                        item.poster_path
                          ? `${IMG_BASE_URL}${item.poster_path}`
                          : "https://via.placeholder.com/150x220"
                      }
                      className="w-full h-[145px] sm:h-[205px] md:h-[225px] object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.name}
                    />
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 font-medium leading-snug">{item.name}</p>
                </div>
              ))}
            </div>

            <ArrowButton direction="right" onClick={() => scroll(similarRef, "right")} />
          </div>
        </div>
      )}

    </div>
  );
};

export default TVDetails;