import { useEffect, useRef, useState } from "react";
import { EyeTracker } from "./EyeTracker";
import { useReducedMotion } from "../hooks/useReducedMotion";

/* Loader — a curtain over the page while the fonts arrive. On 100 it drops.
   The mark is the character itself, morphing through its shapes; repeat
   visits and reduced motion get the short version. */
export function Loader({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [shape, setShape] = useState("Cube");
  const [done, setDone] = useState(false);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.classList.add("loading");
    window.scrollTo(0, 0);

    let seen = false;
    try {
      seen = sessionStorage.getItem("seen") === "1";
      sessionStorage.setItem("seen", "1");
    } catch {
      /* private mode: the long version is fine */
    }
    const MIN = reduced ? 150 : seen ? 400 : 1100;
    let raf = 0;
    let hold = 0;
    let shapeTimer = 0;
    const shapes = ["Cube", "Hexagon", "Pill", "Circle"];
    let k = 0;
    if (!reduced) {
      shapeTimer = window.setInterval(() => {
        k = (k + 1) % shapes.length;
        setShape(shapes[k]);
      }, 440);
    }

    const finish = () => {
      setDone(true);
      window.clearInterval(shapeTimer);
      document.body.classList.remove("loading");
      document.body.classList.add("revealed");
      window.scrollTo(0, 0);
      document.dispatchEvent(new Event("revealed"));
      hold = window.setTimeout(onDone, reduced ? 320 : 1040);
    };

    const t0 = performance.now();
    let shown = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / MIN);
      const n = Math.round((1 - Math.pow(1 - t, 3)) * 100);
      if (n > shown) {
        shown = n;
        if (count.current) count.current.textContent = String(n);
      }
      if (shown >= 100) {
        hold = window.setTimeout(finish, 220);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hold);
      window.clearInterval(shapeTimer);
      document.body.classList.remove("loading");
    };
  }, [onDone, reduced]);

  return (
    <div className={done ? "loader done" : "loader"} aria-hidden="true">
      <div className="loader-mark">
        <div className="eyt--loader">
          <EyeTracker size={120} shape={shape} idle eyes="Slant" />
        </div>
      </div>
      <span className="loader-count" ref={count}>0</span>
    </div>
  );
}
