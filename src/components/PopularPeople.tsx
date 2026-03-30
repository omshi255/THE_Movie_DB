import { useEffect, useState, useRef } from "react";
import { fetchPopularPeople, IMG_BASE_URL } from "../api/tmdb";

const PopularPeople = () => {
  const [people, setPeople] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 🔥 Fetch data
  const loadPeople = async () => {
    setLoading(true);

    const data = await fetchPopularPeople(page);

    setPeople((prev) => [...prev, ...(data?.results || [])]);

    setLoading(false);
  };

  useEffect(() => {
    loadPeople();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        setPage((prev) => prev + 1);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading]);

  return (
    <div style={{ padding: "20px", background: "black", minHeight: "100vh" }}>
      
      <h2 style={{ color: "white", marginBottom: "20px" }}>
        Popular People
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "16px",
        }}
      >
        {people.map((person) => (
          <div key={person.id} style={{ background: "#1f1f1f" }}>
            
            <img
              loading="lazy"
              src={
                person.profile_path
                  ? `${IMG_BASE_URL}${person.profile_path}`
                  : "https://via.placeholder.com/150"
              }
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />

            <div style={{ padding: "8px" }}>
              <p style={{ color: "white", fontSize: "14px" }}>
                {person.name}
              </p>

              <p style={{ color: "gray", fontSize: "12px" }}>
                {person.known_for
                  ?.map((item: any) => item.title || item.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div ref={observerRef} style={{ height: "50px" }} />

      {loading && (
        <p style={{ color: "white", textAlign: "center" }}>
          Loading...
        </p>
      )}
    </div>
  );
};

export default PopularPeople;