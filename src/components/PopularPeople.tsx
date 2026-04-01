import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { getPopularPeople } from "../features/people/peopleSlice";
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

const PopularPeople = () => {
  const dispatch = useAppDispatch();
  const { people, loading } = useAppSelector((state) => state.people);
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement | null>(null);

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

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="p-5 bg-black min-h-screen">
      <h2 className="text-white text-xl mb-5">Popular People</h2>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
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
              className="w-full h-[200px] object-cover"
            />

            <div className="p-2">
              <p className="text-white text-sm">{person.name}</p>

              <p className="text-gray-400 text-xs">
                {person.known_for
                  ?.map((item) => item.title || item.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-[50px]" />

      {loading && (
        <p className="text-white text-center mt-4">Loading...</p>
      )}
    </div>
  );
};

export default PopularPeople;