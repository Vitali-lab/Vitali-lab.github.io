import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/* Rise on reveal. The hidden state only appears once this component is on the
   page: with scripting off everything is simply there. One observer per item
   is fine here — there are fewer than twenty, and each unobserves itself. */
export function Rise({
  as: Tag = "div",
  i = 0,
  className = "",
  id,
  ariaHidden,
  children,
  style,
}: {
  as?: ElementType;
  i?: number;
  className?: string;
  id?: string;
  ariaHidden?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [lit, setLit] = useState(() => typeof window !== "undefined" && !("IntersectionObserver" in window));
  const shown = lit || reduced;

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    const start = () => {
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io?.disconnect();
          setLit(true);
        });
      }, { rootMargin: "100000px 0px 0px 0px" });
      io.observe(el);
    };
    if (document.body.classList.contains("revealed")) start();
    else document.addEventListener("revealed", start, { once: true });
    return () => {
      document.removeEventListener("revealed", start);
      io?.disconnect();
    };
  }, [reduced]);

  return (
    <Tag
      ref={ref}
      id={id}
      aria-hidden={ariaHidden || undefined}
      data-rise=""
      className={shown ? `${className} lit` : className}
      style={{ "--rise-i": i, ...style } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
