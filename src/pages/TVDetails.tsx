import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchTVDetails, IMG_BASE_URL } from "../api/tmdb";

interface TVDetailsType {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
}

const TVDetails = () => {
  const { id } = useParams();
  const [tv, setTv] = useState<TVDetailsType | null>(null);

  useEffect(() => {
    const loadDetails = async () => {
      if (!id) return;

      const data = await fetchTVDetails(id);
      setTv(data);
    };

    loadDetails();
  }, [id]);

  if (!tv) return <p className="text-white p-5">Loading...</p>;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* BACKDROP */}
      <div
        className="h-[60vh] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: `url(${IMG_BASE_URL}${tv.backdrop_path})`,
        }}
      >
        <div className="bg-black/70 w-full p-5">
          <h1 className="text-3xl font-bold">{tv.name}</h1>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 flex gap-5">
        <img
          src={`${IMG_BASE_URL}${tv.poster_path}`}
          className="w-[200px] rounded"
        />

        <div>
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-gray-300">{tv.overview}</p>
        </div>
      </div>
    </div>
  );
};

export default TVDetails;