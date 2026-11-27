import { useEffect, useState } from "react";
import ds from "../../design/design-system.json";
import { Icon } from "./Icon";
import { iconNames } from "./iconSet";
import { EyeTracker } from "./EyeTracker";
import { CtaFace } from "./CtaFace";
import { Seal } from "./Seal";
import { links } from "../data/site";

const SAMPLES: Record<string, string> = {
  "large-title": "94%",
  "hero-title": "Сложные задачи, простые интерфейсы.",
  "title-1": "Давайте сделаем продукт, которому поверят.",
  "title-2": "Четыре шага от мутной задачи до продукта, которому доверяют.",
  body: "Собираю продукты на React и TypeScript: от CRM с интеграциями до сайтов, которые не стыдно показать.",
  footnote: "Написать в Telegram · @vitali_klimko",
  label: "Продукт · React",
  menu: "Работы",
};

const RADII = ["card", "tray", "inner", "pill"] as const;
const SPACING = Object.entries(ds.spacing.scale);
const MOTION_SUMMARY: Record<string, string> = {
  loader: "count → 100 · curtain 1000ms",
  heroEntrance: "18px rise · 700ms · stagger 70ms",
  riseOnScroll: "12px rise · 850ms · stagger 95ms",
  navFloat: "glass pill · 450ms · hide on scroll down",
  mobileMenu: "sheet 300ms · items 500ms · 40ms stagger",
  rows: "two tracks · 86s/98s · hover pauses",
  ctaGlass: "pointer light · 400ms · icon swap 400ms",
  socialIcons: "buzz 500ms · jelly 650ms · plane 1000ms",
  tooltip: "blur 6px → 0 · 2px travel · 380ms",
  languageSwap: "180ms out · 260ms in",
  eyeTracker: "spring k .06 · blink 160ms · morph 520ms",
};

export function Kit() {
  const [shape, setShape] = useState("Cube");
  const [mood, setMood] = useState<"normal" | "angry" | "kind" | "curious">("normal");

  useEffect(() => {
    const before = document.title;
    document.title = "Кит — vitfolio";
    return () => { document.title = before; };
  }, []);
  const roles = ds.typography.roles;
  const iconUse = new Map(ds.iconography.set.map((i) => [i.name, i.use] as const));

  return (
    <main className="kit">
      <header className="kit-head col">
        <a className="kit-back" href="#top">← На сайт</a>
        <h1 className="kit-title">Кит</h1>
        <p className="kit-lede">
          Дизайн-система этой визитки: токены, роли, иконки, движение и персонаж.
          Источник истины — <code>design/design-system.json</code>.
        </p>
        <div className="chips">
          <span className="chip">Inter · IBM Plex Mono</span>
          <span className="chip">{ds.colors.tokens.length} цветов</span>
          <span className="chip">{roles.length} ролей</span>
          <span className="chip">{iconNames.length} иконок</span>
          <span className="chip">MIT · EyeTracker</span>
        </div>
      </header>

      <section className="kit-section col" aria-labelledby="kit-type">
        <h2 className="kit-h" id="kit-type">Типографика</h2>
        <p className="kit-note">
          Роль — это связка: размер, интерлиньяж и трекинг ходят вместе. Размеры
          step-аются на 1100 и 640, а не тянутся за вьюпортом.
        </p>
        <div className="specimens">
          {roles.map((r) => (
            <div className="specimen" key={r.name}>
              <div className="specimen-meta">
                <span className="specimen-name">{r.name}</span>
                <span>{r.size.join(" / ")} · {String(r.lineHeight)} · {r.tracking} · {r.weight}</span>
              </div>
              <p className={`spec spec--${r.name}`}>{SAMPLES[r.name] ?? r.name}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-section col" aria-labelledby="kit-color">
        <h2 className="kit-h" id="kit-color">Цвет</h2>
        <div className="swatches">
          {ds.colors.tokens.map((c) => (
            <div className="swatch" key={c.name}>
              <span className="swatch-chip" style={{ background: c.value }} />
              <span className="swatch-name">{c.name}</span>
              <span className="swatch-value">{c.value}</span>
              <span className="swatch-role">{c.role}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-section col" aria-labelledby="kit-space">
        <h2 className="kit-h" id="kit-space">Сетка, отступы, радиусы</h2>
        <div className="kit-cols">
          <div className="kit-block">
            <h3 className="kit-sub">8-точечная шкала</h3>
            <ul className="space-list">
              {SPACING.map(([name, value]) => (
                <li key={name}>
                  <span className="space-name">{name}</span>
                  <span className="space-bar" style={{ width: `calc(${value} * 0.9)` }} />
                  <span className="space-value">{value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="kit-block">
            <h3 className="kit-sub">Радиусы</h3>
            <div className="radius-grid">
              {RADII.map((key) => {
                const value = (ds.radii as Record<string, string>)[key];
                return (
                  <div className="radius" key={key}>
                    <span className="radius-box" style={{ borderRadius: key === "pill" ? 999 : value }} />
                    <span className="radius-name">--r-{key}</span>
                    <span className="radius-value">{value}</span>
                  </div>
                );
              })}
            </div>
            <h3 className="kit-sub kit-sub--gap">Сетка</h3>
            <dl className="kit-dl">
              <dt>Колонка</dt><dd>{ds.layout.column.desktop} · {ds.layout.column.mobile}</dd>
              <dt>Сетка работ</dt><dd>{ds.layout.grid.value}</dd>
              <dt>Гаттер</dt><dd>{ds.layout.gutter}</dd>
              <dt>Брейкпоинты</dt><dd>{Object.values(ds.layout.breakpoints).join(" · ")}</dd>
            </dl>
          </div>
        </div>
      </section>

      <section className="kit-section col" aria-labelledby="kit-icons">
        <h2 className="kit-h" id="kit-icons">Иконки</h2>
        <p className="kit-note">
          24 × 24, штрих 1.7, round caps, currentColor. Бренд-глифы — заливкой,
          остальное — контуром.
        </p>
        <div className="icon-grid">
          {iconNames.map((name) => (
            <div className="icon-cell" key={name}>
              <Icon name={name} size={24} />
              <span className="icon-name">{name}</span>
              <span className="icon-use">{iconUse.get(name) ?? ""}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="kit-section col" aria-labelledby="kit-components">
        <h2 className="kit-h" id="kit-components">Компоненты</h2>
        <div className="kit-cols">
          <div className="kit-block">
            <h3 className="kit-sub">Главное действие</h3>
            <CtaFace href={links.telegram} label="Написать в Telegram" sub="@vitali_klimko" />
            <div className="kit-row">
              <span className="cta">Кнопка</span>
              <span className="status">Открыт к предложениям</span>
            </div>
            <div className="chips">
              <span className="chip">React</span>
              <span className="chip">TypeScript</span>
              <span className="chip">Firebase</span>
            </div>
          </div>
          <div className="kit-block">
            <h3 className="kit-sub">Персонаж</h3>
            <div className="kit-character">
              <div className="eyt--hero">
                <EyeTracker size={104} shape={shape} within=".kit" mood={mood} />
              </div>
              <div className="kit-character-side">
                <p>Нажмите на шар. Форму можно менять:</p>
                <div className="chips">
                  {["Cube", "Ball", "Hexagon", "Pill", "Circle"].map((s) => (
                    <button
                      className="chip"
                      key={s}
                      type="button"
                      aria-pressed={shape === s}
                      onClick={() => setShape(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="kit-note">Брови — единственное, что меняется:</p>
                <div className="chips">
                  {([["normal", "Обычное"], ["kind", "Доброе"], ["angry", "Злое"], ["curious", "Одна бровь"]] as const).map(([m, label]) => (
                    <button
                      className="chip"
                      key={m}
                      type="button"
                      aria-pressed={mood === m}
                      onClick={() => setMood(m)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="kit-block">
          <h3 className="kit-sub">Персонаж в интерфейсе</h3>
          <div className="kit-row kit-row--eyes">
            <span className="kit-eye-label">навигация · 25px · idle</span>
            <span className="eyt--nav"><EyeTracker size={25} shape="Circle" idle eyes="Dots" /></span>
          </div>
          <p className="kit-note">
            На сайте это Буп, гид: при небольшом скролле гаснет слева и
            появляется справа, рассказывает блок и возвращается назад при
            скролле вверх. Реплики — в том же пузыре. Лица — обычное, доброе
            (poke), любопытное (hover, одна бровь) и злое (DevTools); меняются
            только брови. Ещё он засыпает после 30 секунд простоя и уходит
            на 10 секунд, если его затыкать.
          </p>
        </div>

        <div className="kit-block">
          <h3 className="kit-sub">Контактная печать</h3>
          <div className="kit-row kit-seal-row">
            <Seal compact />
            <p className="kit-note">
              Заменяет висящий бейдж. Кольцо текста крутится 44с, на hover
              останавливается, при reduced motion стоит. Свет за блоком следует
              за курсором. Хедер один: стеклянная пилюля с Gooey Nav (ReactBits).
            </p>
          </div>
        </div>
      </section>

      <section className="kit-section col" aria-labelledby="kit-motion">
        <h2 className="kit-h" id="kit-motion">Движение</h2>
        <p className="kit-note">
          {ds.motion.principles[0]} {ds.motion.principles[2]}
        </p>
        <div className="kit-table">
          <div className="kit-tr kit-th"><span>Сцена</span><span>Что происходит</span></div>
          {Object.keys(ds.motion.sequences).map((name) => (
            <div className="kit-tr" key={name}>
              <span className="kit-td-key">{name}</span>
              <span>{MOTION_SUMMARY[name] ?? "—"}</span>
            </div>
          ))}
        </div>
        <div className="chips kit-easings">
          {Object.entries(ds.motion.easings).map(([name, value]) => (
            <span className="chip" key={name}>{name} · {value}</span>
          ))}
        </div>
      </section>

      <section className="kit-section col" aria-labelledby="kit-character">
        <h2 className="kit-h" id="kit-character">EyeTracker</h2>
        <p className="kit-note">
          {ds.character.origin}. Компонент живёт в <code>src/components/EyeTracker.tsx</code>,
          токены Bencho смаплены на токены проекта.
        </p>
        <div className="kit-table">
          <div className="kit-tr kit-th"><span>Bencho</span><span>Здесь</span></div>
          {Object.entries(ds.character.tokenMapping)
            .filter(([k]) => k.startsWith("--"))
            .map(([k, v]) => (
              <div className="kit-tr" key={k}>
                <span className="kit-td-key">{k}</span>
                <span>{v}</span>
              </div>
            ))}
        </div>
      </section>

      <footer className="kit-foot col">
        <span className="mono">vitfolio · design system 1.0</span>
      </footer>
    </main>
  );
}
