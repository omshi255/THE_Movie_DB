// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { lazy, Suspense, useEffect, useRef, useState, useCallback } from "react";
// import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
// import { getMovies } from "../features/movies/movieSlice";
// import MovieCard from "../components/MovieCard";
// import { IMG_BASE_URL } from "../api/tmdb";

// const HeroBanner = lazy(() => import("../components/HeroBanner"));
// const TrendingSection = lazy(() => import("../components/TrendingSection"));
// const PopularSection = lazy(() => import("../components/PopularSection"));

// // Lazy image card — only renders image when visible
// const LazyMovieCard = ({ movie, imgBaseUrl }: { movie: any; imgBaseUrl: string }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect(); // once visible, stop observing
//         }
//       },
//       { threshold: 0.1, rootMargin: "100px" }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div ref={ref} className="min-w-[180px]">
//       {visible ? (
//         <MovieCard movie={movie} imgBaseUrl={imgBaseUrl} />
//       ) : (
//         // Skeleton placeholder jab tak card visible nahi
//         <div className="w-[180px] h-[270px] bg-gray-800 rounded-lg animate-pulse" />
//       )}
//     </div>
//   );
// };

// const Home = () => {
//   const dispatch = useAppDispatch();
//   const { movies, loading, error } = useAppSelector((state) => state.movie);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     dispatch(getMovies({ page: 1, category: "popular" }));
//   }, [dispatch]);

//   const scrollLeft = useCallback(() => {
//     scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
//   }, []);

//   const scrollRight = useCallback(() => {
//     scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
//   }, []);

//   return (
//     <>
//       <Suspense fallback={<div className="text-white p-10">Loading Banner...</div>}>
//         <HeroBanner />
//       </Suspense>

//       <div className="p-4 bg-black min-h-screen">
//         <h1 className="text-2xl font-bold mb-6 text-white">Top 10 Popular Movies</h1>

//         {loading && (
//           // Skeleton row while fetching
//           <div className="flex gap-4 px-10">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div key={i} className="min-w-[180px] h-[270px] bg-gray-800 rounded-lg animate-pulse" />
//             ))}
//           </div>
//         )}

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         {!loading && (
//           <div className="relative group">
//             <button
//               onClick={scrollLeft}
//               className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="15 18 9 12 15 6" />
//               </svg>
//             </button>

//             <div
//               ref={scrollRef}
//               className="flex gap-4 overflow-x-auto pb-4 px-10"
//               style={{
//                 scrollbarWidth: "none",
//                 scrollSnapType: "x mandatory",   // snap to cards
//                 WebkitOverflowScrolling: "touch", // iOS momentum scroll
//               }}
//             >
//               {movies.slice(0, 10).map((movie: any) => (
//                 <div
//                   key={movie.id}
//                   style={{ scrollSnapAlign: "start" }} // each card snaps
//                 >
//                   <LazyMovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
//                 </div>
//               ))}
//             </div>

//             <button
//               onClick={scrollRight}
//               className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-9 h-9 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//             >
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <polyline points="9 18 15 12 9 6" />
//               </svg>
//             </button>
//           </div>
//         )}

//         <Suspense fallback={<div className="text-white">Loading Trending...</div>}>
//           <TrendingSection />
//         </Suspense>

//         <Suspense fallback={<div className="text-white">Loading Popular...</div>}>
//           <PopularSection />
//         </Suspense>
//       </div>
//     </>
//   );
// };

// export default Home;


/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getMovies } from "../features/movies/movieSlice";
import MovieCard from "../components/MovieCard";
import { IMG_BASE_URL } from "../api/tmdb";
import { ChevronLeft, ChevronRight } from "lucide-react"; // ✅ icons

const HeroBanner = lazy(() => import("../components/HeroBanner"));
const TrendingSection = lazy(() => import("../components/TrendingSection"));
const PopularSection = lazy(() => import("../components/PopularSection"));

/* ✅ Responsive Card */
const LazyMovieCard = ({ movie, imgBaseUrl }: { movie: any; imgBaseUrl: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px]">
      {visible ? (
        <MovieCard movie={movie} imgBaseUrl={imgBaseUrl} />
      ) : (
        <div className="w-full h-[200px] sm:h-[230px] md:h-[270px] bg-gray-800 rounded-lg animate-pulse" />
      )}
    </div>
  );
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { movies, loading, error } = useAppSelector((state) => state.movie);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getMovies({ page: 1, category: "popular" }));
  }, [dispatch]);

  const scrollLeft = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  }, []);

  return (
    <>
      <Suspense fallback={<div className="text-white p-6">Loading Banner...</div>}>
        <HeroBanner />
      </Suspense>

      <div className="bg-black min-h-screen px-4 sm:px-6 md:px-10 py-6">

        {/* Title */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 text-white">
          Top 10 Popular Movies
        </h1>

        {/* Skeleton */}
        {loading && (
          <div className="flex gap-3 sm:gap-4 overflow-x-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] h-[200px] sm:h-[230px] md:h-[270px] bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Slider */}
        {!loading && (
          <div className="relative">

            {/* LEFT ARROW (VISIBLE ALWAYS) */}
            <button
              onClick={scrollLeft}
              className="flex absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 items-center justify-center opacity-80"
            >
              <ChevronLeft size={18} />
            </button>

            {/* SCROLL AREA */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scroll-smooth"
              style={{
                scrollbarWidth: "none",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {movies.slice(0, 10).map((movie: any) => (
                <div key={movie.id} style={{ scrollSnapAlign: "start" }}>
                  <LazyMovieCard movie={movie} imgBaseUrl={IMG_BASE_URL} />
                </div>
              ))}
            </div>

            {/* RIGHT ARROW (VISIBLE ALWAYS) */}
            <button
              onClick={scrollRight}
              className="flex absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black text-white rounded-full w-8 h-8 sm:w-9 sm:h-9 items-center justify-center opacity-80"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <Suspense fallback={<div className="text-white">Loading Trending...</div>}>
          <TrendingSection />
        </Suspense>

        <Suspense fallback={<div className="text-white">Loading Popular...</div>}>
          <PopularSection />
        </Suspense>
      </div>
    </>
  );
};

export default Home;