
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG_BASE_URL = "https://image.tmdb.org/t/p/w300";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchPopularMovies = async (page: number) => {
  const res = await api.get("/movie/popular", {
    params: { page },
  });
  return res.data;
};

export const fetchTVDetails = async (id: string) => {
  const res = await api.get(`/tv/${id}`);
  return res.data;
};

export const fetchTrendingMovies = async (time: "day" | "week") => {
  const res = await api.get(`/trending/movie/${time}`);
  return res.data;
};

export const fetchTrendingAll = async () => {
  const res = await api.get(`/trending/all/day`);
  return res.data;
};

export const fetchPopularByType = async (type: string) => {
  let url = "";
  let params = {};

  switch (type) {
    case "streaming":
      url = "/movie/popular";
      break;

    case "tv":
      url = "/tv/popular";
      break;

    case "rent":
      url = "/discover/movie";
      params = { with_watch_monetization_types: "rent" };
      break;

    case "theaters":
      url = "/movie/now_playing";
      break;

    default:
      url = "/movie/popular";
  }

  const res = await api.get(url, { params });
  return res.data;
};

export const fetchMovieDetails = async (id: string) => {
  const res = await api.get(`/movie/${id}`);
  return res.data;
};

export const fetchMovieCredits = async (id: string) => {
  const res = await api.get(`/movie/${id}/credits`);
  return res.data;
};

export const fetchMovies = async (page = 1) => {
  const res = await api.get("/movie/popular", {
    params: { page },
  });
  return res.data;
};

export const fetchTV = async (page = 1) => {
  const res = await api.get("/tv/popular", {
    params: { page },
  });
  return res.data;
};

export const fetchSimilarMovies = async (id: string) => {
  const res = await api.get(`/movie/${id}/similar`);
  return res.data;
};

export const fetchPopularPeople = async (page = 1) => {
  const res = await api.get("/person/popular", {
    params: { page },
  });
  return res.data;
};