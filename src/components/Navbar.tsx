import { useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
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

        <div className="flex gap-6">
          
          <span
            onClick={() => navigate("/movies")}
            className="cursor-pointer hover:text-gray-300"
          >
            Movies
          </span>

          <span
            onClick={() => navigate("/tv")}
            className="cursor-pointer hover:text-gray-300"
          >
            TV Shows
          </span>

          <span
            onClick={() => navigate("/people")}
            className="cursor-pointer hover:text-gray-300"
          >
            People
          </span>
        </div>
      </div>

      
      <SearchBar />

    </nav>
  );
};

export default Navbar;