import { useEffect, useState } from "react";
import { CtaFace } from "./CtaFace";
import { links, profile } from "../data/site";

/* The first screen is a wall of the tools in the work: rows of real logos
   drifting in alternating directions, like the icon wall that inspired it.
   They sit behind the copy and come forward only under the pointer. */

const TECHS: { name: string; src?: string; text?: string }[] = [
  { name: "JavaScript", src: "javascript" },
  { name: "TypeScript", src: "typescript" },
  { name: "React", src: "react" },
  { name: "Next.js", src: "nextdotjs" },
  { name: "Redux", src: "redux" },
  { name: "Vite", src: "vite" },
  { name: "HTML5", src: "html5" },
  { name: "Sass", src: "sass" },
  { name: "Node.js", src: "nodedotjs" },
  { name: "Express", src: "express" },
  { name: "PostgreSQL", src: "postgresql" },
  { name: "MongoDB", src: "mongodb" },
  { name: "Firebase", src: "firebase" },
  { name: "Python", src: "python" },
  { name: ".NET", src: "dotnet" },
  { name: "C#", text: "C#" },
  { name: "1C", text: "1C" },
  { name: "Docker", src: "docker" },
  { name: "npm", src: "npm" },
  { name: "Webpack", src: "webpack" },
  { name: "Tailwind", src: "tailwindcss" },
  { name: "Git", src: "git" },
  { name: "GitHub", src: "github" },
  { name: "Figma", src: "figma" },
  { name: "Vercel", src: "vercel" },
  { name: "Netlify", src: "netlify" },
  { name: "OpenCode", src: "opencode" },
  { name: "Cursor", src: "cursor" },
  { name: "Claude", src: "anthropic" },
  { name: "DeepSeek", src: "deepseek" },
  { name: "GPT", text: "GPT" },
  { name: "Telegram", src: "telegram" },
  { name: "Google", src: "google" },
];

const PHONE = 640;

/* enough tiles to fill the viewport twice per row, at any window size */
function useWallSize() {
  const [size, setSize] = useState({ cols: 21, rows: 15 });
  useEffect(() => {
    let timer = 0;
    const calc = () => {
      const phone = window.innerWidth <= PHONE;
      const tile = phone ? 46 : 64;
      const gap = phone ? 7 : 9;
      const step = tile + gap;
      setSize({
        cols: Math.ceil((window.innerWidth + tile) / step),
        rows: Math.ceil(window.innerHeight / step) + 1,
      });
    };
    calc();
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(calc, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, []);
  return size;
}

export function Hero() {
  const { cols, rows } = useWallSize();

  return (
    <header className="hero" id="top">
      <div className="hero-wall" aria-hidden="true">
        {Array.from({ length: rows }, (_, r) => {
          const speed = 68 + ((r * 11) % 46);
          return (
            <div className={`hero-row${r % 2 ? " hero-row--rev" : ""}`} key={r}>
              <div className="hero-track" style={{ animationDuration: `${speed}s` }}>
                {[0, 1].map((copy) => (
                  <div className="hero-set" key={copy}>
                    {Array.from({ length: cols }, (_, i) => {
                      const tech = TECHS[(r * 5 + i * 7) % TECHS.length];
                      return (
                        <span className="hero-tile" key={`${copy}-${i}`} title={tech.name}>
                          {tech.src ? (
                            <img src={`/logos/${tech.src}.svg`} alt="" loading="lazy" decoding="async" />
                          ) : (
                            <b>{tech.text}</b>
                          )}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <span className="hero-veil" aria-hidden="true" />

      <div className="hero-inner">
        {/* the guide is fixed over this reserved spot; the box keeps the rhythm */}
        <div className="hero-mark" data-hero-mark aria-hidden="true" />

        <h1 className="hero-title hero-rise txt">{profile.title}</h1>

        <p className="hero-sub hero-rise txt">
          Я{" "}
          <a className="hero-name" href="#about" aria-label="Виталик, обо мне">
            <span className="hero-wave" aria-hidden="true"><i>👋</i></span>
            <span className="hero-nm">Виталик</span>
          </a>
          , фронтенд-разработчик. Делаю и поддерживаю сайты и интерфейсы:
          B2B-витрины, лендинги, CRM. В портфолио — БигФудМаркет, Golden Motors и
          сайты холдинга Bus1.
        </p>

        <div className="hero-actions hero-rise">
          <CtaFace
            href={links.telegram}
            label="Написать в Telegram"
            sub="@vitali_klimko"
          />
        </div>
      </div>
    </header>
  );
}
