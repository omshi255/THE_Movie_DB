import { Suspense, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getTV, incrementTVPage, resetTV } from "../features/tv/tvSlice";
import { IMG_BASE_URL } from "../api/tmdb";

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full h-[225px] bg-zinc-800 rounded-md" />
    <div className="mt-2 h-3 bg-zinc-700 rounded w-3/4" />
    <div className="mt-1 h-3 bg-zinc-700 rounded w-1/2" />
  </div>
);

const TVSkeletonFallback = () => (
  <div className="bg-black min-h-screen p-5">
    <div className="h-7 w-32 bg-zinc-800 rounded mb-4 animate-pulse" />
    <div className="grid grid-cols-[repeat(auto-fill,150px)] gap-3">
      {Array.from({ length: 18 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </div>
);

const Spinner = () => (
  <div className="flex justify-center py-6">
    <div className="w-8 h-8 border-4 border-zinc-600 border-t-white rounded-full animate-spin" />
  </div>
);

const TVContent = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { shows, page, loading } = useAppSelector((state) => state.tv);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetTV());
    };
  }, []);

  useEffect(() => {
    dispatch(getTV(page));
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) {
        dispatch(incrementTVPage());
      }
    });
    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const isInitialLoad = loading && shows.length === 0;

  return (
    <div className="bg-black min-h-screen p-5">
      <h2 className="text-white mb-4">TV Shows</h2>

      <div className="grid grid-cols-[repeat(auto-fill,150px)] gap-3">
        {shows.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/tv/${t.id}`)}
            className="cursor-pointer"
          >
            <img
              loading="lazy"
              src={`${IMG_BASE_URL}${t.poster_path}`}
              className="w-full rounded-md"
            />
            <p className="text-white text-xs mt-1">{t.name}</p>
          </div>
        ))}

        {isInitialLoad &&
          Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {loading && shows.length > 0 && <Spinner />}
      <div ref={observerRef} className="h-[40px]" />
    </div>
  );
};

const TV = () => (
  <Suspense fallback={<TVSkeletonFallback />}>
    <TVContent />
  </Suspense>
);

export default TV;