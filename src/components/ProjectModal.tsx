import { useCallback, useEffect, useRef, useState } from "react";
import { CaseCover } from "./CaseCover";
import { EyeTracker } from "./EyeTracker";
import { Icon } from "./Icon";
import { links } from "../data/site";
import type { CaseStudy, ProjectShot } from "../data/site";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "../styles/project.css";

/* The project sheet: a native <dialog> in the top layer, so the page behind is
   inert and Escape works without extra code. It opens from a works card and
   shows everything about the project — the year, the role, the work, the live
   sites and a gallery of real screenshots. Буп lives in the band and says one
   of six lines each time the sheet opens. */

const host = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const pad = (n: number) => String(n).padStart(2, "0");

function ShotCarousel({ shots }: { shots: ProjectShot[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();

  const go = useCallback((n: number) => {
    const el = stage.current;
    if (!el) return;
    const next = Math.max(0, Math.min(shots.length - 1, n));
    el.scrollTo({ left: next * el.clientWidth, behavior: reduced ? "auto" : "smooth" });
  }, [shots.length, reduced]);

  useEffect(() => { setI(0); stage.current?.scrollTo({ left: 0 }); }, [shots]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const next = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setI((prev) => (prev === next ? prev : next));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i]);

  return (
    <section className="case-carousel" aria-roledescription="carousel" aria-label="Скриншоты проекта">
      <div className="case-stage-wrap">
        <div className="case-stage" ref={stage}>
          {shots.map((s, n) => (
            <figure
              className={`case-slide${s.tall ? " case-slide--tall" : ""}`}
              key={s.src + n}
              aria-hidden={n !== i}
            >
              <img
                src={s.src}
                alt={s.alt}
                width={1440}
                height={1000}
                loading={n < 2 ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </figure>
          ))}
        </div>
        <button
          className="case-arrow case-arrow--prev"
          type="button"
          onClick={() => go(i - 1)}
          disabled={i === 0}
          aria-label="Предыдущий скриншот"
        >
          <Icon name="arrow-right" size={20} />
        </button>
        <button
          className="case-arrow case-arrow--next"
          type="button"
          onClick={() => go(i + 1)}
          disabled={i === shots.length - 1}
          aria-label="Следующий скриншот"
        >
          <Icon name="arrow-right" size={20} />
        </button>
        <span className="case-count" aria-live="polite">{pad(i + 1)} / {pad(shots.length)}</span>
      </div>
      <div className="case-carousel-foot">
        <p className="case-caption">{shots[i]?.caption}</p>
        <div className="case-thumbs">
          {shots.map((s, n) => (
            <button
              key={s.src + n}
              type="button"
              className={`case-thumb${n === i ? " is-on" : ""}`}
              onClick={() => go(n)}
              aria-label={s.caption}
              aria-current={n === i}
            >
              <img src={s.src} alt="" loading="lazy" decoding="async" draggable={false} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProjectModal({ project, onClose }: { project: CaseStudy | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState<CaseStudy | null>(null);
  const [closing, setClosing] = useState(false);
  const [line, setLine] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (project) {
      setShown(project);
      setClosing(false);
      const pool = project.enter ?? [];
      setLine(pool[Math.floor(Math.random() * pool.length)] ?? "");
    }
  }, [project]);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg || !shown) return;
    if (!dlg.open) {
      dlg.showModal();
      document.body.classList.add("modal-open");
    }
  }, [shown]);

  useEffect(() => () => {
    document.body.classList.remove("modal-open");
  }, []);

  const finish = useCallback(() => {
    ref.current?.close();
    document.body.classList.remove("modal-open");
    setShown(null);
    setClosing(false);
    onClose();
  }, [onClose]);

  const close = useCallback(() => {
    if (!ref.current || closing) return;
    if (reduced) {
      finish();
      return;
    }
    setClosing(true);
    window.setTimeout(finish, 190);
  }, [closing, finish, reduced]);

  if (!shown) return null;

  const c = shown;
  const d = c.detail;
  const stack = d?.stack ?? (c.result ? c.result.split(" · ") : []);
  const linksList = d?.links ?? (c.href ? [{ label: host(c.href), url: c.href }] : []);
  const facts = [
    d?.year ? ["Год", d.year] : null,
    d?.role ? ["Роль", d.role] : null,
    stack.length ? ["Стек", stack.join(" · ")] : null,
  ].filter((f): f is string[] => Boolean(f));

  return (
    <dialog
      ref={ref}
      className={`case-modal${closing ? " is-closing" : ""}`}
      aria-labelledby="caseTitle"
      onCancel={(e) => { e.preventDefault(); close(); }}
      onClick={(e) => { if (e.target === ref.current) close(); }}
    >
      <div className="case-sheet">
        <div className="case-bar">
          <button className="case-close" type="button" onClick={close} aria-label="Закрыть проект">
            <Icon name="close" size={18} />
          </button>
        </div>

        <header className="case-top">
          <div className="case-eyebrow">
            <span className="case-num">{c.index}</span>
            <span className="case-chip">{c.label}</span>
          </div>
          <h2 className="case-title" id="caseTitle">{c.title}</h2>
          <p className="case-summary">{d?.summary ?? c.blurb}</p>
          {facts.length ? (
            <dl className="case-facts">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          {line ? (
            <div className="case-bup">
              <div className="case-bup-face">
                <EyeTracker
                  size={64}
                  shape="Cube"
                  eyes="Slant"
                  eyeScale={1.18}
                  follow={55}
                  bounce={18}
                  within=".case-top"
                />
              </div>
              <p className="case-bup-line" key={c.id}>{line}</p>
            </div>
          ) : null}
        </header>

        <div className="case-body">
          {d?.gallery?.length ? (
            <ShotCarousel shots={d.gallery} />
          ) : (
            <figure className="case-hero">
              <div className="case-cover">
                {c.photo ? <img src={c.photo} alt={c.title} /> : c.cover ? <CaseCover kind={c.cover} /> : null}
              </div>
            </figure>
          )}

          <div className="case-grid">
            <div className="case-text">
              {d?.body?.length ? d.body.map((p) => <p key={p.slice(0, 24)}>{p}</p>) : (
                <p>{c.blurb ?? "Описание проекта скоро появится."}</p>
              )}
            </div>

            {d?.did?.length ? (
              <aside className="case-did">
                <h3 className="case-h3">Что делал</h3>
                <ul>
                  {d.did.map((item) => <li key={item}>{item}</li>)}
                </ul>
                {stack.length ? (
                  <div className="case-stack">
                    {stack.map((s) => <span key={s}>{s}</span>)}
                  </div>
                ) : null}
              </aside>
            ) : null}
          </div>

          {linksList.length ? (
            <section className="case-section">
              <div className="case-section-head">
                <h3 className="case-h3">{linksList.length > 1 ? "Сайты" : "Ссылка"}</h3>
                {linksList.length > 1 ? <span className="case-mono">{linksList.length}</span> : null}
              </div>
              <ul className="case-links">
                {linksList.map((l) => (
                  <li key={l.url}>
                    <a href={l.url} target="_blank" rel="noopener">
                      <span className="case-link-name">{l.label}</span>
                      <span className="case-link-host">{host(l.url)}</span>
                      <Icon name="arrow-up-right" size={16} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {d?.note ? <p className="case-note">{d.note}</p> : null}

          <footer className="case-foot">
            <p>
              Похожая задача? <br />
              Напишите — обсудим.
            </p>
            <div className="case-foot-actions">
              <a className="case-cta" href={links.telegram} target="_blank" rel="noopener">
                Написать в Telegram
                <Icon name="arrow-up-right" size={16} />
              </a>
              <button className="case-ghost" type="button" onClick={close}>Закрыть</button>
            </div>
          </footer>
        </div>
      </div>
    </dialog>
  );
}
