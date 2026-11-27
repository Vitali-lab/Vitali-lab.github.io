import { useRef } from "react";
import type { PointerEvent } from "react";
import { CtaFace } from "./CtaFace";
import { Icon } from "./Icon";
import { Rise } from "./Rise";
import { Seal } from "./Seal";
import { links } from "../data/site";

export function Contact() {
  const stage = useRef<HTMLElement>(null);

  /* the light follows the pointer; touch leaves the stage alone */
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const el = stage.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--cx", `${(e.clientX - r.left).toFixed(0)}px`);
    el.style.setProperty("--cy", `${(e.clientY - r.top).toFixed(0)}px`);
    el.style.setProperty("--lit", "1");
  };
  const onLeave = () => stage.current?.style.setProperty("--lit", "0");

  return (
    <footer
      className="contact"
      id="contact"
      ref={stage}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-labelledby="contactTitle"
    >
      <div className="contact-light" aria-hidden="true" />

      <Seal />

      <Rise as="h2" i={0} className="contact-title txt" id="contactTitle">
        Давайте сделаем продукт, которому поверят.
      </Rise>
      <Rise as="p" i={1} className="contact-sub txt">
        Сложный продукт, короткий срок или процесс, который никто не хочет
        трогать. Напишите — разберусь.
      </Rise>

      <Rise className="contact-call" i={2}>
        <CtaFace href={links.telegram} label="Написать в Telegram" sub="@vitali_klimko" />
      </Rise>

      <Rise className="contact-soc" i={3}>
        <a
          className="soc soc--github"
          href={links.github}
          target="_blank"
          rel="noopener"
          aria-label="GitHub"
          title="GitHub"
        >
          <Icon name="github" size={22} />
        </a>
        <a
          className="soc soc--telegram"
          href={links.telegram}
          target="_blank"
          rel="noopener"
          aria-label="Telegram"
          title="Telegram"
        >
          <Icon name="telegram" size={22} />
        </a>
        <a className="soc soc--mail" href={`mailto:${links.email}`} aria-label="Почта" title={links.email}>
          <Icon name="mail" size={22} />
        </a>
      </Rise>

      <Rise as="p" i={4} className="contact-copy">
        © 2026 Виталик Климко · <a href="#kit">кит</a>
      </Rise>
    </footer>
  );
}
