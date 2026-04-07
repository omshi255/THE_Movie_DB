import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getPopularPeople, resetPeople } from "../features/people/peopleSlice";
import { IMG_BASE_URL } from "../api/tmdb";
import { useNavigate } from "react-router-dom";

type Person = {
  id: number;
  name: string;
  profile_path: string;
  known_for: {
    title?: string;
    name?: string;
  }[];
};

/* ✅ Responsive Skeleton */
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full aspect-[2/3] bg-zinc-800 rounded-lg" />
    <div className="p-2">
      <div className="h-3 bg-zinc-700 rounded w-3/4 mb-1" />
      <div className="h-3 bg-zinc-700 rounded w-1/2" />
    </div>
  </div>
);

const PopularPeople = () => {
  const dispatch = useAppDispatch();
  const { people, loading } = useAppSelector((state) => state.people);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      dispatch(resetPeople());
    };
  }, []);

  useEffect(() => {
    dispatch(getPopularPeople(page));
  }, [dispatch, page]);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        observer.disconnect();
        setPage((prev) => prev + 1);
      }
    });

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const isInitialLoad = loading && people.length === 0;

  return (
    <div className="bg-black min-h-screen px-3 sm:px-5 md:px-8 lg:px-10 py-5">

      {/* Title */}
      <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">
        Popular People
      </h2>

      {/* Grid */}
      <div className="
        grid gap-3 sm:gap-4
        grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        lg:grid-cols-5 
        xl:grid-cols-6 
        2xl:grid-cols-8
      ">

        {/* Cards */}
        {people.map((person: Person) => (
          <div
            key={person.id}
            onClick={() => navigate(`/people/${person.id}`)}
            className="cursor-pointer group"
          >
            <img
              loading="lazy"
              src={
                person.profile_path
                  ? `${IMG_BASE_URL}${person.profile_path}`
                  : "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={person.name}
              className="
                w-full aspect-[2/3] object-cover rounded-lg
                transition-transform duration-300 
                group-hover:scale-105
              "
            />

            <div className="mt-1">
              <p className="text-white text-[10px] sm:text-xs md:text-sm font-medium">
                {person.name}
              </p>

              <p className="
                text-gray-400 text-[9px] sm:text-xs 
                line-clamp-2
              ">
                {person.known_for
                  ?.map((item) => item.title || item.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        ))}

        {/* Initial Skeleton */}
        {isInitialLoad &&
          Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {/* Load More Skeleton */}
        {!isInitialLoad && loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
      </div>

      {/* Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-[50px]" />
    </div>
  );
};

export default PopularPeople;