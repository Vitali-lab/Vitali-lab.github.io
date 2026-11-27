import type { CSSProperties } from "react";
import { ICONS } from "./iconSet";
import type { IconDef, IconName } from "./iconSet";

export type { IconName } from "./iconSet";

export function Icon({
  name,
  size = 24,
  className,
  title,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
  style?: CSSProperties;
}) {
  const def: IconDef = ICONS[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      style={style}
      fill={def.filled ? "currentColor" : "none"}
      stroke={def.filled ? "none" : "currentColor"}
      strokeWidth={def.filled ? undefined : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      {def.body}
    </svg>
  );
}

