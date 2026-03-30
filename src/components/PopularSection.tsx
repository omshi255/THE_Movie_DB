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
    <div className="mt-5">
      
      <div className="mb-3 text-white ">
        {["streaming", "tv", "rent", "theaters"].map((tab) => (
          <button
            key={tab}
            onClick={() => dispatch(setType(tab))}
            className={`mr-2 px-3 py-1 cursor-pointer border-1
              ${
                type === tab
                 
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto">
        {movies.map((movie: any) => (
          <div key={movie.id} className="min-w-[150px]">
            <MovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSection;