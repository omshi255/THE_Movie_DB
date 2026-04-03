
// import axios from "axios";

// const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// export const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";
// const api = axios.create({
//   baseURL: "https://api.themoviedb.org/3",
//   params: {
//     api_key: API_KEY,
//   },
// });
// interface Movie {
//   id: number;
//   title: string;
//   poster_path: string;
// }

// interface MoviesResponse {
//   results: Movie[];
// }
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("API Error:", error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export const fetchPopularMovies = async (page: number) => {
//   const res = await api.get("/movie/popular", {
//     params: { page },
//   });
//   return res.data;
// };

// export const fetchTVDetails = async (id: string) => {
//   const res = await api.get(`/tv/${id}`);
//   return res.data;
// };

// export const fetchTrendingMovies = async (time: "day" | "week") => {
//   const res = await api.get(`/trending/movie/${time}`);
//   return res.data;
// };

// export const fetchTrendingAll = async () => {
//   const res = await api.get(`/trending/all/day`);
//   return res.data;
// };

// export const fetchPopularByType = async (type: string) => {
//   let url = "";
//   let params = {};

//   switch (type) {
//     case "streaming":
//       url = "/movie/popular";
//       break;

//     case "tv":
//       url = "/tv/popular";
//       break;

//     case "rent":
//       url = "/discover/movie";
//       params = { with_watch_monetization_types: "rent" };
//       break;

//     case "theaters":
//       url = "/movie/now_playing";
//       break;

//     default:
//       url = "/movie/popular";
//   }

//   const res = await api.get(url, { params });
//   return res.data;
// };

// export const fetchMovieDetails = async (id: string) => {
//   const res = await api.get(`/movie/${id}`);
//   return res.data;
// };

// export const fetchMovieCredits = async (id: string) => {
//   const res = await api.get(`/movie/${id}/credits`);
//   return res.data;
// };

// export const fetchMovies = async (page = 1): Promise<MoviesResponse> => {
//   const res = await api.get("/movie/popular", {
//     params: { page },
//   });
//   return res.data;
// };
// export const fetchTV = async (page = 1): Promise<MoviesResponse> => {
//   const res = await api.get("/tv/popular", {
//     params: { page },
//   });
//   return res.data;
// };

// export const fetchSimilarMovies = async (id: string) => {
//   const res = await api.get(`/movie/${id}/similar`);
//   return res.data;
// };

// export const fetchPopularPeople = async (page = 1) => {
//   const res = await api.get("/person/popular", {
//     params: { page },
//   });
//   return res.data;
// };

// export const searchMulti = async (query: string) => {
//   const res = await api.get("/search/multi", {
//     params: { query, include_adult: false },
//   });
//   return res.data;
// };

// export const fetchTVCredits = async (id: string) => {
//   const res = await api.get(`/tv/${id}/credits`);
//   return res.data;
// };

// export const fetchSimilarTV = async (id: string) => {
//   const res = await api.get(`/tv/${id}/similar`);
//   return res.data;
// };

// export const fetchPersonDetails = async (id: string) => {
//   const res = await api.get(`/person/${id}`);
//   return res.data;
// };

// export const fetchPersonMovieCredits = async (id: string) => {
//   const res = await api.get(`/person/${id}/movie_credits`);
//   return res.data;
// };

// export const fetchMoviesByCategory = async (category: string, page = 1) => {
//   const validCategories = ["popular", "now_playing", "upcoming", "top_rated"];
//   const endpoint = validCategories.includes(category) ? category : "popular";
//   const res = await api.get(`/movie/${endpoint}`, { params: { page } });
//   return res.data;
// };

// export const fetchTVByCategory = async (category: string, page = 1) => {
//   const validCategories = ["popular", "airing_today", "on_the_air", "top_rated"];
//   const endpoint = validCategories.includes(category) ? category : "popular";
//   const res = await api.get(`/tv/${endpoint}`, { params: { page } });
//   return res.data;
// };
import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

export const api = axios.create({   // ← added export here
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
  },
});

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MoviesResponse {
  results: Movie[];
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchPopularMovies = async (page: number) => {
  const res = await api.get("/movie/popular", { params: { page } });
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

export const fetchMovies = async (page = 1): Promise<MoviesResponse> => {
  const res = await api.get("/movie/popular", { params: { page } });
  return res.data;
};

export const fetchTV = async (page = 1): Promise<MoviesResponse> => {
  const res = await api.get("/tv/popular", { params: { page } });
  return res.data;
};

export const fetchSimilarMovies = async (id: string) => {
  const res = await api.get(`/movie/${id}/similar`);
  return res.data;
};

export const fetchPopularPeople = async (page = 1) => {
  const res = await api.get("/person/popular", { params: { page } });
  return res.data;
};

export const searchMulti = async (query: string) => {
  const res = await api.get("/search/multi", {
    params: { query, include_adult: false },
  });
  return res.data;
};

export const fetchTVCredits = async (id: string) => {
  const res = await api.get(`/tv/${id}/credits`);
  return res.data;
};

export const fetchSimilarTV = async (id: string) => {
  const res = await api.get(`/tv/${id}/similar`);
  return res.data;
};

export const fetchPersonDetails = async (id: string) => {
  const res = await api.get(`/person/${id}`);
  return res.data;
};

export const fetchPersonMovieCredits = async (id: string) => {
  const res = await api.get(`/person/${id}/movie_credits`);
  return res.data;
};

export const fetchMoviesByCategory = async (category: string, page = 1) => {
  const validCategories = ["popular", "now_playing", "upcoming", "top_rated"];
  const endpoint = validCategories.includes(category) ? category : "popular";
  const res = await api.get(`/movie/${endpoint}`, { params: { page } });
  return res.data;
};

export const fetchTVByCategory = async (category: string, page = 1) => {
  const validCategories = ["popular", "airing_today", "on_the_air", "top_rated"];
  const endpoint = validCategories.includes(category) ? category : "popular";
  const res = await api.get(`/tv/${endpoint}`, { params: { page } });
  return res.data;
};