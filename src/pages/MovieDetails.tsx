import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMovieDetail } from "../features/movieddetails/movieDetailSlice";
import { IMG_BASE_URL } from "../api/tmdb";
import type { Movie, Cast } from "../features/movieddetails/movieDetailSlice";

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-800 rounded-lg ${className}`} />
);

const LazyImage = ({
  src, alt, className, skeletonClass,
}: {
  src: string; alt: string; className?: string; skeletonClass?: string;
}) => {
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

const useScrollState = (ref: React.RefObject<HTMLDivElement | null>) => {
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
  }, [ref]);

  return { canScrollLeft, canScrollRight };
};

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { cache, loading } = useAppSelector((state) => state.movieDetail);
  const data = id ? cache[id] : null;

  const castScrollRef = useRef<HTMLDivElement | null>(null);
  const similarScrollRef = useRef<HTMLDivElement | null>(null);

  const castScroll = useScrollState(castScrollRef);
  const similarScroll = useScrollState(similarScrollRef);

  useEffect(() => {
    if (id) dispatch(getMovieDetail(id));
  }, [id, dispatch]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const scrollAmount = Math.floor(el.clientWidth * 0.75);
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
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
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1">
                  {movie.genres.map((g: { id: number; name: string }) => (
                    <span key={g.id} className="text-xs px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-colors duration-200 cursor-default">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CAST ── */}
      {cast?.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-10 sm:mt-12">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Cast</h2>
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scroll(castScrollRef, "left")}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                castScroll.canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >‹</button>

            <div
              ref={castScrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 flex-1"
              style={{ scrollbarWidth: "none" }}
            >
              {cast.map((actor: Cast) => (
                <div key={actor.id} className="min-w-[90px] sm:min-w-[115px] md:min-w-[130px] flex-shrink-0 group">
                  <div className="overflow-hidden rounded-lg">
                    <LazyImage
                      src={actor.profile_path ? `${IMG_BASE_URL}${actor.profile_path}` : "https://via.placeholder.com/120x160"}
                      alt={actor.name ?? "Cast member"}
                      className="w-full h-[120px] sm:h-[155px] md:h-[175px] object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      skeletonClass="h-[120px] sm:h-[155px] md:h-[175px]"
                    />
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 font-semibold leading-snug">{actor.name}</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 leading-snug mt-0.5">{actor.character}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll(castScrollRef, "right")}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                castScroll.canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >›</button>
          </div>
        </div>
      )}

      {/* ── SIMILAR MOVIES ── */}
      {similar?.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mt-10 sm:mt-12 pb-12 sm:pb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 tracking-wide">Similar Movies</h2>
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => scroll(similarScrollRef, "left")}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                similarScroll.canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >‹</button>

            <div
              ref={similarScrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 flex-1"
              style={{ scrollbarWidth: "none" }}
            >
              {similar.map((item: Movie) => (
                <div key={item.id} onClick={() => navigate(`/movie/${item.id}`)} className="min-w-[100px] sm:min-w-[140px] md:min-w-[155px] flex-shrink-0 cursor-pointer group">
                  <div className="overflow-hidden rounded-lg">
                    <LazyImage
                      src={item.poster_path ? `${IMG_BASE_URL}${item.poster_path}` : "https://via.placeholder.com/150x220"}
                      alt={item.title ?? "Similar movie"}
                      className="w-full h-[145px] sm:h-[205px] md:h-[225px] object-cover group-hover:scale-105 transition-transform duration-300"
                      skeletonClass="h-[145px] sm:h-[205px] md:h-[225px]"
                    />
                  </div>
                  <p className="text-xs sm:text-sm mt-1.5 font-medium leading-snug">{item.title}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => scroll(similarScrollRef, "right")}
              className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-700 hover:bg-gray-500 border border-gray-500 text-white text-xl font-bold flex items-center justify-center shadow-lg transition-all duration-200 ${
                similarScroll.canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >›</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default MovieDetails;
