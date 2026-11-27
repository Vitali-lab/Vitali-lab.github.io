import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { cases, filters } from "../data/site";
import type { CaseStudy, CaseTag } from "../data/site";
import { CaseCover } from "./CaseCover";
import { Icon } from "./Icon";
import { ProjectModal } from "./ProjectModal";
import { Rise } from "./Rise";
import { useReducedMotion } from "../hooks/useReducedMotion";

/* The case wall: 16:9 previews in a plain grid, the way a slide gallery is
   read. Nothing is packed or scaled by JS — filtering just removes cards and
   the grid reflows. Hovering a card lifts its name and hands Буп the line
   about that project, so the guide answers the card under the pointer. */

const SAY_EVENT = "bup:say";

function tell(text: string) {
  window.dispatchEvent(new CustomEvent<string>(SAY_EVENT, { detail: text }));
}

export function Works() {
  const [active, setActive] = useState<"all" | CaseTag>("all");
  const [open, setOpen] = useState<CaseStudy | null>(null);
  const [lit, setLit] = useState(false);
  const reduced = useReducedMotion();
  const shown = lit || reduced;
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = grid.current;
    if (!el) return;
    let io: IntersectionObserver | null = null;
    const start = () => {
      io = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        io?.disconnect();
        setLit(true);
      }, { rootMargin: "0px 0px -12% 0px" });
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
    <>
    <section className="works content-rail" id="works" aria-labelledby="worksLabel">
      <Rise className="works-head">
        <h2 className="works-label" id="worksLabel">Избранные работы</h2>
        <div className="works-filters" role="group" aria-label="Фильтр работ">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Rise>

      <div className={`works-grid${shown ? " is-lit" : ""}`} ref={grid}>
        {cases.map((c, i) => {
          const on = active === "all" || c.tags.includes(active);
          return (
            <article
              key={c.id}
              className={`works-card${on ? "" : " is-off"}`}
              style={{ "--i": i } as CSSProperties}
              onPointerEnter={() => tell(Math.random() < 0.4 ? c.joke : c.talk)}
              onPointerLeave={() => tell("")}
            >
              <div className="works-art">
                {c.photo ? (
                  <img
                    className="works-photo"
                    src={c.photo}
                    alt=""
                    loading={i < 4 ? "eager" : "lazy"}
                    decoding="async"
                  />
                ) : c.cover ? (
                  <CaseCover kind={c.cover} />
                ) : null}
              </div>
              <span className="works-veil" aria-hidden="true" />
              <div className="works-info">
                <span className="works-idx">{c.index}</span>
                <h3 className="works-title">{c.title}</h3>
                <span className="works-tag">{c.label}</span>
              </div>
              <span className="works-go" aria-hidden="true">
                <Icon name="arrow-up-right" size={15} />
              </span>
              <button
                className="works-hit"
                type="button"
                aria-label={`${c.title} — подробнее о проекте`}
                onClick={() => { tell(""); setOpen(c); }}
                onFocus={() => tell(c.talk)}
                onBlur={() => tell("")}
              />
            </article>
          );
        })}
      </div>
    </section>
    <ProjectModal project={open} onClose={() => setOpen(null)} />
    </>
  );
}
