import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getPopular, setType } from "../features/popular/popularSlice";
import MovieCard from "./MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";

const PopularSection = () => {
  const dispatch = useAppDispatch();
  const { movies, type } = useAppSelector((state) => state.popular);

  useEffect(() => {
    dispatch(getPopular(type));
  }, [dispatch, type]);

  return (
    <div style={{ marginTop: "20px" }}>
      
   
      <div style={{ marginBottom: "10px" }}>
        {["streaming", "tv", "rent", "theaters"].map((tab) => (
          <button
            key={tab}
            onClick={() => dispatch(setType(tab))}
            style={{
              marginRight: "8px",
              padding: "5px 10px",
              cursor: "pointer",
              background: type === tab ? "white" : "#333",
              color: type === tab ? "black" : "white",
              border: "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Movies */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto" }}>
        {movies.map((movie: any) => (
          <div key={movie.id} style={{ minWidth: "150px" }}>
            <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSection;