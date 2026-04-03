import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DropdownItem {
  label: string;
  path: string;
}

interface NavItemProps {
  label: string;
  onClick?: () => void;
  dropdown?: DropdownItem[];
}

const NavItem = ({ label, onClick, dropdown }: NavItemProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigate = useNavigate();

  if (!dropdown) {
    return (
      <span
        onClick={onClick}
        className="cursor-pointer hover:text-gray-300 text-sm font-medium"
      >
        {label}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative">
      <span
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer hover:text-gray-300 text-sm font-medium select-none"
      >
        {label}
      </span>

{open && (
  <div className="absolute top-8 left-0 bg-[#1a1a2e] text-white rounded shadow-lg min-w-[160px] z-50 overflow-hidden">
    {dropdown.map((item) => (
      <div
        key={item.path}
        onClick={() => {
          navigate(item.path);
          setOpen(false);
        }}
        className="px-4 py-2 text-sm hover:bg-[#032541] hover:text-white cursor-pointer border-b border-gray-700 last:border-none"
      >
        {item.label}
      </div>
    ))}
  </div>
)}
    </div>
  );
};

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-[#032541] text-white px-10 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">

        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-green-400 cursor-pointer"
        >
          TMDB
        </h1>

        {/* Nav Links */}
        <div className="flex gap-6 items-center">

          <NavItem
            label="Movies"
            dropdown={[
              { label: "Popular",     path: "/movies?category=popular" },
              { label: "Now Playing", path: "/movies?category=now_playing" },
              { label: "Upcoming",    path: "/movies?category=upcoming" },
              { label: "Top Rated",   path: "/movies?category=top_rated" },
            ]}
          />

          <NavItem
            label="TV Shows"
            onClick={() => navigate("/tv")}
            dropdown={[
              { label: "Popular",      path: "/tv?category=popular" },
              { label: "Top Rated",    path: "/tv?category=top_rated" },
              { label: "On TV",        path: "/tv?category=on_the_air" },
              { label: "Airing Today", path: "/tv?category=airing_today" },
            ]}
          />

          <NavItem
            label="People"
            onClick={() => navigate("/people")}
          />

        </div>
      </div>
    </nav>
  );
};

export default Navbar;