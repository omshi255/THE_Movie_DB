import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMovies, IMG_BASE_URL } from "../api/tmdb";

const Movies = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchMovies(page);
      setMovies((prev) => [...prev, ...(data.results || [])]);
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
      <h2 style={{ color: "white" }}>Movies</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,150px)", gap: "10px" }}>
        {movies.map((m) => (
          <div
            key={m.id}
            onClick={() => navigate(`/movie/${m.id}`)} // ✅ CLICK FIX
            style={{ cursor: "pointer" }}
          >
            <img
              loading="lazy"
              src={`${IMG_BASE_URL}${m.poster_path}`}
              style={{ width: "100%" }}
            />
            <p style={{ color: "white", fontSize: "12px" }}>
              {m.title}
            </p>
          </div>
        ))}
      </div>

      <div ref={observerRef} style={{ height: "40px" }} />
    </div>
  );
};

export default Movies;