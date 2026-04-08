import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface DropdownItem {
  label: string;
  path: string;
}

interface NavItemProps {
  label: string;
  onClick?: () => void;
  dropdown?: DropdownItem[];
  isMobile?: boolean;
  closeMenu?: () => void; 
}

const NavItem = ({
  label,
  onClick,
  dropdown,
  isMobile = false,
  closeMenu,
}: NavItemProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Normal item (no dropdown)
  if (!dropdown) {
    return (
      <span
        onClick={() => {
          onClick?.();
          closeMenu?.();
        }}
        className="cursor-pointer hover:text-gray-300 text-sm font-medium block py-2"
      >
        {label}
      </span>
    );
  }

  return (
    <div ref={ref} className="relative w-full md:w-auto">
      <span
        onClick={() => setOpen((prev) => !prev)}
        className="cursor-pointer hover:text-gray-300 text-sm font-medium block py-2"
      >
        {label}
      </span>

      {open && (
        <div
          className={`${
            isMobile
              ? "relative bg-[#1a1a2e] mt-2"
              : "absolute top-8 left-0 bg-[#1a1a2e]"
          } text-white rounded shadow-lg min-w-[160px] z-50 overflow-hidden`}
        >
          {dropdown.map((item) => (
            <div
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
                closeMenu?.(); 
              }}
              className="px-4 py-2 text-sm hover:bg-[#032541] cursor-pointer border-b border-gray-700 last:border-none"
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
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <nav className="bg-[#032541] text-white px-4 md:px-10 py-4">
      <div className="flex items-center justify-between">

        
       <div
  onClick={() => navigate("/")}
  className="flex items-center gap-2 cursor-pointer"
>
  <img
    src="/favicon.ico"
    alt="logo"
    className="w-8 h-8 md:w-9 md:h-9 rounded-md"
  />

  <h1 className="text-xl md:text-2xl font-bold text-green-400">
    CineSpark
  </h1>
</div>

        <div className="hidden md:flex gap-6 items-center">
          <NavItem
            label="Movies"
            dropdown={[
              { label: "Popular", path: "/movies?category=popular" },
              { label: "Now Playing", path: "/movies?category=now_playing" },
              { label: "Upcoming", path: "/movies?category=upcoming" },
              { label: "Top Rated", path: "/movies?category=top_rated" },
            ]}
          />

          <NavItem
            label="TV Shows"
            dropdown={[
              { label: "Popular", path: "/tv?category=popular" },
              { label: "Top Rated", path: "/tv?category=top_rated" },
              { label: "On TV", path: "/tv?category=on_the_air" },
              { label: "Airing Today", path: "/tv?category=airing_today" },
            ]}
          />

          <NavItem
            label="People"
            onClick={() => navigate("/people")}
          />
        </div>

        {/* Hamburger */}
        <div
          className="md:hidden cursor-pointer text-xl"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-2 bg-[#021c30] p-4 rounded">

          <NavItem
            label="Movies"
            isMobile
            closeMenu={() => setMenuOpen(false)}
            dropdown={[
              { label: "Popular", path: "/movies?category=popular" },
              { label: "Now Playing", path: "/movies?category=now_playing" },
              { label: "Upcoming", path: "/movies?category=upcoming" },
              { label: "Top Rated", path: "/movies?category=top_rated" },
            ]}
          />

          <NavItem
            label="TV Shows"
            isMobile
            closeMenu={() => setMenuOpen(false)}
            dropdown={[
              { label: "Popular", path: "/tv?category=popular" },
              { label: "Top Rated", path: "/tv?category=top_rated" },
              { label: "On TV", path: "/tv?category=on_the_air" },
              { label: "Airing Today", path: "/tv?category=airing_today" },
            ]}
          />

          <NavItem
            label="People"
            closeMenu={() => setMenuOpen(false)}
            onClick={() => navigate("/people")}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;