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

const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="w-full h-[200px] bg-zinc-800 rounded-md" />
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
    <div className="p-5 bg-black min-h-screen">
      <h2 className="text-white text-xl mb-5">Popular People</h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
        {/* Real cards */}
        {people.map((person: Person) => (
          <div
            key={person.id}
            className="cursor-pointer"
            onClick={() => navigate(`/people/${person.id}`)}
          >
            <img
              loading="lazy"
              src={
                person.profile_path
                  ? `${IMG_BASE_URL}${person.profile_path}`
                  : "https://via.placeholder.com/150x200?text=No+Image"
              }
              className="w-full h-[200px] object-cover rounded-md"
            />
            <div className="p-2">
              <p className="text-white text-sm">{person.name}</p>
              <p className="text-gray-400 text-xs">
                {person.known_for?.map((item) => item.title || item.name).join(", ")}
              </p>
            </div>
          </div>
        ))}

        {/* Initial load skeletons */}
        {isInitialLoad &&
          Array.from({ length: 18 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}

        {/* Pagination skeletons */}
        {!isInitialLoad && loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`more-${i}`} />
          ))}
      </div>

      <div ref={observerRef} className="h-[50px]" />
    </div>
  );
};

export default PopularPeople;