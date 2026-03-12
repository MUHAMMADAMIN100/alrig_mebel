import { useEffect, useRef, useState } from "react";

/**
 * Раннее появление блока без «пустоты»:
 * - rootMargin срабатывает за 240px до вьюпорта
 * - один раз: unobserve после первого входа
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "240px 0px 240px 0px",
        threshold: 0.01,
      }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, isVisible };
}
