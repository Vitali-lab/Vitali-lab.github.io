import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { EyeTracker } from "./EyeTracker";
import { useReducedMotion } from "../hooks/useReducedMotion";
import "../styles/guide.css";

/* Буп — the site's guide, a character with a name and a temperament.
   It starts on the hero mark, vanishes/reappears at the right on a small
   scroll, naps when the site is idle, gets fed up with too many pokes, and
   turns red when DevTools opens. It does not narrate blocks by itself: it
   answers the project card under the pointer, in its own bubble. */

const DEV_NOTE = { text: "Куда полез? Это не для тебя.", id: -1 };

const SNARK = [
  "Всё. Я устал.",
  "Хватит тыкать.",
  "Я не кнопка.",
  "Ещё раз — и я уйду.",
];
const RETURN = [
  "Ну что, соскучился?",
  "Я вернулся. Тыкать больше не надо.",
  "Ладно, прощаю.",
  "Скучал? Я тоже.",
];

/* twenty ways to say hello, one per visit, so the first line is never the same */
const GREETINGS = [
  "Я Буп. Слежу за порядком.",
  "О, живой человек. Здравствуйте.",
  "Я тут вроде гида. Пойдёмте.",
  "Буп на связи. Глаза на месте.",
  "Привет. Я не баг, я фича.",
  "Заходите. Тыкать можно, но осторожно.",
  "Я работаю за спасибо. И за электричество.",
  "Здравствуйте. Я уже всё посмотрел.",
  "Буп. Гид, охранник и немного критик.",
  "Привет. Меня собрали из div'ов.",
  "Я тут вместо чат-бота. Только честнее.",
  "Добро пожаловать. Я слежу за курсором.",
  "Буп проснулся. Что смотрим?",
  "Здравствуйте. Сайт мой, а вы — гость.",
  "Я маленький, но важный.",
  "Привет. Если что — я моргаю.",
  "Я на месте. Курсор у вас, внимание у меня.",
  "Входите. Тут не кусаются.",
  "Буп к вашим услугам. Почти бесплатно.",
  "Здрасьте. Я тут главный по интерфейсу.",
];

/* the quiet talk, when nobody is hovering anything */
const CHATTER = [
  "Если что, проекты открываются по клику.",
  "Наведите на работу — расскажу, что это.",
  "Я умею спать. Но не сейчас.",
  "Скролл вниз. Там всё интересное.",
  "Не тыкайте слишком часто, я обидчивый.",
  "Могу открыть проект. Осторожно, там красиво.",
  "У меня две кнопки: смотреть и моргать.",
  "Сайт продаётся. Я — нет.",
];

const START_GAP = 24;
const OUT_MS = 170;
const IN_MS = 300;
const DOCK_AT = 4;
const UNDOCK_AT = 2;
const DOCK_BALL = 72;
const DOCK_BALL_PHONE = 52;
const HERO_BALL = 108;
const IDLE_MS = 30_000;
const POKE_LIMIT = 4;
const POKE_WINDOW = 3_000;
const RAGE_LEAVE_MS = 1_800;
const RAGE_OUT_MS = 560;
const RAGE_AWAY_MS = 10_000;
const RETURN_MS = 480;

const pick = (pool: readonly string[]) => pool[Math.floor(Math.random() * pool.length)];

type View = "hero" | "dock";
type Phase = "hero" | "out" | "in" | "dock";

export function Guide() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [view, setView] = useState<View>("hero");
  const [phone, setPhone] = useState(() => window.innerWidth <= 640);
  const [phase, setPhase] = useState<Phase>("hero");
  const [target, setTarget] = useState<View>("dock");
  const [settled, setSettled] = useState(false);
  const [devtools, setDevtools] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pokeKind, setPokeKind] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [rage, setRage] = useState(false);
  const [away, setAway] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [returning, setReturning] = useState(false);
  const [special, setSpecial] = useState<{ text: string; id: number } | null>(null);
  const [project, setProject] = useState<{ text: string; id: number } | null>(null);
  const [greet, setGreet] = useState<{ text: string; id: number } | null>(null);
  const [chatter, setChatter] = useState<{ text: string; id: number } | null>(null);

  const phaseRef = useRef<Phase>("hero");
  const viewRef = useRef<View>("hero");
  const rageRef = useRef(false);
  const awayRef = useRef(false);
  const pokeCount = useRef(0);
  const lastPoke = useRef(0);
  const pokeTimer = useRef(0);
  const timers = useRef<number[]>([]);
  const rageTimers = useRef({ leave: 0, away: 0, back: 0, special: 0, settle: 0 });
  const geo = useRef({ markX: 0, markY: 0, startY: 0, dockX: 0, dockY: 0, startScroll: 0 });
  /* re-plant on the nearest correct spot, whatever happened while he was out */
  const snap = useRef<() => void>(() => {});
  const greeted = useRef(false);

  /* the hero / dock view machine */
  useEffect(() => {
    const el = ref.current;
    const mark = document.querySelector<HTMLElement>("[data-hero-mark]");
    const nav = document.querySelector<HTMLElement>("#nav");
    if (!el || !mark || !nav) return;

    const clear = () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
    const go = (next: Phase) => {
      phaseRef.current = next;
      setPhase(next);
    };
    const setViewNow = (next: View) => {
      viewRef.current = next;
      setView(next);
    };
    const setPos = (x: number, y: number) => {
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    };
    const placeHero = () => {
      const g = geo.current;
      const cy = Math.max(g.startY, g.markY - window.scrollY);
      setPos(g.markX - 68, cy - 68);
    };
    const placeDock = () => setPos(geo.current.dockX - 68, geo.current.dockY - 68);

    const teleport = (next: View) => {
      setViewNow(next);
      if (next === "dock") placeDock();
      else placeHero();
    };

    const begin = (next: View) => {
      if (rageRef.current || awayRef.current) return;
      if (phaseRef.current === "out" || phaseRef.current === "in") return;
      if (viewRef.current === next) return;
      setTarget(next);
      setSettled(false);
      if (reduced) {
        teleport(next);
        go(next);
        if (next === "dock") setSettled(true);
        return;
      }
      go("out");
      timers.current.push(window.setTimeout(() => {
        teleport(next);
        go("in");
        timers.current.push(window.setTimeout(() => {
          go(next);
          if (next === "dock") setSettled(true);
          /* a fast reversal during the pair should not leave it stranded */
          const y = window.scrollY;
          if (next === "dock" && y <= UNDOCK_AT) begin("hero");
          else if (next === "hero" && y > DOCK_AT) begin("dock");
        }, IN_MS));
      }, OUT_MS));
    };

    const measure = () => {
      const m = mark.getBoundingClientRect();
      const phone = window.innerWidth <= 640;
      const g = geo.current;
      g.markX = m.left + m.width / 2;
      g.markY = m.top + window.scrollY + m.height / 2;
      g.startY = nav.getBoundingClientRect().bottom + HERO_BALL / 2 + START_GAP;
      g.startScroll = Math.max(0, g.markY - g.startY);
      const dockBall = phone ? DOCK_BALL_PHONE : DOCK_BALL;
      g.dockX = window.innerWidth - (phone ? 16 : 24) - dockBall / 2;
      g.dockY = window.innerHeight * (phone ? 0.79 : 0.52);
      setPhone(phone);
      if (viewRef.current === "dock") placeDock();
      else placeHero();
    };

    snap.current = () => {
      const want: View = window.scrollY > DOCK_AT ? "dock" : "hero";
      setViewNow(want);
      if (want === "dock") placeDock();
      else placeHero();
      go(want);
    };

    const onScroll = () => {
      /* while the guide is off-screen the view follows the page silently */
      if (awayRef.current) {
        const want: View = window.scrollY > DOCK_AT ? "dock" : "hero";
        if (viewRef.current !== want) {
          setViewNow(want);
          if (want === "dock") placeDock();
          else placeHero();
        }
        return;
      }
      if (rageRef.current) return;
      const ph = phaseRef.current;
      if (ph === "hero") {
        placeHero();
        if (window.scrollY > DOCK_AT) begin("dock");
      } else if (ph === "dock") {
        if (window.scrollY <= UNDOCK_AT) begin("hero");
      }
    };

    let raf = 0;
    const onScrollRaf = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; onScroll(); });
    };

    let alive = true;
    measure();
    if (window.scrollY > DOCK_AT) {
      setViewNow("dock");
      placeDock();
      go("dock");
      setSettled(true);
    } else {
      setViewNow("hero");
      placeHero();
      go("hero");
    }
    const ro = new ResizeObserver(() => { if (alive) measure(); });
    ro.observe(mark);
    ro.observe(nav);
    document.fonts?.ready.then(() => { if (alive) measure(); }).catch(() => {});
    window.addEventListener("scroll", onScrollRaf, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      alive = false;
      clear();
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollRaf);
      window.removeEventListener("resize", measure);
      snap.current = () => {};
    };
  }, [reduced]);

  /* DevTools: red body, angry brows, a line. Docked DevTools changes the
     outer/inner window delta; undocked does not, which is a fair trade. */
  useEffect(() => {
    const check = () => {
      const w = window.outerWidth - window.innerWidth;
      const h = window.outerHeight - window.innerHeight;
      const open = window.innerWidth > 760 && (w > 160 || h > 160);
      setDevtools(open);
    };
    check();
    const id = window.setInterval(check, 1200);
    window.addEventListener("resize", check);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("resize", check);
    };
  }, []);

  /* the works cards hand their project line over; the pointer leaving one
     waits a beat, so crossing a gap between two cards does not blink */
  useEffect(() => {
    let hide = 0;
    const onSay = (e: Event) => {
      const text = (e as CustomEvent<string>).detail ?? "";
      window.clearTimeout(hide);
      if (!text) {
        hide = window.setTimeout(() => setProject(null), 140);
        return;
      }
      setProject({ text, id: Date.now() });
    };
    const onScroll = () => {
      window.clearTimeout(hide);
      setProject(null);
    };
    window.addEventListener("bup:say", onSay);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(hide);
      window.removeEventListener("bup:say", onSay);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* 30 quiet seconds and the guide naps; any activity wakes it */
  useEffect(() => {
    setSleeping(false);
    if (devtools || rage || away) return;
    let timer = 0;
    const reset = () => {
      window.clearTimeout(timer);
      setSleeping(false);
      timer = window.setTimeout(() => {
        setSleeping(true);
        setHovered(false);
        setPokeKind(false);
      }, IDLE_MS);
    };
    const events = ["pointermove", "scroll", "keydown", "pointerdown", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [devtools, rage, away]);

  useEffect(() => () => {
    window.clearTimeout(pokeTimer.current);
    Object.values(rageTimers.current).forEach((id) => window.clearTimeout(id));
  }, []);

  const clearRage = () => {
    Object.values(rageTimers.current).forEach((id) => window.clearTimeout(id));
    rageTimers.current = { leave: 0, away: 0, back: 0, special: 0, settle: 0 };
  };

  const onPoke = (): string | false | void => {
    if (awayRef.current || rageRef.current) return false;

    const now = performance.now();
    if (now - lastPoke.current > POKE_WINDOW) pokeCount.current = 0;
    lastPoke.current = now;
    pokeCount.current += 1;

    if (pokeCount.current >= POKE_LIMIT) {
      pokeCount.current = 0;
      setPokeKind(false);
      setHovered(false);
      setSleeping(false);
      setRage(true);
      rageRef.current = true;
      const line = pick(SNARK);
      clearRage();

      rageTimers.current.leave = window.setTimeout(() => {
        setLeaving(true);
        rageTimers.current.away = window.setTimeout(() => {
          setLeaving(false);
          setAway(true);
          awayRef.current = true;
          rageTimers.current.back = window.setTimeout(() => {
            awayRef.current = false;
            rageRef.current = false;
            setAway(false);
            setRage(false);
            /* the page may have been scrolled while he was away: land on the
               spot that matches the current scroll, not the old one */
            snap.current();
            setReturning(true);
            setSpecial({ text: pick(RETURN), id: Date.now() });
            rageTimers.current.special = window.setTimeout(() => setSpecial(null), 6500);
            rageTimers.current.settle = window.setTimeout(() => setReturning(false), RETURN_MS);
          }, RAGE_AWAY_MS);
        }, RAGE_OUT_MS);
      }, RAGE_LEAVE_MS);

      return line;
    }

    setPokeKind(true);
    setSleeping(false);
    window.clearTimeout(pokeTimer.current);
    pokeTimer.current = window.setTimeout(() => setPokeKind(false), 3500);
    return;
  };

  const asleep = sleeping && !devtools && !rage && !away;

  /* the first hello, once per visit */
  useEffect(() => {
    let timer = 0;
    const start = () => {
      if (greeted.current) return;
      greeted.current = true;
      timer = window.setTimeout(() => {
        setGreet({ text: pick(GREETINGS), id: Date.now() });
        window.setTimeout(() => setGreet(null), 7500);
      }, 1300);
    };
    if (document.body.classList.contains("revealed")) start();
    else document.addEventListener("revealed", start, { once: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("revealed", start);
    };
  }, []);

  /* the hello belongs to the hero: once he is docked, it goes away */
  useEffect(() => {
    if (view === "dock") setGreet(null);
  }, [view]);

  /* and a quiet line now and then while he is docked and awake */
  useEffect(() => {
    if (!settled || asleep || devtools || rage || away) return;
    let timer = 0;
    let clear = 0;
    const schedule = () => {
      timer = window.setTimeout(() => {
        setChatter({ text: pick(CHATTER), id: Date.now() });
        clear = window.setTimeout(() => setChatter(null), 6500);
        schedule();
      }, 55_000 + Math.random() * 50_000);
    };
    schedule();
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clear);
    };
  }, [settled, asleep, devtools, rage, away]);

  const say = devtools
    ? DEV_NOTE
    : special
      ?? (settled && !away && !rage ? project ?? chatter : null)
      ?? greet;
  const mood = devtools || rage ? "angry" : pokeKind ? "kind" : hovered ? "curious" : "normal";
  const classes = [
    "guide",
    view === "dock" ? "guide--dock" : "",
    devtools || rage ? "guide--angry" : "",
    away ? "guide--away" : "",
    leaving ? "guide--leaving" : "",
    returning ? "guide--returning" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
    <div
      className={classes}
      ref={ref}
      role="group"
      aria-label={asleep ? "Буп, гид по сайту, спит" : "Буп, гид по сайту"}
    >
      <div
        className={`guide-motion guide-motion--${phase}`}
        style={{ "--dx": target === "dock" ? "-30px" : "30px" } as CSSProperties}
      >
        <EyeTracker
          size={view === "dock" ? (phone ? DOCK_BALL_PHONE : DOCK_BALL) : HERO_BALL}
          shape="Cube"
          eyes="Slant"
          eyeScale={1.18}
          follow={70}
          bounce={34}
          within={view === "dock" ? "body" : ".hero"}
          say={say}
          mood={mood}
          sleeping={asleep}
          onPoke={onPoke}
          onHover={setHovered}
        />
      </div>
      {asleep ? (
        <span className="guide-zzz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>
      ) : null}
    </div>
    </>
  );
}
