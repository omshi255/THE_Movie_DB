/* eslint-disable react-hooks/set-state-in-effect */
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
      <div
        style={{
          background: focused
            ? "rgba(255, 255, 255, 0.18)"
            : "rgba(255, 255, 255, 0.10)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: focused
            ? "1.5px solid rgba(255, 255, 255, 0.6)"
            : "1.5px solid rgba(255, 255, 255, 0.25)",
          borderRadius: hasResults || noResults ? "20px 20px 0 0" : "20px",
          boxShadow: focused
            ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)"
            : "0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
          transition: "all 0.3s ease",
          padding: "12px 18px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg
          width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke={focused ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)"}
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ flexShrink: 0, transition: "stroke 0.3s" }}
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
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "white",
            fontSize: "15px",
            fontWeight: 400,
            letterSpacing: "0.2px",
          }}
          className="placeholder-white/40"
        />

        {loading && (
          <div
            className="flex-shrink-0"
            style={{
              width: 16, height: 16,
              border: "2px solid rgba(255,255,255,0.2)",
              borderTop: "2px solid white",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
        )}

        {query && !loading && (
          <button
            onClick={() => { setQuery(""); dispatch(clearResults()); inputRef.current?.focus(); }}
            style={{
              width: 22, height: 22,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", flexShrink: 0,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {hasResults && (
        <div
          style={{
            position: "absolute",
            left: 0, right: 0,
            top: "100%",
            zIndex: 50,
            background: "rgba(10, 15, 30, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "0 0 20px 20px",
            maxHeight: 380,
            overflowY: "auto",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}
        >
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />

          {results.slice(0, 8).map((item, idx) => {
            const title = item.title || item.name || "Unknown";
            const image = item.poster_path || item.profile_path;
            const year =
              (item as SearchResult & { release_date?: string }).release_date?.slice(0, 4) ||
              (item as SearchResult & { first_air_date?: string }).first_air_date?.slice(0, 4);

            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  cursor: "pointer",
                  borderBottom: idx < Math.min(results.length, 8) - 1
                    ? "1px solid rgba(255,255,255,0.05)"
                    : "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{
                  width: 36, height: 48, borderRadius: 8, overflow: "hidden",
                  flexShrink: 0, background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}>
                  <img
                    src={image ? `${IMG_BASE_URL}${image}` : "https://via.placeholder.com/36x48/111/444?text=?"}
                    alt={title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: "white", fontSize: 14, fontWeight: 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{title}</p>
                  {year && (
                    <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 2 }}>
                      {year}
                    </p>
                  )}
                </div>

                {item.media_type && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 1,
                    padding: "2px 6px", borderRadius: 4, flexShrink: 0,
                    color: mediaTypeColor[item.media_type] || "#fff",
                    background: `${mediaTypeColor[item.media_type]}20`,
                    border: `1px solid ${mediaTypeColor[item.media_type]}50`,
                  }}>
                    {item.media_type.toUpperCase()}
                  </span>
                )}
              </div>
            );
          })}

          {results.length > 8 && (
            <p style={{
              textAlign: "center", color: "rgba(255,255,255,0.25)",
              fontSize: 12, padding: "8px 0",
            }}>
              +{results.length - 8} more results
            </p>
          )}
        </div>
      )}

      {noResults && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "100%", zIndex: 50,
          background: "rgba(10,15,30,0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          borderTop: "none",
          borderRadius: "0 0 20px 20px",
          padding: "20px 16px",
          textAlign: "center",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
        }}>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
            No results for "<span style={{ color: "white" }}>{query}</span>"
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;