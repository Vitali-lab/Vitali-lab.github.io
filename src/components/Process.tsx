import { steps } from "../data/site";
import { PaintBlock } from "./PaintBlock";
import { Rise } from "./Rise";

/* Process: four numbered rows on the same rail, inside one ink slab. The rows
   are the table of how the work goes, not four little cards. */
export function Process() {
  return (
    <section className="process content-rail" id="process" aria-labelledby="processLabel">
      <div className="process-head">
        <Rise as="h2" className="section-label" id="processLabel">Как я работаю</Rise>
        <Rise as="p" i={1} className="lede">
          Четыре шага от мутной задачи до продукта, которому доверяют. В CRM и
          внутренних инструментах экран редко бывает сложным. Сложное — правило,
          край, привычка, которую никто не записал. С этого и начинаю.
        </Rise>
      </div>

      <PaintBlock tone="ink" className="process-slab">
        <ol className="process-list">
          {steps.map((s) => (
            <li className="process-row" key={s.n}>
              <span className="process-n">{s.n}</span>
              <h3 className="process-t">{s.title}</h3>
              <p className="process-d">{s.text}</p>
            </li>
          ))}
        </ol>
      </PaintBlock>
    </section>
  );
}
