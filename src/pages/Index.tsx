import { useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/a459cf39-5ed7-4534-aa94-5e7015977a09/files/26c175c6-ee09-4dbf-818b-9884b18447ec.jpg";
const MERCH_IMG = "https://cdn.poehali.dev/projects/a459cf39-5ed7-4534-aa94-5e7015977a09/files/07af79a3-8641-47ca-a494-39e83f647f57.jpg";
const CONCERT_IMG = "https://cdn.poehali.dev/projects/a459cf39-5ed7-4534-aa94-5e7015977a09/files/7a1ab9f7-ed99-46ac-992b-f8b0d714c1b3.jpg";

const TRACKS = [
  { id: 1, title: "СИГНАЛ_01", duration: "3:47", bpm: "128" },
  { id: 2, title: "НОЧНАЯ МАТЕРИЯ", duration: "4:12", bpm: "96" },
  { id: 3, title: "РАСПАД / REBUILD", duration: "5:01", bpm: "140" },
  { id: 4, title: "ОБСИДИАН", duration: "3:28", bpm: "115" },
  { id: 5, title: "ФАНТОМНЫЙ СЛЕД", duration: "6:33", bpm: "88" },
];

const EVENTS = [
  { id: 1, date: "15 APR 2026", venue: "ГЛАВCLUB GREEN CONCERT", city: "МОСКВА", status: "СКОРО", target: new Date("2026-04-15") },
  { id: 2, date: "02 MAY 2026", venue: "A2 GREEN CONCERT", city: "САНКТ-ПЕТЕРБУРГ", status: "БИЛЕТЫ", target: new Date("2026-05-02") },
  { id: 3, date: "20 MAY 2026", venue: "TELE-CLUB", city: "ЕКАТЕРИНБУРГ", status: "БИЛЕТЫ", target: new Date("2026-05-20") },
  { id: 4, date: "07 JUN 2026", venue: "КОСМОНАВТ", city: "КАЗАНЬ", status: "СКОРО", target: new Date("2026-06-07") },
];

const MERCH_ITEMS = [
  { id: 1, name: "HOODIE // OBSIDIAN", price: "4 900 ₽", tag: "LTD" },
  { id: 2, name: "TEE // SIGNAL_01", price: "2 400 ₽", tag: "NEW" },
  { id: 3, name: "CAP // CHROME", price: "1 800 ₽", tag: null },
  { id: 4, name: "JACKET // VOID", price: "8 500 ₽", tag: "LTD" },
];

const GALLERY_ITEMS = [HERO_IMG, CONCERT_IMG, MERCH_IMG, HERO_IMG, CONCERT_IMG, MERCH_IMG];

function useCountdown(target: Date) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

function WaveformVisualizer({ playing }: { playing: boolean }) {
  const bars = Array.from({ length: 32 }, (_, i) => i);
  return (
    <div className="flex items-end gap-[2px] h-12">
      {bars.map((i) => (
        <div
          key={i}
          className="wave-bar bg-acid flex-1"
          style={{
            height: `${20 + Math.sin(i * 0.8) * 15 + Math.cos(i * 0.4) * 10}px`,
            "--duration": `${0.4 + (i % 7) * 0.1}s`,
            "--delay": `${(i % 5) * 0.07}s`,
            animationPlayState: playing ? "running" : "paused",
            opacity: playing ? 1 : 0.3,
            transition: "opacity 0.5s",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function MusicPlayer() {
  const [current, setCurrent] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = (id: number) => {
    if (current === id) {
      setPlaying(!playing);
    } else {
      setCurrent(id);
      setPlaying(true);
    }
  };

  return (
    <div className="border border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <span className="font-mono text-xs text-white/40 tracking-widest">TERMINAL://PLAYER v2.0</span>
        <span className="font-mono text-xs text-acid blink">■ REC</span>
      </div>

      {current !== null && (
        <div className="px-6 py-4 border-b border-white/5">
          <div className="font-mono text-xs text-white/40 mb-2 tracking-wider">
            NOW PLAYING → {TRACKS.find(t => t.id === current)?.title}
          </div>
          <WaveformVisualizer playing={playing} />
        </div>
      )}

      <div className="divide-y divide-white/5">
        {TRACKS.map((track, i) => (
          <button
            key={track.id}
            onClick={() => toggle(track.id)}
            className="w-full px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-all group text-left"
          >
            <div className="w-8 h-8 border border-white/10 flex items-center justify-center group-hover:border-acid transition-colors flex-shrink-0">
              {current === track.id && playing ? (
                <Icon name="Pause" size={14} className="text-acid" />
              ) : (
                <Icon name="Play" size={14} className="text-white/40 group-hover:text-acid transition-colors" />
              )}
            </div>
            <span className="font-mono text-xs text-white/20 w-4">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-oswald text-base tracking-wider flex-1 group-hover:text-acid transition-colors">
              {track.title}
            </span>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-white/20">BPM:{track.bpm}</span>
              <span className="font-mono text-xs text-white/40">{track.duration}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CountdownEvent({ event }: { event: typeof EVENTS[0] }) {
  const time = useCountdown(event.target);
  return (
    <div className="border border-white/5 hover:border-acid/30 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-acid/0 to-acid/0 group-hover:from-acid/5 transition-all duration-700" />
      <div className="p-6 relative">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-mono text-xs text-white/30 tracking-widest mb-1">{event.date}</div>
            <div className="font-oswald text-xl tracking-wider">{event.venue}</div>
            <div className="font-mono text-xs text-acid/70 mt-1">{event.city}</div>
          </div>
          <span className="font-mono text-xs border border-acid/40 text-acid px-2 py-1 tracking-widest">
            {event.status}
          </span>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
          <span className="font-mono text-xs text-white/20 tracking-widest">ОТСЧЁТ:</span>
          <div className="flex gap-3">
            {[{ v: time.d, l: "Д" }, { v: time.h, l: "Ч" }, { v: time.m, l: "М" }, { v: time.s, l: "С" }].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="font-oswald text-lg countdown-digit">{String(v).padStart(2, "0")}</div>
                <div className="font-mono text-xs text-white/20">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Index() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
      if (trailRef.current) {
        trailRef.current.style.left = e.clientX + "px";
        trailRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const NAV = [
    { id: "about", label: "О МНЕ" },
    { id: "music", label: "МУЗЫКА" },
    { id: "events", label: "АФИША" },
    { id: "merch", label: "МЕРЧ" },
    { id: "gallery", label: "ГАЛЕРЕЯ" },
    { id: "video", label: "ВИДЕО" },
    { id: "contact", label: "КОНТАКТЫ" },
  ];

  return (
    <>
      <div ref={cursorRef} className="custom-cursor" />
      <div ref={trailRef} className="cursor-trail" />

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-obsidian/80 backdrop-blur-md">
        <button
          onClick={() => scrollTo("hero")}
          className="font-oswald text-xl tracking-[0.3em] text-white glitch-text"
          data-text="МРАКОБЕСИЕ 2.0"
        >
          МРАКОБЕСИЕ 2.0
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`nav-link font-mono text-xs tracking-widest transition-colors ${
                activeSection === item.id ? "text-acid" : "text-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-white/70 hover:text-acid transition-colors"
          onClick={() => setNavOpen(!navOpen)}
        >
          <Icon name={navOpen ? "X" : "Menu"} size={20} />
        </button>
      </nav>

      {navOpen && (
        <div className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="font-oswald text-3xl tracking-widest text-white/70 hover:text-acid transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMG}
            alt="Артист"
            className="w-full h-full object-cover object-top opacity-40 scale-105"
            style={{ filter: "contrast(1.2) brightness(0.6)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian/60 via-transparent to-obsidian" />
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-transparent to-obsidian/80" />
        </div>

        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="smoke-particle absolute w-2 h-2 rounded-full bg-acid/20 blur-sm"
            style={{
              left: `${10 + i * 15}%`,
              bottom: "20%",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.4}s`,
            }}
          />
        ))}

        <div className="relative z-10 text-center px-8">
          <div className="font-mono text-xs text-acid/60 tracking-[0.5em] mb-8 reveal-up">
            // ОФИЦИАЛЬНЫЙ САЙТ
          </div>
          <h1
            className="font-oswald leading-none tracking-tight mb-0 reveal-up reveal-delay-1 glitch-text chrome-text"
            style={{ fontSize: "clamp(5rem, 18vw, 18rem)" }}
            data-text="МРАКОБЕСИЕ 2.0"
          >
            МРАКОБЕСИЕ 2.0
          </h1>
          <div className="font-cormorant italic text-2xl text-white/30 tracking-widest mb-12 reveal-up reveal-delay-2">
            нео-хром / ритуал / распад
          </div>
          <div className="flex items-center justify-center gap-6 reveal-up reveal-delay-3">
            <button
              onClick={() => scrollTo("music")}
              className="px-8 py-3 bg-acid text-white font-mono text-xs tracking-widest hover:bg-acid/80 transition-all pulse-acid"
            >
              СЛУШАТЬ
            </button>
            <button
              onClick={() => scrollTo("events")}
              className="px-8 py-3 border border-white/20 text-white/70 font-mono text-xs tracking-widest hover:border-acid hover:text-acid transition-all"
            >
              АФИША
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 reveal-up reveal-delay-5">
          <span className="font-mono text-xs text-white/20 tracking-widest">СКРОЛЛ</span>
          <div className="w-px h-12 bg-gradient-to-b from-acid/60 to-transparent" />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 px-8 md:px-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// ИДЕНТИФИКАЦИЯ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight mb-8 chrome-text">О МНЕ</h2>
            <p className="font-cormorant text-xl text-white/60 leading-relaxed mb-6 italic">
              Музыкант, работающий на пересечении электронной тьмы и промышленного звука.
              Каждый трек — это ритуал распада и возрождения, запечатанный в цифровом янтаре.
            </p>
            <p className="font-mono text-sm text-white/30 leading-relaxed mb-8">
              С 2018 года создаю звуковые ландшафты, которые существуют между реальностью и помехами.
              Три альбома, десятки выступлений в подпольных пространствах.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-8">
              {[
                { val: "3", label: "АЛЬБОМА" },
                { val: "47+", label: "КОНЦЕРТОВ" },
                { val: "2018", label: "ОСНОВАН" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <div className="font-oswald text-3xl text-acid">{val}</div>
                  <div className="font-mono text-xs text-white/30 tracking-wider mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={HERO_IMG}
                alt="Артист"
                className="w-full h-full object-cover img-distort"
                style={{ filter: "saturate(0.6) contrast(1.2)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="font-mono text-xs text-white/30 tracking-widest mb-1">КООРДИНАТЫ:</div>
                <div className="font-mono text-xs text-acid/80">55.7558° N, 37.6173° E</div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full border border-acid/20 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* MUSIC */}
      <section id="music" className="py-32 px-8 md:px-24 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// АУДИО АРХИВ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight chrome-text">МУЗЫКА</h2>
          </div>
          <MusicPlayer />
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { icon: "Music", label: "SPOTIFY" },
              { icon: "Headphones", label: "APPLE MUSIC" },
              { icon: "Radio", label: "VK МУЗЫКА" },
            ].map(({ icon, label }) => (
              <a
                key={label}
                href="#"
                className="flex items-center gap-2 px-6 py-3 border border-white/10 text-white/40 font-mono text-xs tracking-wider hover:border-acid/40 hover:text-acid/70 transition-all"
              >
                <Icon name={icon} size={14} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="py-32 px-8 md:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// РИТУАЛЫ / ИНЦИДЕНТЫ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight chrome-text">АФИША</h2>
          </div>
          <div className="grid gap-4">
            {EVENTS.map((event) => (
              <CountdownEvent key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* MERCH */}
      <section id="merch" className="py-32 px-8 md:px-24 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// АРТЕФАКТЫ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight chrome-text">МЕРЧ</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {MERCH_ITEMS.map((item) => (
              <div key={item.id} className="bg-obsidian group cursor-pointer relative overflow-hidden">
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={MERCH_IMG}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 img-distort"
                    style={{ filter: "saturate(0.2) contrast(1.3)" }}
                  />
                  {item.tag && (
                    <div className="absolute top-4 left-4 bg-acid text-white font-mono text-xs px-2 py-1 tracking-wider">
                      {item.tag}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <div className="font-mono text-xs text-white/40 tracking-wider mb-1">{item.name}</div>
                  <div className="font-oswald text-xl text-acid">{item.price}</div>
                  <button className="mt-4 w-full py-2 border border-white/10 font-mono text-xs text-white/40 tracking-wider hover:border-acid hover:text-acid transition-all">
                    В КОРЗИНУ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-32 px-8 md:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// ВИЗУАЛЬНЫЙ АРХИВ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight chrome-text">ГАЛЕРЕЯ</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
            {GALLERY_ITEMS.map((src, i) => (
              <div key={i} className="relative aspect-square overflow-hidden group bg-obsidian">
                <img
                  src={src}
                  alt={`Фото ${i + 1}`}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 img-distort"
                  style={{ filter: "saturate(0.3) contrast(1.2)" }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-500" />
                <div className="absolute bottom-4 left-4 font-mono text-xs text-white/20 group-hover:text-acid transition-colors">
                  #{String(i + 1).padStart(3, "0")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO */}
      <section id="video" className="py-32 px-8 md:px-24 bg-black/20">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// ВИЗУАЛЬНЫЕ СИГНАЛЫ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight chrome-text">ВИДЕО</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {[
              { title: "ОБСИДИАН — Official Video", views: "128K", year: "2025", img: CONCERT_IMG },
              { title: "LIVE @ ГЛАВCLUB 2025", views: "84K", year: "2025", img: HERO_IMG },
              { title: "РАСПАД / REBUILD — Visualizer", views: "67K", year: "2025", img: MERCH_IMG },
              { title: "НОЧНАЯ МАТЕРИЯ — Official Video", views: "211K", year: "2024", img: CONCERT_IMG },
            ].map((vid, i) => (
              <div key={i} className="relative group cursor-pointer bg-obsidian overflow-hidden">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={vid.img}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: "saturate(0.3) contrast(1.3) brightness(0.7)" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-white/30 rounded-full flex items-center justify-center group-hover:border-acid group-hover:scale-110 transition-all duration-300">
                      <Icon name="Play" size={24} className="text-white/50 group-hover:text-acid ml-1 transition-colors" />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 to-transparent" />
                </div>
                <div className="p-5">
                  <div className="font-oswald text-lg tracking-wider group-hover:text-acid transition-colors mb-2">
                    {vid.title}
                  </div>
                  <div className="flex gap-4">
                    <span className="font-mono text-xs text-white/30">{vid.views} ПРОСМОТРОВ</span>
                    <span className="font-mono text-xs text-white/20">{vid.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 px-8 md:px-24">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-4">// УСТАНОВИТЬ СВЯЗЬ</div>
            <h2 className="font-oswald text-6xl md:text-8xl tracking-tight chrome-text">КОНТАКТЫ</h2>
          </div>
          <div className="grid gap-px bg-white/5">
            {[
              { icon: "Mail" as const, label: "EMAIL", value: "info@artist.ru", href: "mailto:info@artist.ru" },
              { icon: "Send" as const, label: "TELEGRAM", value: "@artist_official", href: "https://t.me/artist_official" },
              { icon: "Instagram" as const, label: "INSTAGRAM", value: "@artist.official", href: "#" },
              { icon: "Youtube" as const, label: "YOUTUBE", value: "ARTIST CHANNEL", href: "#" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-6 p-6 bg-obsidian hover:bg-white/[0.03] transition-all group"
              >
                <div className="w-12 h-12 border border-white/10 group-hover:border-acid flex items-center justify-center transition-colors flex-shrink-0">
                  <Icon name={item.icon} size={18} className="text-white/30 group-hover:text-acid transition-colors" />
                </div>
                <div>
                  <div className="font-mono text-xs text-white/20 tracking-widest mb-1">{item.label}</div>
                  <div className="font-oswald text-lg tracking-wider group-hover:text-acid transition-colors">{item.value}</div>
                </div>
                <Icon name="ArrowRight" size={16} className="ml-auto text-white/10 group-hover:text-acid transition-all group-hover:translate-x-2" />
              </a>
            ))}
          </div>

          <div className="mt-12 p-8 border border-white/5">
            <div className="font-mono text-xs text-acid/60 tracking-widest mb-6">// ФОРМА СВЯЗИ</div>
            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="ИМЯ"
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 font-mono text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-acid transition-colors tracking-wider"
                />
                <input
                  placeholder="EMAIL"
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 font-mono text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-acid transition-colors tracking-wider"
                />
              </div>
              <textarea
                placeholder="СООБЩЕНИЕ..."
                rows={4}
                className="w-full bg-black/40 border border-white/10 px-4 py-3 font-mono text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-acid transition-colors tracking-wider resize-none"
              />
              <button className="px-8 py-3 bg-acid text-white font-mono text-xs tracking-widest hover:bg-acid/80 transition-all self-start">
                ОТПРАВИТЬ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 px-8 md:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-oswald text-2xl tracking-[0.3em] chrome-text">МРАКОБЕСИЕ 2.0</div>
          <div className="font-mono text-xs text-white/20 tracking-wider">
            © 2026 — ВСЕ ПРАВА ЗАЩИЩЕНЫ
          </div>
          <div className="font-mono text-xs text-white/20 tracking-wider blink">
            SYS_VERSION: 2.0.26
          </div>
        </div>
      </footer>
    </>
  );
}