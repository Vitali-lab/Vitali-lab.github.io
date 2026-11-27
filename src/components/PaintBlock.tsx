import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

/* A block that paints itself in on scroll: the base is the opposite tone,
   then three blurred blobs of the target colour merge into it (the goo filter
   makes the edge liquid, like the header) and a solid pass settles it. */
export function PaintBlock({
  tone,
  className = "",
  children,
}: {
  tone: "ink" | "paper";
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [painted, setPainted] = useState(reduced);

  useEffect(() => {
    if (reduced) { setPainted(true); return; }
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { setPainted(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setPainted(true);
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`paint paint--${tone}${painted ? " painted" : ""} ${className}`.trim()}
    >
      <span className="paint-fill" aria-hidden="true"><i /><i /><i /></span>
      <div className="paint-content">{children}</div>
    </div>
  );
}
