import { useEffect, useState } from "react";
import { fetchTrendingAll, IMG_BASE_URL } from "../api/tmdb";

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

      const random =
        data.results[
          Math.floor(Math.random() * data.results.length)
        ];

      setMovie(random);
    };

    getBanner();
  }, []);

  if (!movie) return null;

  const title = movie.title || movie.name || "No Title";
  const bg = movie.backdrop_path;

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: bg
          ? `url(${IMG_BASE_URL}${bg})`
          : "none",
      }}
    >
      <div className="bg-black/60 w-full h-full flex flex-col justify-center px-10">
        <h2 className="text-white text-2xl font-bold">Welcome</h2>

        <h1 className="text-white text-4xl font-bold">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeroBanner;