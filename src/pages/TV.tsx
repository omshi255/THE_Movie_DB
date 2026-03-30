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
      setTv((prev) => [...prev, ...(data.results || [])]);
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
    <div style={{ background: "black", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ color: "white" }}>TV Shows</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,150px)", gap: "10px" }}>
        {tv.map((t) => (
          <div
            key={t.id}
            onClick={() => navigate(`/tv/${t.id}`)} 
            style={{ cursor: "pointer" }}
          >
            <img
              loading="lazy"
              src={`${IMG_BASE_URL}${t.poster_path}`}
              style={{ width: "100%" }}
            />
            <p style={{ color: "white", fontSize: "12px" }}>
              {t.name}
            </p>
          </div>
        ))}
      </div>

      <div ref={observerRef} style={{ height: "40px" }} />
    </div>
  );
};

export default TV;