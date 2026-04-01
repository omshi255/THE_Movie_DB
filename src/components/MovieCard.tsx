import { useNavigate } from "react-router-dom";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
};

type Props = {
  movie: Movie;
  imgBaseUrl: string;
};

const MovieCard = ({ movie, imgBaseUrl }: Props) => {
  const navigate = useNavigate();

  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;

  return (
    <div
      onClick={() => {
        console.log("clicked", movie.id);
        navigate(`/movie/${movie.id}`);
      }}
      className="cursor-pointer"
    >
      <img
      loading="lazy"
        src={
          movie.poster_path
            ? `${imgBaseUrl}${movie.poster_path}`
            : "https://via.placeholder"
        }
        alt={title}
        className="w-full h-72 object-cover"
      />

      <div className="p-3">
        <h2 className="text-white font-semibold text-sm truncate">
          {title}
        </h2>

        <div className="flex justify-between text-white text-xs mt-1">
          <span> {movie.vote_average}</span>
          <span>{date?.slice(0, 4)}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;