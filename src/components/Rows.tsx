import { cases } from "../data/site";
import { CaseCover } from "./CaseCover";
import type { CaseStudy } from "../data/site";

/* Two rows of case previews moving in opposite directions, with the edges
   fading into the page — the rows block from slidshift, rebuilt for this site:
   the cards are the CSS case covers, not screenshots. It pauses on hover and
   becomes a still strip under prefers-reduced-motion. */

const ROW_TWO: CaseStudy[] = [...cases.slice(3), ...cases.slice(0, 3)];

function Track({ items, direction }: { items: CaseStudy[]; direction: "left" | "right" }) {
  return (
    <div className={`rows-track rows-track--${direction}`}>
      {[0, 1].map((copy) => (
        <div className="rows-set" key={copy}>
          {items.map((c) => (
            <span className="rows-card" key={`${copy}-${c.id}`}>
              <CaseCover kind={c.cover} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Rows() {
  return (
    <div className="rows-block content-rail hero-rise" aria-hidden="true">
      <div className="rows-row"><Track items={cases} direction="left" /></div>
      <div className="rows-row"><Track items={ROW_TWO} direction="right" /></div>
    </div>
  );
}
