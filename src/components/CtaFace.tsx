import { useRef } from "react";
import type { PointerEvent } from "react";
import { Icon } from "./Icon";

export function CtaFace({
  href,
  label,
  sub,
  prefix = "ВК",
  external = true,
  className = "",
}: {
  href: string;
  label: string;
  sub: string;
  prefix?: string;
  external?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  /* the glass light follows the pointer: --mx / --my on the anchor */
  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height * 100).toFixed(1)}%`);
  };

  return (
    <span className={`cta-ring ${className}`}>
      <a
        ref={ref}
        className="cta-face"
        href={href}
        onPointerMove={onMove}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener" : undefined}
      >
        <i className="cta-glow" aria-hidden="true" />
        <i className="cta-spot" aria-hidden="true" />
        <i className="cta-rim" aria-hidden="true" />
        <span className="cta-face-img" aria-hidden="true">{prefix}</span>
        <span className="cta-face-text">
          <span>{label}</span>
          <small>{sub}</small>
        </span>
        <span className="cta-ico" aria-hidden="true">
          <Icon name="arrow-right" className="cta-ico-arrow" />
          <Icon name="telegram" className="cta-ico-cal" />
        </span>
      </a>
    </span>
  );
}
