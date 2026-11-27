import type { ReactNode } from "react";

/* Icon set — 24px grid, 1.7px stroke, round caps. Brand glyphs are filled;
   everything else is a stroked outline. currentColor only. */
export type IconDef = { body: ReactNode; filled?: boolean };

export const ICONS = {
  "arrow-right": { body: <><path d="M4 12h15" /><path d="m13 6 6 6-6 6" /></> },
  "arrow-up-right": { body: <><path d="M7 17 17 7" /><path d="M8 7h9v9" /></> },
  download: { body: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></> },
  calendar: { body: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  mail: { body: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7.5 8 6 8-6" /></> },
  telegram: {
    filled: true,
    body: <path d="M20.7 4.2 3.4 10.9c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.2c.2.6.4.8.8.8.4 0 .6-.2.9-.5l2.1-2.1 4.5 3.3c.8.5 1.4.2 1.6-.8l2.9-13.8c.3-1.2-.5-1.8-1.4-1.7ZM9 13.4l8.9-5.6c.4-.3.8-.1.5.2l-7.4 6.7-.3 3.1L9 13.4Z" />,
  },
  github: {
    filled: true,
    body: <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />,
  },
  linkedin: {
    filled: true,
    body: <path d="M5.3 3.5a1.9 1.9 0 1 1 0 3.8 1.9 1.9 0 0 1 0-3.8ZM3.7 9h3.2v11.3H3.7V9Zm5.4 0h3.1v1.6h.1c.4-.8 1.5-1.8 3.2-1.8 3.4 0 4 2.2 4 5.1v6.4h-3.2v-5.7c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3v5.8H9.1V9Z" />,
  },
  check: { body: <path d="m4.5 12.5 5 5L20 6.5" /> },
  close: { body: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></> },
  "chevron-down": { body: <path d="m6 9 6 6 6-6" /> },
  copy: { body: <><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M15 5.5A2.5 2.5 0 0 0 12.5 3h-7A2.5 2.5 0 0 0 3 5.5v7A2.5 2.5 0 0 0 5.5 15" /></> },
  code: { body: <><path d="m9 7-5 5 5 5" /><path d="m15 7 5 5-5 5" /></> },
  database: {
    body: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  },
  layers: { body: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></> },
  cpu: {
    body: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" /></>,
  },
  external: { body: <><path d="M14 4h6v6" /><path d="M20 4l-8 8" /><path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></> },
  sparkles: { body: <><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3Z" /><path d="M18.5 15.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" /></> },
  "map-pin": { body: <><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></> },
  clock: { body: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></> },
} satisfies Record<string, IconDef>;

export type IconName = keyof typeof ICONS;


export const iconNames = Object.keys(ICONS) as IconName[];
