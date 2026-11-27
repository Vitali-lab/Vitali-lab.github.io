import { useId } from "react";

const SEAL_TEXT = "ОТКРЫТ К ПРЕДЛОЖЕНИЯМ · FRONTEND DEVELOPER · MINSK · REMOTE · ";

/* The contact seal: a slow ring of mono text around the character's face.
   It replaces the borrowed hanging badge. */
export function Seal({ compact = false }: { compact?: boolean }) {
  const id = `seal-${useId().replace(/:/g, "")}`;
  return (
    <div className={`seal${compact ? " seal--compact" : ""}`} aria-hidden="true">
      <svg className="seal-ring" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <path id={id} d="M100,16 A84,84 0 1,1 100,184 A84,84 0 1,1 100,16" />
        </defs>
        <text>
          <textPath href={`#${id}`} startOffset="0">{SEAL_TEXT}</textPath>
        </text>
      </svg>
      <span className="seal-face"><i /><i /></span>
    </div>
  );
}
