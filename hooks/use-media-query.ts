import { useEffect, useState } from "react";

const getInitialMatch = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(max-width: 768px)").matches
    : false;

export function useMediaQuery() {
  const [isOpen, setIsOpen] = useState(getInitialMatch);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handler = (e: MediaQueryListEvent) => {
      setIsOpen(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return { isOpen };
}
