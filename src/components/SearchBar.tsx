import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMG_BASE_URL } from "../api/tmdb";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { searchQuery, clearResults } from "../features/search/searchSlice";
import type { SearchResult } from "../features/search/searchSlice";

const mediaTypeColor: Record<string, string> = {
  movie: "#01b4e4",
  tv: "#90cea1",
  person: "#e4a001",
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focused, setFocused] = useState(false);

  const dispatch = useAppDispatch();
  const { results, loading } = useAppSelector((state) => state.search);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResult) => {
    setQuery("");
    dispatch(clearResults());
    setShowDropdown(false);
    if (item.media_type === "movie") navigate(`/movie/${item.id}`);
    else if (item.media_type === "tv") navigate(`/tv/${item.id}`);
    else if (item.media_type === "person") navigate(`/people/${item.id}`);
  };

  const hasResults = showDropdown && results.length > 0;
  const noResults = showDropdown && !loading && results.length === 0 && query.trim();

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: focused ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
          border: focused ? "1.5px solid rgba(1,180,228,0.8)" : "1.5px solid rgba(255,255,255,0.15)",
          borderRadius: hasResults || noResults ? "12px 12px 0 0" : "12px",
          boxShadow: focused ? "0 0 0 3px rgba(1,180,228,0.15)" : "none",
        }}
      >
        {/* Search icon */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={focused ? "#01b4e4" : "rgba(255,255,255,0.4)"}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "stroke 0.2s" }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search movies, shows, people..."
          className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/40"
        />

        {/* Spinner */}
        {loading && (
          <div className="w-4 h-4 border-2 border-white/20 border-t-[#01b4e4] rounded-full animate-spin flex-shrink-0" />
        )}

        {/* Clear button */}
        {query && !loading && (
          <button
            onClick={() => { setQuery(""); dispatch(clearResults()); inputRef.current?.focus(); }}
            className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown */}
      {hasResults && (
        <div
          className="absolute left-0 right-0 z-50 overflow-y-auto"
          style={{
            top: "100%",
            background: "rgba(10,12,20,0.97)",
            border: "1.5px solid rgba(1,180,228,0.3)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
            maxHeight: "380px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
          }}
        >
          <div className="h-px bg-white/5 mx-4" />
          {results.slice(0, 8).map((item, idx) => {
            const title = item.title || item.name || "Unknown";
            const image = item.poster_path || item.profile_path;
            const year = (item as SearchResult & { release_date?: string }).release_date?.slice(0, 4)
              || (item as SearchResult & { first_air_date?: string }).first_air_date?.slice(0, 4);

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-[#01b4e4]/10 transition-colors"
                style={{ borderBottom: idx < results.slice(0, 8).length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
              >
                {/* Poster */}
                <div className="w-9 h-12 rounded-md overflow-hidden flex-shrink-0 bg-white/5 border border-white/10">
                  <img
                    src={image ? `${IMG_BASE_URL}${image}` : "https://via.placeholder.com/36x48/111/444?text=?"}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{title}</p>
                  {year && <p className="text-white/40 text-xs mt-0.5">{year}</p>}
                </div>

                {/* Type badge */}
                {item.media_type && (
                  <span
                    className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      color: mediaTypeColor[item.media_type] || "#fff",
                      background: `${mediaTypeColor[item.media_type]}20`,
                      border: `1px solid ${mediaTypeColor[item.media_type]}40`,
                    }}
                  >
                    {item.media_type.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}

          {results.length > 8 && (
            <p className="text-center text-white/30 text-xs py-2">
              +{results.length - 8} more results
            </p>
          )}
        </div>
      )}

      {/* No results */}
      {noResults && (
        <div
          className="absolute left-0 right-0 z-50 px-4 py-5 text-center"
          style={{
            top: "100%",
            background: "rgba(10,12,20,0.97)",
            border: "1.5px solid rgba(1,180,228,0.3)",
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <p className="text-white/30 text-sm">
            No results for "<span className="text-white">{query}</span>"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;