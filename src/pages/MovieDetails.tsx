
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMovieDetail } from "../features/movieddetails/movieDetailSlice";
import { IMG_BASE_URL } from "../api/tmdb";
import type { Movie, Cast } from "../features/movieddetails/movieDetailSlice";
import { X, Play } from "lucide-react";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />
);

const LazyImage = ({
  src, alt, className, skeletonClass,
}: {
src: string; alt: string; className?: string; skeletonClass?: string;}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "100px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full h-full">
      {!loaded && <Skeleton className={`absolute inset-0 ${skeletonClass ?? ""}`} />}
      <img
        ref={imgRef}
        src={inView ? src : undefined}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 30,
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: "#374151",
  border: "1px solid #6b7280",
  color: "white",
  fontSize: 22,
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
  flexShrink: 0,
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPlayer, setShowPlayer] = useState(false);
  const [castCanLeft, setCastCanLeft] = useState(false);
  const [castCanRight, setCastCanRight] = useState(true);
  const [simCanLeft, setSimCanLeft] = useState(false);
  const [simCanRight, setSimCanRight] = useState(true);

  const { cache, loading } = useAppSelector((state) => state.movieDetail);
  const data = id ? cache[id] : null;

  const castScrollRef = useRef<HTMLDivElement | null>(null);
  const similarScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (id) dispatch(getMovieDetail(id));
  }, [id, dispatch]);

  const updateCastScroll = () => {
    const el = castScrollRef.current;
    if (!el) return;
    setCastCanLeft(el.scrollLeft > 10);
    setCastCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const updateSimScroll = () => {
    const el = similarScrollRef.current;
    if (!el) return;
    setSimCanLeft(el.scrollLeft > 10);
    setSimCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  };

  const scrollRow = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right", update: () => void) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
    setTimeout(update, 400);
  };

  if (loading || !data)
    return (
      <div className="bg-[#0a0a0a] min-h-screen">
        <div className="w-full min-h-[420px] sm:min-h-[500px] md:min-h-[65vh] lg:min-h-[75vh] relative bg-gray-900 animate-pulse">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0a0a 0%, transparent 60%)" }} />
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-8 py-10 md:py-20 min-h-[420px] md:min-h-[65vh] flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-12">
              <Skeleton className="w-32 sm:w-44 md:w-56 lg:w-64 aspect-[2/3] rounded-xl" />
              <div className="flex-1 space-y-3 w-full max-w-xl">
                <Skeleton className="h-8 sm:h-10 md:h-12 w-3/4 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-5/6 rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-10">
          <Skeleton className="h-7 w-24 mb-4 rounded" />
          <div className="flex gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[90px] sm:min-w-[115px] md:min-w-[130px] flex-shrink-0 space-y-2">
                <Skeleton className="w-full h-[120px] sm:h-[155px] md:h-[175px] rounded-lg" />
                <Skeleton className="h-3 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  const { movie, cast, similar } = data;

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      {/* HERO */}
      <div
        className="w-full min-h-[420px] sm:min-h-[500px] md:min-h-[65vh] lg:min-h-[75vh] bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: movie.backdrop_path ? `url(${IMG_BASE_URL}${movie.backdrop_path})` : "none" }}
      >
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to right, rgba(0,0,0,0.92) 25%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 100%), linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 35%, transparent 70%)",
        }} />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-20 min-h-[420px] sm:min-h-[500px] md:min-h-[65vh] lg:min-h-[75vh] flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 md:gap-12">

            <div className="flex-shrink-0 w-32 sm:w-44 md:w-56 lg:w-64">
              <div className="w-full aspect-[2/3] overflow-hidden rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] ring-2 ring-white/15">
                <LazyImage
                  src={movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : "https://via.placeholder.com/300x450"}
                  alt={movie.title ?? "Movie poster"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0 pb-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-1 sm:mb-2 leading-tight tracking-tight">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-gray-400 italic text-xs sm:text-sm mb-3 sm:mb-4">"{movie.tagline}"</p>
              )}
              <p className="text-gray-300 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-none max-w-2xl">
                {movie.overview}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-3 gap-y-1 text-xs sm:text-sm mb-3">
                <span className="flex items-center gap-1 text-yellow-400 font-semibold">⭐ {movie.vote_average?.toFixed(1)}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-300">{movie.release_date}</span>
                {movie.runtime && (<><span className="text-gray-600">•</span><span className="text-gray-300">{movie.runtime} min</span></>)}
              </div>
              {movie.genres && (
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 mb-5">
                  {movie.genres.map((g: { id: number; name: string }) => (
                    <span key={g.id} className="text-xs px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-default">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
              <button
                onClick={() => setShowPlayer(true)}
                className="mt-4 border-2 border-white px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2"
              >
                <Play size={20} />
                Watch Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPlayer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowPlayer(false)}
            className="absolute top-5 right-5 text-white hover:scale-110 transition"
          >
            <X size={32} />
          </button>
          <div className="w-[90%] max-w-5xl h-[80vh]" onClick={(e) => e.stopPropagation()}>
<iframe
  src={`https://www.vidking.net/embed/movie/${id}`}
  width="100%"
  height="600"
  frameBorder="0"
  allowFullScreen
/>          </div>
        </div>
      )}

      {cast?.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 sm:mt-12" style={{ padding: "0 40px" }}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Cast</h2>
          <div style={{ position: "relative" }}>

            <button
              onClick={() => scrollRow(castScrollRef, "left", updateCastScroll)}
              style={{ ...btnStyle, left: -20, display: castCanLeft ? "flex" : "none" }}
            >‹</button>

            <button
              onClick={() => scrollRow(castScrollRef, "right", updateCastScroll)}
              style={{ ...btnStyle, right: -20, display: castCanRight ? "flex" : "none" }}
            >›</button>

            <div
              ref={castScrollRef}
              onScroll={updateCastScroll}
              style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}
            >
              {cast.map((actor: Cast) => (
                <div key={actor.id} style={{ minWidth: 130, flexShrink: 0 }} className="group">
                  <div className="overflow-hidden rounded-lg">
                    <LazyImage
                      src={actor.profile_path ? `${IMG_BASE_URL}${actor.profile_path}` : "https://via.placeholder.com/120x160"}
                      alt={actor.name ?? "Cast member"}
                      className="w-full h-[175px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      skeletonClass="h-[175px]"
                    />
                  </div>
                  <p className="text-sm mt-1.5 font-semibold leading-snug">{actor.name}</p>
                  <p className="text-xs text-gray-400 leading-snug mt-0.5">{actor.character}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIMILAR MOVIES */}
      {similar?.length > 0 && (
        <div className="max-w-6xl mx-auto mt-10 sm:mt-12 pb-12 sm:pb-16" style={{ padding: "0 40px" }}>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Similar Movies</h2>
          <div style={{ position: "relative" }}>

            {/* LEFT */}
            <button
              onClick={() => scrollRow(similarScrollRef, "left", updateSimScroll)}
              style={{ ...btnStyle, left: -20, display: simCanLeft ? "flex" : "none" }}
            >‹</button>

            {/* RIGHT */}
            <button
              onClick={() => scrollRow(similarScrollRef, "right", updateSimScroll)}
              style={{ ...btnStyle, right: -20, display: simCanRight ? "flex" : "none" }}
            >›</button>

            <div
              ref={similarScrollRef}
              onScroll={updateSimScroll}
              style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}
            >
              {similar.map((item: Movie) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/movie/${item.id}`)}
                  style={{ minWidth: 155, flexShrink: 0, cursor: "pointer" }}
                  className="group"
                >
                  <div className="overflow-hidden rounded-lg">
                    <LazyImage
                      src={item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : "https://via.placeholder.com/150x220"}
                      alt={item.title ?? "Similar movie"}
                      className="w-full h-[225px] object-cover group-hover:scale-105 transition-transform duration-300"
                      skeletonClass="h-[225px]"
                    />
                  </div>
                  <p className="text-sm mt-1.5 font-medium leading-snug">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetails;