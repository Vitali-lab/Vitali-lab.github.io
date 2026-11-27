import { about, facts, stack } from "../data/site";
import { Icon } from "./Icon";
import { PaintBlock } from "./PaintBlock";
import { Rise } from "./Rise";

/* About: an editorial block on the same rail as the works. A statement, a
   paragraph, then one wide paper slab with the stack and the facts. */
export function About() {
  return (
    <section className="about content-rail" id="about" aria-labelledby="aboutLabel">
      <div className="about-head">
        <Rise as="h2" className="section-label" id="aboutLabel">О себе</Rise>
        <Rise as="p" i={1} className="about-lede">{about[0]}</Rise>
        <Rise as="p" i={2} className="about-copy">{about[1]}</Rise>
      </div>

      <PaintBlock tone="paper" className="about-slab">
        <div className="about-slab-inner">
          <div className="about-stack">
            {stack.map((g) => (
              <div className="stack-group" key={g.title}>
                <h3 className="stack-title">
                  <Icon name={g.icon} size={16} />
                  <span>{g.title}</span>
                </h3>
                <ul className="chips">
                  {g.items.map((item) => (
                    <li className="chip" key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <ul className="facts">
            {facts.map((f) => (
              <li className="fact" key={f.label}>
                <Icon name={f.icon} size={16} />
                <span className="fact-label">{f.label}</span>
                <span className="fact-value">{f.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </PaintBlock>
    </section>
  );
}
