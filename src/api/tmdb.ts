const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const IMG_BASE_URL = "https://image.tmdb.org/t/p/w300";


export const fetchPopularMovies = async (page: number) => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  return res.json();
};
export const fetchTVDetails = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}`
  );
  return res.json();
};
export const fetchTrendingMovies = async (
  time: "day" | "week"
) => {
  const res = await fetch(
    `${BASE_URL}/trending/movie/${time}?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchTrendingAll = async () => {
  const res = await fetch(
    `${BASE_URL}/trending/all/day?api_key=${API_KEY}`
  );
  return res.json();
};


export const fetchPopularByType = async (type: string) => {
  let url = "";

  switch (type) {
    case "streaming":
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
      break;

    case "tv":
      url = `${BASE_URL}/tv/popular?api_key=${API_KEY}`;
      break;

    case "rent":
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_watch_monetization_types=rent`;
      break;

    case "theaters":
      url = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`;
      break;

    default:
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}`;
  }

  const res = await fetch(url);
  return res.json();
};


export const fetchMovieDetails = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchMovieCredits = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
  );
  return res.json();
};
export const fetchMovies = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  return res.json();
};

export const fetchTV = async (page = 1) => {
  const res = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
  );
  return res.json();
};
export const fetchSimilarMovies = async (id: string) => {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchPopularPeople = async () => {
  const res = await fetch(
    `${BASE_URL}/person/popular?api_key=${API_KEY}`
  );
  return res.json();
};