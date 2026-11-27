import { useEffect, useState } from "react";
import { EyeTracker } from "./EyeTracker";
import GooeyNav from "./GooeyNav";
import { navItems, links } from "../data/site";

const SHAPES = ["Circle", "Hexagon", "Pill", "Cube"];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState(() => window.matchMedia("(min-width: 641px)").matches);
  const [shape, setShape] = useState("Circle");

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 641px)");
    const onChange = (e: MediaQueryListEvent) => setDesktop(e.matches);
    wide.addEventListener("change", onChange);
    setDesktop(wide.matches);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  /* the gooey pill follows the section in view; a click sets it at once */
  useEffect(() => {
    const i = navItems.findIndex((n) => n.href.slice(1) === current);
    setActive(i < 0 ? 0 : i);
  }, [current]);

  /* near the top the page itself is current: the pill goes back to Начало */
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.4) setCurrent("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* current section in ink */
  useEffect(() => {
    const targets = navItems
      .map((n) => document.querySelector(n.href))
      .filter((el): el is Element => Boolean(el));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setCurrent(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* the sheet */
  useEffect(() => {
    document.body.dataset.nav = open ? "open" : "";
    const parts = document.querySelectorAll(".hero, .rows-block, .works, .about, .process, .contact");
    parts.forEach((el) => {
      if (open) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    });
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const mq = window.matchMedia("(min-width: 641px)");
    const onChange = (e: MediaQueryListEvent) => { if (e.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  const cycle = () => {
    setShape((s) => SHAPES[(SHAPES.indexOf(s) + 1) % SHAPES.length]);
  };

  return (
    <>
      <nav id="nav" aria-label="Основная навигация" data-open={open ? "true" : "false"}>
        <a
          className="nav-logo"
          href="#top"
          aria-label="Виталик Климко, в начало"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setOpen(false);
            cycle();
          }}
        >
          <span className="eyt--nav nav-eyes">
            <EyeTracker size={25} shape={shape} idle eyes="Dots" eyeScale={1.05} />
          </span>
        </a>

        {desktop ? (
          <div className="nav-gooey">
            <GooeyNav
              items={navItems}
              activeIndex={active}
              onChange={(i: number) => setActive(i)}
              theme="light"
              color="#0a0a0a"
              activeTextColor="#ffffff"
              size="sm"
              frame={false}
              gooeyness={0.55}
              wobble={0.45}
              hoverEffect
            />
          </div>
        ) : null}

        <a className="nav-call" href={links.telegram} target="_blank" rel="noopener">
          Telegram
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((o) => !o)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path className="bar1" d="M3 7h18" />
            <path className="bar2" d="M3 12h18" />
            <path className="bar3" d="M3 17h18" />
          </svg>
        </button>
      </nav>

      <div className="nav-links" id="nav-links" data-open={open ? "true" : "false"}>
        {navItems.map((n) => (
          <a
            key={n.href}
            className={`txt${current === n.href.slice(1) ? " current" : ""}`}
            href={n.href}
            onClick={() => setOpen(false)}
          >
            {n.label}
          </a>
        ))}
        <a className="nav-sheet-call" href={links.telegram} target="_blank" rel="noopener">
          Написать в Telegram
        </a>
        <span className="nav-sheet-status status">Открыт к предложениям</span>
      </div>
    </>
  );
}
