import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getTV, incrementTVPage } from "../features/tv/tvSlice";
import { IMG_BASE_URL } from "../api/tmdb";

const TV = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { shows, page, loading } = useAppSelector((state) => state.tv);
  const observerRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div className="bg-black min-h-screen p-5">
      <h2 className="text-white mb-4">TV Shows</h2>
      <div className="grid grid-cols-[repeat(auto-fill,150px)] gap-3">
        {shows.map((t) => (
          <div key={t.id} onClick={() => navigate(`/tv/${t.id}`)} className="cursor-pointer">
            <img loading="lazy" src={`${IMG_BASE_URL}${t.poster_path}`} className="w-full" />
            <p className="text-white text-xs">{t.name}</p>
          </div>
        ))}
      </div>
      {loading && <p className="text-white text-center py-4">Loading...</p>}
      <div ref={observerRef} className="h-[40px]" />
    </div>
  );
};

export default TV;