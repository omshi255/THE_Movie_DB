import { useEffect, useRef, useState } from "react";

const LazyImage = ({
  src,
  alt,
  className,
  placeholder = "https://via.placeholder.com/300x450",
}: {
  src: string;
  alt?: string;
  className?: string;
  placeholder?: string;
}) => {
  const ref = useRef<HTMLImageElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={visible ? src : placeholder}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

export default LazyImage;