import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTV, IMG_BASE_URL } from "../api/tmdb";

const TV = () => {
  const [tv, setTv] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTV(page);

      setTv((prev) => {
        const newData = data.results || [];

        const unique = newData.filter(
          (item: any) => !prev.some((p: any) => p.id === item.id)
        );

        return [...prev, ...unique];
      });
    };

    load();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black min-h-screen p-5">
      <h2 className="text-white mb-4">TV Shows</h2>

      <div className="grid grid-cols-[repeat(auto-fill,150px)] gap-3">
        {tv.map((t, index) => (
          <div
            key={`${t.id}-${index}`} 
            onClick={() => navigate(`/tv/${t.id}`)}
            className="cursor-pointer"
          >
            <img
              loading="lazy"
              src={`${IMG_BASE_URL}${t.poster_path}`}
              className="w-full"
            />
            <p className="text-white text-xs">{t.name}</p>
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-[40px]" />
    </div>
  );
};

export default TV;