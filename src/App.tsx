import { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "./components/Loader";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Rows } from "./components/Rows";
import { Works } from "./components/Works";
import { Process } from "./components/Process";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Guide } from "./components/Guide";
import { Kit } from "./components/Kit";

export default function App() {
  const [kit, setKit] = useState(() => window.location.hash === "#kit");
  const [loading, setLoading] = useState(() => window.location.hash !== "#kit");

  /* the same soft light as the closing block, following the pointer over the
     whole page: surfaces read a touch whiter under the cursor */
  useEffect(() => {
    let raf = 0;
    let x = 0, y = 0, lit = false;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x = e.clientX; y = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const root = document.documentElement.style;
        root.setProperty("--cx", `${x}px`);
        root.setProperty("--cy", `${y}px`);
        if (!lit) { lit = true; root.setProperty("--lit", "1"); }
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const wasKit = useRef(kit);
  useEffect(() => {
    const onHash = () => {
      const next = window.location.hash === "#kit";
      setKit(next);
      if (next) {
        document.body.classList.add("revealed");
        document.body.classList.remove("loading");
      } else if (wasKit.current) {
        window.scrollTo(0, 0);
      }
      wasKit.current = next;
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const done = useCallback(() => setLoading(false), []);

  if (kit) return <Kit />;

  return (
    <>
      {loading ? <Loader onDone={done} /> : null}
      <div className="spotlight" aria-hidden="true" />
      <div className="page">
        <a className="skip" href="#works">Перейти к работам</a>
        <Nav />
        <Hero />
        <Rows />
        <About />
        <Works />
        <Process />
        <Contact />
      </div>
      <Guide />
    </>
  );
}
