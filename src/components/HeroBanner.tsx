import { useEffect, useState } from "react";
import { fetchTrendingAll } from "../api/tmdb";
import SearchBar from "./SearchBar";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string;
}

const HeroBanner = () => {
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getBanner = async () => {
      const data = await fetchTrendingAll();
      const withBackdrop = data.results.filter((m: Movie) => m.backdrop_path);
      const random = withBackdrop[Math.floor(Math.random() * withBackdrop.length)];
      setMovie(random);
    };
    getBanner();
  }, []);

  if (!movie) return (
    <div className="w-full h-[400px] bg-gray-900 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>
  );

  const title = movie.title || movie.name || "";

  return (
    <div className="relative w-full h-[500px] bg-gray-900  ">
      {/* Background Image */}
      <img
        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4 px-10 pt-16">
        <p className="text-gray-300 text-sm uppercase tracking-widest">Welcome</p>
        <h1 className="text-white text-5xl font-bold drop-shadow-lg text-center">{title}</h1>
        <div className="w-full max-w-xl">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;