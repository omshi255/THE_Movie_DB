import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE_URL } from "../api/tmdb";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { searchQuery, clearResults } from "../features/search/searchSlice";
import type { SearchResult } from "../features/search/searchSlice";
const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useAppDispatch();
  const { results, loading } = useAppSelector((state) => state.search);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearResults());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowDropdown(false);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      dispatch(searchQuery(query));
      setShowDropdown(true);
    }, 300); 

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResult) => {
    setQuery("");
    dispatch(clearResults());
    setShowDropdown(false);

    if (item.media_type === "movie") {
      navigate(`/movie/${item.id}`);
    } else if (item.media_type === "tv") {
      navigate(`/tv/${item.id}`);
    } else if (item.media_type === "person") {
      navigate(`/people/${item.id}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-72">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full p-2 bg-gray-700 text-white rounded"
      />

      {showDropdown && (
        <div className="absolute w-full bg-black mt-1 rounded">
          {loading && <p className="p-2 text-gray-400">Loading...</p>}

          {results.map((item) => {
            const title = item.title || item.name;
            const image = item.poster_path || item.profile_path;

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex gap-2 p-2 cursor-pointer hover:bg-gray-800"
              >
                <img
                  src={
                    image
                      ? `${IMG_BASE_URL}${image}`
                      : "https://via.placeholder.com/50"
                  }
                  className="w-10 h-12 object-cover"
                />
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SearchBar;