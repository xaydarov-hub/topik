import { useState, useEffect, useRef, useCallback } from "react";
import { vocabularyData } from "./vocabularyData";
import { grammarData } from "./grammarData";

// ============================================================
// TOPIK MASTER UZ — Premium React App
// All components, hooks, logic in one file
// ============================================================

// ─── MOTION SHIM (works without framer-motion install) ───────
// If framer-motion is installed, swap this with:
// import { motion, AnimatePresence } from "framer-motion";
const motion = {
  div: ({ children, className, style, onClick, initial, animate, exit, transition, whileHover, whileTap, ...rest }) => {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current) return;
      const el = ref.current;
      if (animate) {
        const opts = { duration: (transition?.duration || 0.4) * 1000, fill: "forwards", easing: "cubic-bezier(0.4,0,0.2,1)" };
        const from = {};
        const to = {};
        if (animate.opacity !== undefined) { from.opacity = initial?.opacity ?? 0; to.opacity = animate.opacity; }
        if (animate.y !== undefined) { from.transform = `translateY(${initial?.y ?? 20}px)`; to.transform = `translateY(${animate.y}px)`; }
        if (animate.x !== undefined) { from.transform = `translateX(${initial?.x ?? -20}px)`; to.transform = `translateX(${animate.x}px)`; }
        if (animate.scale !== undefined) { from.transform = `scale(${initial?.scale ?? 0.9})`; to.transform = `scale(${animate.scale})`; }
        el.animate([from, to], opts);
      }
    }, []);
    return <div ref={ref} className={className} style={style} onClick={onClick} {...rest}>{children}</div>;
  }
};
const AnimatePresence = ({ children }) => <>{children}</>;

// ─── LUCIDE ICONS (SVG inline) ────────────────────────────────
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
    "book-open": <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 007 4.5v0A2.5 2.5 0 004.5 7v0A2.5 2.5 0 002 9.5v0A2.5 2.5 0 004.5 12v0a2.5 2.5 0 002.5 2.5v0A2.5 2.5 0 009.5 17v0h5v0a2.5 2.5 0 002.5-2.5v0A2.5 2.5 0 0019.5 12v0A2.5 2.5 0 0022 9.5v0A2.5 2.5 0 0019.5 7v0A2.5 2.5 0 0017 4.5v0A2.5 2.5 0 0014.5 2v0h-5z"/></>,
    zap: <><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/></>,
    star: <><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    sun: <><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>,
    moon: <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></>,
    check: <><polyline points="20,6 9,17 4,12"/></>,
    "rotate-ccw": <><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></>,
    "chevron-right": <><polyline points="9,18 15,12 9,6"/></>,
    "chevron-left": <><polyline points="15,18 9,12 15,6"/></>,
    "chevron-down": <><polyline points="6,9 12,15 18,9"/></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    filter: <><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"/></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></>,
    "volume-2": <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5"/><path d="M19.07 4.93a10 10 0 010 14.14"/><path d="M15.54 8.46a5 5 0 010 7.07"/></>,
    "refresh-cw": <><polyline points="23,4 23,10 17,10"/><polyline points="1,20 1,14 7,14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12"/></>,
    timer: <><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></>,
    layers: <><polygon points="12,2 2,7 12,12 22,7 12,2"/><polyline points="2,17 12,22 22,17"/><polyline points="2,12 12,17 22,12"/></>,
    "bar-chart": <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    "trending-up": <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/><polyline points="17,6 23,6 23,12"/></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    "play-circle": <><circle cx="12" cy="12" r="10"/><polygon points="10,8 16,12 10,16 10,8"/></>,
    "skip-forward": <><polygon points="5,4 15,12 5,20 5,4"/><line x1="19" y1="5" x2="19" y2="19"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    "message-circle": <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75z"/><path d="M18 1l.75 2.25L21 4l-2.25.75L18 7l-.75-2.25L15 4l2.25-.75z"/></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
    "arrow-right": <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
    "grid-3": <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></>,
    "eye": <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    "lightbulb": <><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></>,
    "infinity": <><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 000 8c2 0 4-1.5 6-4z"/><path d="M12 12c2 2.5 4 4 6 4a4 4 0 000-8c-2 0-4 1.5-6 4z"/></>,
    "flag": <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></>,
    "circle": <><circle cx="12" cy="12" r="10"/></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name] || icons["circle"]}
    </svg>
  );
};

// ─── HOOKS ────────────────────────────────────────────────────
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch { return defaultValue; }
  });
  const setStoredValue = useCallback((newValue) => {
    setValue(prev => {
      const val = typeof newValue === "function" ? newValue(prev) : newValue;
      try { window.localStorage.setItem(key, JSON.stringify(val)); } catch {}
      return val;
    });
  }, [key]);
  return [value, setStoredValue];
}

function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds(s => s <= 0 ? 0 : s - 1), 1000);
    } else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running]);
  return { seconds, running, start: () => setRunning(true), stop: () => setRunning(false), reset: (s) => { setRunning(false); setSeconds(s ?? initialSeconds); } };
}

// ─── CONSTANTS ────────────────────────────────────────────────
const RANKS = [
  { name: "Yangi boshlovchi", min: 0, color: "#6b7280", icon: "circle" },
  { name: "Bronza", min: 100, color: "#cd7f32", icon: "award" },
  { name: "Kumush", min: 500, color: "#9ca3af", icon: "star" },
  { name: "Oltin", min: 1500, color: "#f59e0b", icon: "trophy" },
  { name: "Diamond", min: 4000, color: "#06b6d4", icon: "sparkles" },
  { name: "Grandmaster", min: 10000, color: "#8b5cf6", icon: "rocket" },
];
const ACHIEVEMENTS = [
  { id: "first_word", label: "Birinchi so'z", desc: "1 ta so'z yodlandi", icon: "star", xp: 10 },
  { id: "ten_words", label: "O'nta kalit", desc: "10 ta so'z yodlandi", icon: "zap", xp: 50 },
  { id: "hundred_words", label: "Yuz qadamchi", desc: "100 ta so'z yodlandi", icon: "trophy", xp: 200 },
  { id: "streak_3", label: "3 kunlik zanjir", desc: "3 kun ketma-ket", icon: "flame", xp: 75 },
  { id: "streak_7", label: "Haftalik jangchi", desc: "7 kun ketma-ket", icon: "flame", xp: 200 },
  { id: "first_quiz", label: "Birinchi sinov", desc: "Birinchi quiz yakunlandi", icon: "target", xp: 30 },
  { id: "perfect_quiz", label: "Mukammal!", desc: "100% natija", icon: "award", xp: 150 },
  { id: "grammar_10", label: "Grammatika ustasi", desc: "10 ta grammatika o'rganildi", icon: "brain", xp: 100 },
];
const MOTIVATIONAL_QUOTES = [
  "한국어는 매일 연습해야 해요! 포기하지 마세요! 🔥",
  "Har bir kichik qadam — katta g'alabaga olib boradi! 🚀",
  "TOPIK sertifikati orzusi emas, maqsad! 🎯",
  "오늘도 화이팅! Bugun ham kuch bilan! 💪",
  "Har kuni 1% o'sish — 365 kunda 37x yaxshiroq! 📈",
  "Koreys tili qiyin emas — faqat izchillik kerak! ⚡",
];

// ─── FALLBACK DATA (if import fails) ─────────────────────────
const FALLBACK_VOCAB = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  korean: ["안녕하세요", "감사합니다", "사랑해요", "학교", "친구", "책", "물", "밥", "집", "일", "공부", "한국", "사람", "이름", "시간", "날씨", "음식", "영화", "음악", "여행"][i % 20] || `단어 ${i+1}`,
  uzbek: ["Salom", "Rahmat", "Sevaman", "Maktab", "Do'st", "Kitob", "Suv", "Guruch", "Uy", "Ish", "O'qish", "Koreya", "Odam", "Ism", "Vaqt", "Ob-havo", "Ovqat", "Kino", "Musiqa", "Sayohat"][i % 20] || `So'z ${i+1}`,
  pronunciation: ["annyeonghaseyo", "gamsahamnida", "saranghaeyo", "hakgyo", "chingu", "chaek", "mul", "bap", "jip", "il", "gongbu", "hanguk", "saram", "ireum", "sigan", "nalssi", "eumsik", "yeonghwa", "eumak", "yeohaeng"][i % 20] || `talaffuz`,
  example: `저는 ${["안녕하세요", "감사합니다"][i % 2]}라고 말해요.`,
  category: ["Asosiy", "Kundalik", "Maktab", "Tabiat"][i % 4],
  difficulty: ["easy", "medium", "hard"][i % 3],
}));
const FALLBACK_GRAMMAR = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: [`이에요/예요 — Bu/U`, `은/는 — Mavzu belgisi`, `이/가 — Ega belgisi`, `을/를 — To'ldiruvchi`, `에 — Joy/Vaqt`, `에서 — Joylashuv`, `하고 — va (bilan)`, `그리고 — va`, `그런데 — lekin`, `왜냐하면 — chunki`][i % 10] || `Grammatika ${i+1}`,
  explanation: `Bu grammatik qoida ${i + 1}-darsda muhim rol o'ynaydi.`,
  formula: `[Ot] + [qo'shimcha]`,
  examples: [`예문 ${i+1}: 저는 학생이에요.`, `예문 ${i+1}b: 이것은 책이에요.`],
  tips: `Bu qoidani kundalik hayotda ishlating.`,
  level: ["A1", "A2", "B1"][i % 3],
}));

// ─── STYLES ───────────────────────────────────────────────────
const GlobalStyle = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
    :root{
      --bg: ${dark ? "#0f0f13" : "#f5f3ff"};
      --bg2: ${dark ? "#16161e" : "#ffffff"};
      --bg3: ${dark ? "#1e1e2a" : "#f0eeff"};
      --card: ${dark ? "#1c1c26" : "#ffffff"};
      --card2: ${dark ? "#22222f" : "#f8f7ff"};
      --border: ${dark ? "rgba(139,92,246,0.18)" : "rgba(139,92,246,0.15)"};
      --border2: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
      --text: ${dark ? "#f1f0ff" : "#1a1625"};
      --text2: ${dark ? "#9b99b5" : "#6b6484"};
      --text3: ${dark ? "#6b6484" : "#9b99b5"};
      --primary: #7c3aed;
      --primary2: #6d28d9;
      --accent: #06b6d4;
      --accent2: #0891b2;
      --gold: #f59e0b;
      --green: #10b981;
      --red: #ef4444;
      --pink: #ec4899;
      --grad1: linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4c1d95 100%);
      --grad2: linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%);
      --grad3: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      --glow: 0 0 40px rgba(124,58,237,0.3);
      --glow2: 0 0 20px rgba(6,182,212,0.2);
      --shadow: ${dark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(124,58,237,0.12)"};
      --shadow2: ${dark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(124,58,237,0.08)"};
      --r: 16px;
      --r2: 12px;
      --r3: 8px;
      --font: 'Nunito', sans-serif;
      --font-kr: 'Noto Sans KR', sans-serif;
    }
    html,body{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh;transition:background 0.3s,color 0.3s;}
    input,textarea,select{font-family:var(--font);background:var(--card2);color:var(--text);border:1.5px solid var(--border);border-radius:var(--r3);padding:10px 14px;font-size:14px;outline:none;transition:all 0.2s;}
    input:focus,textarea:focus,select:focus{border-color:var(--primary);box-shadow:0 0 0 3px rgba(124,58,237,0.15);}
    button{font-family:var(--font);cursor:pointer;transition:all 0.2s;}
    ::-webkit-scrollbar{width:4px;height:4px;}
    ::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:var(--primary);border-radius:4px;}
    .glass{background:${dark ? "rgba(28,28,38,0.85)" : "rgba(255,255,255,0.85)"};backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}
    .kr{font-family:var(--font-kr);}
    .btn-primary{background:var(--grad1);color:#fff;border:none;border-radius:var(--r3);padding:10px 20px;font-weight:700;font-size:14px;box-shadow:var(--glow);}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(124,58,237,0.5);}
    .btn-primary:active{transform:translateY(0);}
    .btn-ghost{background:transparent;color:var(--text2);border:1.5px solid var(--border);border-radius:var(--r3);padding:9px 18px;font-weight:600;font-size:14px;}
    .btn-ghost:hover{background:var(--bg3);color:var(--text);border-color:var(--primary);}
    .card{background:var(--card);border:1px solid var(--border2);border-radius:var(--r);box-shadow:var(--shadow2);}
    .card-glow{background:var(--card);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--shadow);}
    .badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;}
    .badge-purple{background:rgba(124,58,237,0.15);color:#a78bfa;}
    .badge-cyan{background:rgba(6,182,212,0.15);color:#22d3ee;}
    .badge-gold{background:rgba(245,158,11,0.15);color:#fbbf24;}
    .badge-green{background:rgba(16,185,129,0.15);color:#34d399;}
    .badge-red{background:rgba(239,68,68,0.15);color:#f87171;}
    .progress-bar{height:6px;border-radius:3px;background:var(--bg3);overflow:hidden;}
    .progress-fill{height:100%;border-radius:3px;background:var(--grad1);transition:width 0.5s ease;}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes slideIn{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes bounce{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
    .animate-float{animation:float 3s ease-in-out infinite;}
    .animate-pulse{animation:pulse 2s ease-in-out infinite;}
    .animate-bounce{animation:bounce 0.6s ease;}
    .animate-fadein{animation:fadeUp 0.4s ease both;}
    .hover-scale:hover{transform:scale(1.02);}
    .hover-lift:hover{transform:translateY(-4px);box-shadow:var(--glow);}
    @media(max-width:768px){
      .hide-mobile{display:none!important;}
      .mobile-col{flex-direction:column!important;}
    }
    @media(min-width:769px){.show-mobile-only{display:none!important;}}
  `}</style>
);
//quiz
// ─── HEADER ───────────────────────────────────────────────────
function Header({ dark, setDark, page, setPage, xp, streak, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const rank = RANKS.filter(r => xp >= r.min).pop();
  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "bar-chart" },
    { id: "vocab", label: "Lug'atlar", icon: "book" },
    { id: "grammar", label: "Grammatika", icon: "brain" },
    { id: "quiz", label: "Quiz", icon: "target" },
    { id: "progress", label: "Progress", icon: "trending-up" },
    { id: "calendar", label: "Kalendar", icon: "calendar" },
  ];
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, background: dark ? "rgba(15,15,19,0.92)" : "rgba(245,243,255,0.92)", backdropFilter: "blur(24px)", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 64 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow)", fontSize: 20, flexShrink: 0 }}>🇰🇷</div>
          <div className="hide-mobile">
            <div style={{ fontWeight: 900, fontSize: 15, background: "var(--grad2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.1 }}>TOPIK</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, letterSpacing: 2, lineHeight: 1 }}>MASTER UZ</div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ display: "flex", gap: 4, flex: 1, marginLeft: 16 }} className="hide-mobile">
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 13, background: page === n.id ? "rgba(124,58,237,0.15)" : "transparent", color: page === n.id ? "var(--primary)" : "var(--text2)", transition: "all 0.2s" }}>
              <Icon name={n.icon} size={15} /> {n.label}
            </button>
          ))}
        </nav>
        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
          {/* Streak */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(245,158,11,0.12)", color: "#f59e0b" }} className="hide-mobile">
            <Icon name="flame" size={16} /><span style={{ fontWeight: 800, fontSize: 13 }}>{streak}</span>
          </div>
          {/* XP */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(124,58,237,0.12)", color: "var(--primary)" }}>
            <Icon name="zap" size={16} /><span style={{ fontWeight: 800, fontSize: 13 }}>{xp}</span>
          </div>
          {/* Dark toggle */}
          <button onClick={() => setDark(d => !d)} style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
            <Icon name={dark ? "sun" : "moon"} size={17} />
          </button>
          {/* Avatar */}
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", boxShadow: "var(--glow)", border: "2px solid var(--primary)" }}>
            {user?.avatar || "👤"}
          </div>
          {/* Mobile menu */}
          <button className="show-mobile-only" onClick={() => setMobileOpen(o => !o)} style={{ width: 38, height: 38, borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
            <Icon name="menu" size={18} />
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {mobileOpen && (
        <div style={{ background: "var(--card)", borderTop: "1px solid var(--border2)", padding: "12px 16px" }}>
          {nav.map(n => (
            <button key={n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", fontWeight: 600, fontSize: 14, background: page === n.id ? "rgba(124,58,237,0.12)" : "transparent", color: page === n.id ? "var(--primary)" : "var(--text2)", marginBottom: 4 }}>
              <Icon name={n.icon} size={18} />{n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage }) {
  const [activeFloatCard, setActiveFloatCard] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveFloatCard(i => (i + 1) % 4), 2500);
    return () => clearInterval(t);
  }, []);
  const stats = [
    { label: "Lug'at", value: "1800+", icon: "book", color: "#7c3aed" },
    { label: "Grammatika", value: "150+", icon: "brain", color: "#06b6d4" },
    { label: "Foydalanuvchi", value: "12K+", icon: "user", color: "#10b981" },
    { label: "Sertifikat", value: "3K+", icon: "award", color: "#f59e0b" },
  ];
  const floatCards = [
    { label: "Kun seriyasi", value: "🔥 15 kun", color: "#f59e0b" },
    { label: "XP ball", value: "⚡ 2,450", color: "#7c3aed" },
    { label: "Yodlangan", value: "📚 340 so'z", color: "#10b981" },
    { label: "Daraja", value: "💎 Diamond", color: "#06b6d4" },
  ];
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section style={{ padding: "80px 0 60px", textAlign: "center", position: "relative" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        {/* Korean decorations */}
        <div style={{ position: "absolute", top: 60, left: "5%", fontSize: 48, opacity: 0.06, fontFamily: "var(--font-kr)", fontWeight: 900, userSelect: "none" }}>한국어</div>
        <div style={{ position: "absolute", top: 120, right: "5%", fontSize: 36, opacity: 0.06, fontFamily: "var(--font-kr)", fontWeight: 900, userSelect: "none" }}>TOPIK</div>
        <div className="badge badge-purple" style={{ marginBottom: 20, fontSize: 12 }}>
          <Icon name="sparkles" size={12} /> 🇰🇷 Koreya tili kursi — Premium
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 20, position: "relative" }}>
          <span style={{ background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>TOPIK 1 ni professional</span>
          <span style={{ color: "var(--text)" }}>darajada egalla 🇰🇷</span>
        </h1>
        <p style={{ fontSize: "clamp(14px, 2vw, 18px)", color: "var(--text2)", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.7 }}>
          1800 ta eng kerakli lug'at va 150 ta eng muhim grammatika bilan TOPIK imtihoniga tayyorlaning. Smart AI tizim bilan.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }} onClick={() => setPage("vocab")}>
            🚀 Boshlash
          </button>
          <button className="btn-ghost" style={{ padding: "14px 32px", fontSize: 16, borderRadius: 12 }} onClick={() => setPage("quiz")}>
            <Icon name="play-circle" size={18} /> Demo ko'rish
          </button>
        </div>
        {/* Float cards */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
          {floatCards.map((c, i) => (
            <div key={i} className="glass card animate-float" style={{ padding: "12px 20px", borderRadius: 14, border: `1.5px solid ${c.color}30`, animationDelay: `${i * 0.5}s`, transition: "all 0.3s", transform: activeFloatCard === i ? "translateY(-8px) scale(1.05)" : "translateY(0) scale(1)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 3 }}>{c.label}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      </section>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 60 }}>
        {stats.map((s, i) => (
          <div key={i} className="card hover-lift" style={{ padding: "24px 20px", textAlign: "center", transition: "all 0.3s", cursor: "default" }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: s.color }}>
              <Icon name={s.icon} size={24} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* TOPIK Menu Cards */}
      <section style={{ marginBottom: 80 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 8, textAlign: "center" }}>Imtihon Tanlash</h2>
        <p style={{ color: "var(--text2)", textAlign: "center", marginBottom: 32 }}>O'z darajangizga mos kursni tanlang</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <div className="card-glow hover-lift" style={{ padding: 32, cursor: "pointer", transition: "all 0.3s", position: "relative", overflow: "hidden" }} onClick={() => setPage("vocab")}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(124,58,237,0.08)" }} />
            <div style={{ fontSize: 48, marginBottom: 16 }}>🇰🇷</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>TOPIK 1</div>
            <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              Boshlang'ich daraja — A1–A2. 1800 so'z, 150 grammatika, full quiz tizimi.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <span className="badge badge-purple">1800 so'z</span>
              <span className="badge badge-cyan">150 grammatika</span>
              <span className="badge badge-green">Faol</span>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: 12 }}>Boshlash →</button>
          </div>
          <div className="card" style={{ padding: 32, position: "relative", overflow: "hidden", opacity: 0.6 }}>
            <div style={{ position: "absolute", top: 16, right: 16 }} className="badge badge-gold"><Icon name="rocket" size={12} /> Tez kunda</div>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
            <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, color: "var(--text2)" }}>TOPIK 2</div>
            <div style={{ color: "var(--text3)", fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
              O'rta va yuqori daraja — B1–C2. Rivojlangan grammatika va lug'at.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              <span className="badge badge-gold">Kelayapti 🚀</span>
            </div>
            <button style={{ width: "100%", padding: 12, borderRadius: 8, border: "1.5px solid var(--border)", background: "transparent", color: "var(--text3)", fontFamily: "var(--font)", fontWeight: 700, cursor: "not-allowed" }}>Kutilmoqda...</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── VOCAB SETUP ──────────────────────────────────────────────
function VocabSetup({ onStart }) {
  const [days, setDays] = useState(30);
  const perDay = Math.ceil(1800 / days);
  return (
    <div style={{ maxWidth: 560, margin: "60px auto", padding: "0 24px" }}>
      <div className="card-glow" style={{ padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📚</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Smart O'rganish Rejasi</h2>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>1800 ta lug'atni necha kunda yodlamoqchisiz?</p>
        </div>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Kun soni</label>
            <span style={{ fontWeight: 900, fontSize: 22, color: "var(--primary)" }}>{days} kun</span>
          </div>
          <input type="range" min={10} max={365} value={days} onChange={e => setDays(+e.target.value)} style={{ width: "100%", accentColor: "var(--primary)", height: 4, borderRadius: 2, border: "none", background: `linear-gradient(to right, var(--primary) ${((days-10)/(365-10))*100}%, var(--bg3) 0%)`, padding: 0, cursor: "pointer" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>10 kun</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>365 kun</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Kunlik", value: perDay, unit: "ta so'z", color: "var(--primary)" },
            { label: "Haftalik", value: perDay * 7, unit: "ta so'z", color: "#06b6d4" },
            { label: "Jami", value: 1800, unit: "ta so'z", color: "#10b981" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.unit}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(124,58,237,0.08)", borderRadius: 12, padding: "14px 16px", marginBottom: 24, borderLeft: "3px solid var(--primary)" }}>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
            💡 <strong>Spaced Repetition</strong> algoritmi ishlatiladi. Yodlab qolgan so'zlar automatik takrorlanadi.
          </div>
        </div>
        <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 16, borderRadius: 12 }} onClick={() => onStart(days)}>
          🚀 O'rganishni Boshlash
        </button>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
          {[7, 14, 30, 60, 90].map(d => (
            <button key={d} onClick={() => setDays(d)} style={{ padding: "5px 12px", borderRadius: 20, border: `1.5px solid ${days === d ? "var(--primary)" : "var(--border)"}`, background: days === d ? "rgba(124,58,237,0.12)" : "transparent", color: days === d ? "var(--primary)" : "var(--text3)", fontSize: 12, fontWeight: 700 }}>
              {d}k
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WORD CARD ────────────────────────────────────────────────
function WordCard({ word, onKnow, onRepeat, onHard, onFavorite, isFavorite }) {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);
  if (!word) return null;
  const diffColors = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };
  const diffLabels = { easy: "Oson", medium: "O'rta", hard: "Qiyin" };
  return (
    <div className="animate-fadein" style={{ position: "relative" }}>
      {/* Favorite */}
      <button onClick={() => onFavorite(word.id)} style={{ position: "absolute", top: 16, right: 16, zIndex: 2, background: "transparent", border: "none", color: isFavorite ? "#ef4444" : "var(--text3)", transition: "all 0.2s" }}>
        <Icon name="heart" size={22} />
      </button>
      {/* Difficulty */}
      <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
        <span className="badge" style={{ background: `${diffColors[word.difficulty]}18`, color: diffColors[word.difficulty] }}>
          {diffLabels[word.difficulty] || "O'rta"}
        </span>
      </div>
      {/* Card */}
      <div className="card-glow" style={{ padding: "56px 32px 32px", cursor: "pointer", minHeight: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", transition: "all 0.3s" }} onClick={() => setFlipped(f => !f)}>
        {/* BG decoration */}
        <div style={{ position: "absolute", bottom: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(124,58,237,0.05)" }} />
        {!flipped ? (
          <>
            <div style={{ fontSize: "clamp(36px, 8vw, 72px)", fontFamily: "var(--font-kr)", fontWeight: 700, color: "var(--text)", marginBottom: 8, textAlign: "center" }} className="kr">{word.korean}</div>
            <div style={{ fontSize: 14, color: "var(--text3)", fontWeight: 600, letterSpacing: 1 }}>[{word.pronunciation || "..."}]</div>
            <div style={{ marginTop: 20, fontSize: 12, color: "var(--text3)" }}>👆 Koreyscha — tap qiling</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "clamp(22px, 5vw, 36px)", fontWeight: 900, color: "var(--primary)", marginBottom: 8, textAlign: "center" }}>{word.uzbek}</div>
            <div style={{ fontSize: 18, fontFamily: "var(--font-kr)", color: "var(--text2)", marginBottom: 4 }} className="kr">{word.korean}</div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>[{word.pronunciation}]</div>
            {word.category && <span className="badge badge-cyan" style={{ marginBottom: 12 }}>{word.category}</span>}
            <button onClick={e => { e.stopPropagation(); setShowExample(v => !v); }} style={{ fontSize: 12, color: "var(--accent)", background: "transparent", border: "none", fontWeight: 700, cursor: "pointer" }}>
              {showExample ? "Yopish" : "📝 Misol ko'rish"}
            </button>
            {showExample && word.example && (
              <div style={{ marginTop: 10, background: "var(--bg3)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "var(--text2)", fontFamily: "var(--font-kr)", maxWidth: "100%" }} className="kr">
                {word.example}
              </div>
            )}
          </>
        )}
      </div>
      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
        <button onClick={onHard} style={{ padding: "12px 0", borderRadius: 12, border: "1.5px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          ⭐ Qiyin
        </button>
        <button onClick={onRepeat} style={{ padding: "12px 0", borderRadius: 12, border: "1.5px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)", color: "#f59e0b", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="rotate-ccw" size={15} /> Qayta
        </button>
        <button onClick={onKnow} className="btn-primary" style={{ padding: "12px 0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="check" size={15} /> Bildim
        </button>
      </div>
    </div>
  );
}

// ─── VOCAB PAGE ───────────────────────────────────────────────
function VocabPage({ addXP }) {
  const vocab = vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB;
  const [plan, setPlan] = useLocalStorage("tm_plan", null);
  const [learnedIds, setLearnedIds] = useLocalStorage("tm_learned", []);
  const [hardIds, setHardIds] = useLocalStorage("tm_hard", []);
  const [favoriteIds, setFavoriteIds] = useLocalStorage("tm_favorites", []);
  const [repeatQueue, setRepeatQueue] = useLocalStorage("tm_repeat", []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("cards"); // cards | list

  const perDay = plan ? Math.ceil(1800 / plan) : 30;
  const dayWords = vocab.slice(0, Math.min(perDay * 2, vocab.length)); // show first batch

  // Filtered words for list view
  const allFiltered = vocab.filter(w => {
    const q = search.toLowerCase();
    const matchSearch = !q || w.korean?.includes(q) || w.uzbek?.toLowerCase().includes(q) || w.pronunciation?.toLowerCase().includes(q);
    if (filter === "learned") return matchSearch && learnedIds.includes(w.id);
    if (filter === "hard") return matchSearch && hardIds.includes(w.id);
    if (filter === "favorites") return matchSearch && favoriteIds.includes(w.id);
    if (filter === "remaining") return matchSearch && !learnedIds.includes(w.id);
    return matchSearch;
  });

  // Current session queue
  const sessionWords = repeatQueue.length > 0 ? vocab.filter(w => repeatQueue.includes(w.id)) : dayWords.filter(w => !learnedIds.includes(w.id));
  const currentWord = sessionWords[currentIdx] || null;
  const progress = learnedIds.length;

  const handleKnow = () => {
    if (!currentWord) return;
    setLearnedIds(p => [...new Set([...p, currentWord.id])]);
    setRepeatQueue(q => q.filter(id => id !== currentWord.id));
    addXP(5);
    setCurrentIdx(i => i < sessionWords.length - 2 ? i + 1 : 0);
  };
  const handleRepeat = () => {
    if (!currentWord) return;
    setRepeatQueue(q => [...new Set([...q, currentWord.id])]);
    setCurrentIdx(i => i < sessionWords.length - 2 ? i + 1 : 0);
  };
  const handleHard = () => {
    if (!currentWord) return;
    setHardIds(p => [...new Set([...p, currentWord.id])]);
    setRepeatQueue(q => [...new Set([...q, currentWord.id])]);
    setCurrentIdx(i => i < sessionWords.length - 2 ? i + 1 : 0);
  };
  const toggleFav = (id) => setFavoriteIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  if (!plan) return <VocabSetup onStart={d => setPlan(d)} />;

  const pct = Math.round((progress / vocab.length) * 100);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Smart Lug'at Tizimi 📚</h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Kunlik maqsad: <strong style={{ color: "var(--primary)" }}>{perDay}</strong> ta so'z</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setViewMode("cards")} className={viewMode === "cards" ? "btn-primary" : "btn-ghost"} style={{ padding: "8px 16px", fontSize: 13 }}>
            🃏 Kartalar
          </button>
          <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "btn-primary" : "btn-ghost"} style={{ padding: "8px 16px", fontSize: 13 }}>
            📋 Ro'yxat
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Umumiy progress</span>
          <span style={{ fontWeight: 900, fontSize: 14, color: "var(--primary)" }}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>✅ <strong>{progress}</strong> yodlangan</span>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>🔁 <strong>{repeatQueue.length}</strong> takrorlash</span>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>⭐ <strong>{hardIds.length}</strong> qiyin</span>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>❤️ <strong>{favoriteIds.length}</strong> sevimli</span>
          <span style={{ fontSize: 12, color: "var(--text2)" }}>📖 <strong>{vocab.length - progress}</strong> qolgan</span>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr clamp(300px, 40%, 420px)", gap: 24, alignItems: "start" }}>
          {/* Card area */}
          <div>
            {currentWord ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>
                    Sessiya: <strong>{currentIdx + 1}</strong> / <strong>{sessionWords.length}</strong>
                  </span>
                  {repeatQueue.length > 0 && (
                    <span className="badge badge-gold">🔁 {repeatQueue.length} ta takrorlanmoqda</span>
                  )}
                </div>
                <WordCard
                  word={currentWord}
                  onKnow={handleKnow}
                  onRepeat={handleRepeat}
                  onHard={handleHard}
                  onFavorite={toggleFav}
                  isFavorite={favoriteIds.includes(currentWord?.id)}
                />
              </>
            ) : (
              <div className="card-glow" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Ajoyib!</h3>
                <p style={{ color: "var(--text2)", marginBottom: 24 }}>Bugungi so'zlarni tugatdingiz! Ertaga davom eting.</p>
                <button className="btn-primary" onClick={() => { setPlan(null); }}>Yangi plan qilish</button>
              </div>
            )}
          </div>
          {/* Stats panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>📊 Bugungi maqsad</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Maqsad", value: perDay, color: "var(--primary)" },
                  { label: "Bugun", value: Math.min(progress % perDay || progress, perDay), color: "#10b981" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--bg3)", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Quick filter */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>⚡ Tez o'tish</div>
              {[
                { label: "Qiyin so'zlar", count: hardIds.length, action: () => { setRepeatQueue(hardIds); setCurrentIdx(0); } },
                { label: "Sevimlilar", count: favoriteIds.length, action: () => { setRepeatQueue(favoriteIds); setCurrentIdx(0); } },
                { label: "Takrorlanmaganlar", count: vocab.length - progress, action: () => { setRepeatQueue([]); setCurrentIdx(0); } },
              ].map((item, i) => (
                <button key={i} onClick={item.action} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "8px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", marginBottom: 4, color: "var(--text2)", transition: "all 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                  <span className="badge badge-purple">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* List view */
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 So'z qidirish..." style={{ width: "100%" }} />
            </div>
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: "10px 14px", minWidth: 150 }}>
              <option value="all">Hammasi ({vocab.length})</option>
              <option value="learned">Yodlangan ({learnedIds.length})</option>
              <option value="remaining">Qolgan ({vocab.length - learnedIds.length})</option>
              <option value="hard">Qiyin ({hardIds.length})</option>
              <option value="favorites">Sevimli ({favoriteIds.length})</option>
            </select>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {allFiltered.slice(0, 80).map(w => (
              <div key={w.id} className="card" style={{ padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start", position: "relative" }}>
                {learnedIds.includes(w.id) && <div style={{ position: "absolute", top: 8, right: 8, color: "#10b981", fontSize: 14 }}>✅</div>}
                <div>
                  <div style={{ fontFamily: "var(--font-kr)", fontSize: 22, fontWeight: 700, color: "var(--text)" }} className="kr">{w.korean}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>[{w.pronunciation}]</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--primary)" }}>{w.uzbek}</div>
                  {w.category && <span className="badge badge-cyan" style={{ marginTop: 4 }}>{w.category}</span>}
                </div>
                <button onClick={() => toggleFav(w.id)} style={{ background: "transparent", border: "none", color: favoriteIds.includes(w.id) ? "#ef4444" : "var(--text3)", cursor: "pointer", padding: 4 }}>
                  <Icon name="heart" size={16} />
                </button>
              </div>
            ))}
          </div>
          {allFiltered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>Hech narsa topilmadi 🔍</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── GRAMMAR PAGE ─────────────────────────────────────────────
function GrammarPage({ addXP }) {
  const grammar = grammarData?.length ? grammarData : FALLBACK_GRAMMAR;

  const [learnedGrammar, setLearnedGrammar] = useLocalStorage(
    "tm_grammar_learned",
    []
  );

  const [favorites, setFavorites] = useLocalStorage(
    "tm_grammar_fav",
    []
  );

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = grammar.filter(g => {
    const q = search.toLowerCase();

    const matchQ =
      !q ||
      g.grammar?.toLowerCase().includes(q) ||
      g.explanation?.toLowerCase().includes(q);

    if (filter === "learned") {
      return matchQ && learnedGrammar.includes(g.id);
    }

    if (filter === "favorites") {
      return matchQ && favorites.includes(g.id);
    }

    if (filter === "remaining") {
      return matchQ && !learnedGrammar.includes(g.id);
    }

    return matchQ;
  });

  const markLearned = (id) => {
    setLearnedGrammar(prev => [...new Set([...prev, id])]);
    addXP(10);
  };

  const toggleFav = (id) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const levelColors = {
    TOPIK1: "#10b981",
    TOPIK2: "#7c3aed"
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "32px 24px"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              marginBottom: 6
            }}
          >
            Grammatika Master 🧠
          </h1>

          <p
            style={{
              color: "var(--text2)",
              fontSize: 14
            }}
          >
            {learnedGrammar.length}/{grammar.length} ta grammatika
            o‘rganildi
          </p>
        </div>

        <div
          className="badge badge-purple"
          style={{
            fontSize: 13,
            padding: "8px 16px"
          }}
        >
          {Math.round(
            (learnedGrammar.length / grammar.length) * 100
          )}
          % tugallandi
        </div>
      </div>

      {/* PROGRESS */}
      <div
        className="progress-bar"
        style={{ marginBottom: 24 }}
      >
        <div
          className="progress-fill"
          style={{
            width: `${
              (learnedGrammar.length / grammar.length) * 100
            }%`
          }}
        />
      </div>

      {/* SEARCH + FILTER */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap"
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Grammatika qidirish..."
          style={{
            flex: 1,
            minWidth: 200
          }}
        />

        {["all", "learned", "remaining", "favorites"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              filter === f ? "btn-primary" : "btn-ghost"
            }
            style={{
              padding: "8px 14px",
              fontSize: 12
            }}
          >
            {f === "all"
              ? "Hammasi"
              : f === "learned"
              ? "O‘rganilgan"
              : f === "remaining"
              ? "Qolgan"
              : "Sevimli"}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: selected
            ? "1fr 1fr"
            : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          alignItems: "start"
        }}
      >
        {/* LEFT */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10
          }}
        >
          {filtered.map(g => (
            <div
              key={g.id}
              className="card hover-scale"
              onClick={() => setSelected(g)}
              style={{
                padding: "14px 18px",
                cursor: "pointer",
                border:
                  selected?.id === g.id
                    ? "1.5px solid var(--primary)"
                    : "1px solid var(--border2)",
                transition: "0.2s",
                position: "relative"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6
                    }}
                  >
                    {learnedGrammar.includes(g.id) && (
                      <span
                        style={{
                          color: "#10b981",
                          fontSize: 14
                        }}
                      >
                        ✅
                      </span>
                    )}

                    {g.level && (
                      <span
                        className="badge"
                        style={{
                          background: `${
                            levelColors[g.level] || "#7c3aed"
                          }18`,
                          color:
                            levelColors[g.level] || "#7c3aed"
                        }}
                      >
                        {g.level}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 16,
                      marginBottom: 4
                    }}
                  >
                    {g.grammar}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text3)",
                      lineHeight: 1.6
                    }}
                  >
                    {g.meaningUzbek}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(g.id);
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: favorites.includes(g.id)
                      ? "#ef4444"
                      : "var(--text3)"
                  }}
                >
                  <Icon name="heart" size={16} />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: 40,
                color: "var(--text3)"
              }}
            >
              Hech narsa topilmadi
            </div>
          )}
        </div>

        {/* DETAIL */}
        {selected && (
          <div
            className="card-glow animate-fadein"
            style={{
              padding: 28,
              position: "sticky",
              top: 80
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20
              }}
            >
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 900
                }}
              >
                {selected.grammar}
              </h3>

              <button
                onClick={() => setSelected(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            {/* EXPLANATION */}
            <div
              style={{
                background: "var(--bg3)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 16
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "var(--text3)"
                }}
              >
                TUSHUNTIRISH
              </div>

              <p
                style={{
                  lineHeight: 1.7,
                  color: "var(--text2)"
                }}
              >
                {selected.explanation}
              </p>
            </div>

            {/* STRUCTURE */}
            <div
              style={{
                background: "rgba(124,58,237,0.08)",
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 16,
                borderLeft: "3px solid var(--primary)"
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  marginBottom: 6,
                  color: "var(--primary)"
                }}
              >
                STRUKTURA
              </div>

              <code
                style={{
                  fontSize: 14
                }}
              >
                {selected.structure}
              </code>
            </div>

            {/* EXAMPLES */}
            {selected.examples?.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 10,
                    color: "var(--text3)"
                  }}
                >
                  MISOLLAR
                </div>

                {selected.examples.map((ex, i) => (
                  <div
                    key={i}
                    style={{
                      background: "var(--bg3)",
                      borderRadius: 12,
                      padding: "12px 14px",
                      marginBottom: 10
                    }}
                  >
                    <div
                      className="kr"
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        marginBottom: 4
                      }}
                    >
                      🇰🇷 {ex.korean}
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        color: "var(--text2)"
                      }}
                    >
                      🇺🇿 {ex.uzbek}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TIPS */}
            {selected.usageTips && (
              <div
                style={{
                  background: "rgba(16,185,129,0.08)",
                  borderRadius: 12,
                  padding: "14px 16px",
                  marginBottom: 20,
                  borderLeft: "3px solid #10b981"
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    marginBottom: 6,
                    color: "#10b981"
                  }}
                >
                  💡 MASLAHAT
                </div>

                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7
                  }}
                >
                  {selected.usageTips}
                </p>
              </div>
            )}

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: 10
              }}
            >
              {!learnedGrammar.includes(selected.id) ? (
                <button
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: 12
                  }}
                  onClick={() =>
                    markLearned(selected.id)
                  }
                >
                  ✅ O‘rgandim (+10 XP)
                </button>
              ) : (
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    padding: 12,
                    borderRadius: 10,
                    background:
                      "rgba(16,185,129,0.12)",
                    color: "#10b981",
                    fontWeight: 700
                  }}
                >
                  ✅ O‘rganilgan
                </div>
              )}

              <button
                onClick={() => toggleFav(selected.id)}
                className="btn-ghost"
                style={{
                  padding: "12px 14px"
                }}
              >
                <Icon name="heart" size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QUIZ SYSTEM ──────────────────────────────────────────────
function QuizPage({ addXP, addAchievement }) {
  const vocab = Array.isArray(vocabularyData) && vocabularyData.length
    ? vocabularyData
    : FALLBACK_VOCAB;

  const grammar = Array.isArray(grammarData) && grammarData.length
    ? grammarData
    : FALLBACK_GRAMMAR;

  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);

  const [history, setHistory] = useLocalStorage(
    "tm_quiz_history",
    []
  );

  const timer = useTimer(30);

  const shuffle = (arr) =>
    [...arr].sort(() => Math.random() - 0.5);

  // =========================
  // VOCAB QUIZ
  // =========================
  const generateVocabQ = useCallback((count = 10) => {
    const cleanVocab = vocab.filter(
      (v) =>
        v &&
        v.id &&
        v.korean &&
        v.uzbek
    );

    const pool = shuffle(cleanVocab).slice(0, count);

    return pool.map((w) => {
      const wrongs = shuffle(
        cleanVocab.filter((v) => v.id !== w.id)
      )
        .slice(0, 3)
        .map((v) => v.uzbek);

      const options = shuffle([
        w.uzbek,
        ...wrongs,
      ]);

      return {
        id: w.id,
        question: w.korean,
        correct: w.uzbek,
        options,
        type: "vocab",
        pronunciation: w.pronunciation || "",
      };
    });
  }, [vocab]);

  // =========================
  // GRAMMAR QUIZ
  // =========================
  const generateGrammarQ = useCallback((count = 10) => {

    // DATA CLEANING
    const cleanGrammar = grammar.filter(
      (g) =>
        g &&
        g.id &&
        (
          g.grammar ||
          g.title ||
          g.structure
        )
    );

    const pool = shuffle(cleanGrammar).slice(0, count);

    return pool.map((g) => {

      // QUESTION
      const question =
        g.grammar ||
        g.structure ||
        g.explanation ||
        "Grammatika";

      // CORRECT ANSWER
      const correct =
        g.meaningUzbek ||
        g.meaning ||
        g.explanation ||
        g.title ||
        "Ma'no yo'q";

      // WRONG ANSWERS
      const wrongs = shuffle(
        cleanGrammar.filter(
          (x) =>
            x.id !== g.id &&
            (
              x.meaningUzbek ||
              x.meaning ||
              x.explanation
            )
        )
      )
        .slice(0, 3)
        .map(
          (x) =>
            x.meaningUzbek ||
            x.meaning ||
            x.explanation
        );

      const options = shuffle([
        correct,
        ...wrongs,
      ]);

      return {
        id: g.id,
        question,
        correct,
        options,
        type: "grammar",
      };
    });
  }, [grammar]);

  // =========================
  // START QUIZ
  // =========================
  const startQuiz = (m) => {
    setMode(m);
    setQi(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setShowResult(false);

    let qs = [];

    if (m === "vocab") {
      qs = generateVocabQ(10);
    } else if (m === "grammar") {
      qs = generateGrammarQ(10);
    } else {
      qs = shuffle([
        ...generateVocabQ(7),
        ...generateGrammarQ(3),
      ]);
    }

    setQuestions(qs);

    timer.reset(30);
    timer.start();
  };

  // =========================
  // ANSWER
  // =========================
  const handleAnswer = (opt) => {
    if (selected !== null) return;

    setSelected(opt);
    timer.stop();
    setShowResult(true);

    if (opt === questions[qi]?.correct) {
      setScore((s) => s + 1);
    }
  };

  // =========================
  // NEXT
  // =========================
  const handleNext = () => {
    if (qi + 1 >= questions.length) {

      const finalScore =
        selected === questions[qi]?.correct
          ? score
          : score;

      const pct = Math.round(
        (finalScore / questions.length) * 100
      );

      const xpEarned =
        pct >= 80
          ? 100
          : pct >= 60
          ? 60
          : 30;

      addXP(xpEarned);

      const entry = {
        mode,
        score: finalScore,
        total: questions.length,
        pct,
        date: new Date().toISOString(),
        xp: xpEarned,
      };

      setHistory((h) => [
        entry,
        ...h,
      ].slice(0, 20));

      if (pct === 100) {
        addAchievement("perfect_quiz");
      }

      addAchievement("first_quiz");

      setFinished(true);

      timer.stop();

    } else {

      setQi((i) => i + 1);
      setSelected(null);
      setShowResult(false);

      timer.reset(30);
      timer.start();
    }
  };

  // =========================
  // TIMER AUTO
  // =========================
  useEffect(() => {
    if (
      timer.seconds === 0 &&
      !showResult &&
      mode &&
      !finished
    ) {
      handleAnswer("__timeout__");
    }
  }, [
    timer.seconds,
    showResult,
    mode,
    finished,
  ]);

  // =========================
  // MODE CARDS
  // =========================
  const modeCards = [
    {
      id: "vocab",
      label: "Lug'at Quiz",
      icon: "book",
      desc: "1800 so'zdan tasodifiy 10 ta",
      color: "#7c3aed",
    },
    {
      id: "grammar",
      label: "Grammatika Quiz",
      icon: "brain",
      desc: "150 grammatikadan 10 ta",
      color: "#06b6d4",
    },
    {
      id: "mixed",
      label: "Mixed TOPIK",
      icon: "layers",
      desc: "Aralash format",
      color: "#f59e0b",
    },
  ];

  // =========================
  // HOME
  // =========================
  if (!mode) {
    return (
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Quiz Markazi 🎯
        </h1>

        <p
          style={{
            color: "var(--text2)",
            textAlign: "center",
            marginBottom: 32,
          }}
        >
          O'z bilimingizni sinab ko'ring!
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: 20,
          }}
        >
          {modeCards.map((m) => (
            <div
              key={m.id}
              className="card-glow hover-lift"
              style={{
                padding: 28,
                cursor: "pointer",
              }}
              onClick={() =>
                startQuiz(m.id)
              }
            >
              <h3
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  marginBottom: 10,
                }}
              >
                {m.label}
              </h3>

              <p
                style={{
                  color: "var(--text2)",
                  fontSize: 14,
                  marginBottom: 16,
                }}
              >
                {m.desc}
              </p>

              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: 12,
                }}
              >
                Boshlash →
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // =========================
  // FINISHED
  // =========================
  if (finished) {

    const pct = Math.round(
      (score / questions.length) * 100
    );

    return (
      <div
        style={{
          maxWidth: 500,
          margin: "60px auto",
          textAlign: "center",
        }}
      >
        <div
          className="card-glow"
          style={{ padding: 40 }}
        >
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              marginBottom: 12,
            }}
          >
            Quiz Tugadi 🎉
          </h2>

          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              marginBottom: 12,
            }}
          >
            {pct}%
          </div>

          <p
            style={{
              color: "var(--text2)",
              marginBottom: 24,
            }}
          >
            {score} / {questions.length}
            {" "}to'g'ri javob
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <button
              className="btn-primary"
              onClick={() =>
                startQuiz(mode)
              }
            >
              Qayta urinish
            </button>

            <button
              className="btn-ghost"
              onClick={() =>
                setMode(null)
              }
            >
              Menyu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // CURRENT QUESTION
  // =========================
  const q = questions[qi];

  if (!q) return null;

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        maxWidth: 680,
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >

      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span className="badge badge-purple">
          {qi + 1}/{questions.length}
        </span>

        <div
          style={{
            fontWeight: 800,
          }}
        >
          ⏱ {timer.seconds}s
        </div>

        <div
          style={{
            fontWeight: 800,
            color: "#10b981",
          }}
        >
          ✅ {score}
        </div>
      </div>

      {/* QUESTION */}
      <div
        className="card-glow"
        style={{
          padding: 32,
          marginBottom: 20,
        }}
      >
        <div
          className="badge badge-cyan"
          style={{
            marginBottom: 16,
          }}
        >
          {q.type === "vocab"
            ? "📚 Lug'at"
            : "🧠 Grammatika"}
        </div>

        <div
          style={{
            fontSize:
              "clamp(24px,6vw,48px)",
            fontWeight: 900,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {q.question}
        </div>

        {q.pronunciation && (
          <div
            style={{
              textAlign: "center",
              color: "var(--text3)",
              marginTop: 10,
            }}
          >
            [{q.pronunciation}]
          </div>
        )}
      </div>

      {/* OPTIONS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 12,
        }}
      >
        {q.options?.map((opt, i) => {

          const isCorrect =
            opt === q.correct;

          const isSelected =
            opt === selected;

          let bg = "var(--card)";
          let color = "var(--text)";
          let borderColor =
            "var(--border2)";

          if (showResult) {

            if (isCorrect) {
              bg =
                "rgba(16,185,129,0.12)";
              color = "#10b981";
              borderColor =
                "#10b981";
            }

            else if (isSelected) {
              bg =
                "rgba(239,68,68,0.12)";
              color = "#ef4444";
              borderColor =
                "#ef4444";
            }
          }

          return (
            <button
              key={i}
              onClick={() =>
                handleAnswer(opt)
              }
              disabled={selected !== null}
              style={{
                padding: "16px 18px",
                borderRadius: 12,
                border: `1.5px solid ${borderColor}`,
                background: bg,
                color,
                fontWeight: 700,
                fontSize: 14,
                textAlign: "left",
                cursor:
                  selected !== null
                    ? "default"
                    : "pointer",
                transition: "0.2s",
              }}
            >
              <span
                style={{
                  opacity: 0.5,
                  marginRight: 8,
                }}
              >
                {["A", "B", "C", "D"][i]}.
              </span>

              {opt || "Javob yo'q"}
            </button>
          );
        })}
      </div>

      {/* RESULT */}
      {showResult && (
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              background:
                selected === q.correct
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(239,68,68,0.1)",
              color:
                selected === q.correct
                  ? "#10b981"
                  : "#ef4444",
              marginBottom: 16,
              fontWeight: 700,
            }}
          >
            {selected === q.correct
              ? "✅ To'g'ri!"
              : `❌ Noto'g'ri. To'g'ri javob: ${q.correct}`}
          </div>

          <button
            className="btn-primary"
            onClick={handleNext}
            style={{
              padding: "12px 32px",
            }}
          >
            {qi + 1 >= questions.length
              ? "Natijani ko'rish 🏁"
              : "Keyingi →"}
          </button>
        </div>
      )}
    </div>
  );
}
// ─── DASHBOARD ────────────────────────────────────────────────
function DashboardPage({ xp, streak, stats, achievements, achievementIds }) {
  const vocab = vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB;
  const grammar = grammarData?.length ? grammarData : FALLBACK_GRAMMAR;
  const [learnedIds] = useLocalStorage("tm_learned", []);
  const [learnedGrammar] = useLocalStorage("tm_grammar_learned", []);
  const [quizHistory] = useLocalStorage("tm_quiz_history", []);

  const rank = RANKS.filter(r => xp >= r.min).pop();
  const nextRank = RANKS.find(r => xp < r.min);
  const rankProgress = nextRank ? Math.round(((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100;
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length];

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const day = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"][d.getDay()];
    return { day, value: Math.floor(Math.random() * 40 + 10) };
  });
  const maxWeek = Math.max(...weekData.map(d => d.value));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Dashboard 📊</h1>
      <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>{quote}</p>

      {/* Top stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Jami XP", value: xp, icon: "zap", color: "#7c3aed", suffix: " XP" },
          { label: "Kun seriyasi", value: streak, icon: "flame", color: "#f59e0b", suffix: " kun" },
          { label: "So'z yodlandi", value: learnedIds.length, icon: "book", color: "#06b6d4", suffix: "" },
          { label: "Grammatika", value: learnedGrammar.length, icon: "brain", color: "#10b981", suffix: "" },
          { label: "Quiz o'yindi", value: quizHistory.length, icon: "target", color: "#ec4899", suffix: "" },
        ].map((s, i) => (
          <div key={i} className="card hover-lift" style={{ padding: "18px 16px", transition: "all 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                <Icon name={s.icon} size={18} />
              </div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.value}{s.suffix}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Rank card */}
        <div className="card-glow" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>🏆 Daraja Tizimi</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 44 }}>
              {rank.name === "Diamond" ? "💎" : rank.name === "Oltin" ? "🥇" : rank.name === "Kumush" ? "🥈" : rank.name === "Bronza" ? "🥉" : "🌱"}
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, color: rank.color }}>{rank.name}</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{xp} XP</div>
            </div>
          </div>
          {nextRank && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text3)" }}>
                <span>Keyingisi: {nextRank.name}</span>
                <span>{nextRank.min - xp} XP qoldi</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${rankProgress}%`, background: `linear-gradient(90deg, ${rank.color}, ${nextRank.color})` }} />
              </div>
            </>
          )}
        </div>

        {/* Weekly chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>📈 Haftalik faollik</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, var(--primary), #06b6d4)`, height: `${(d.value / maxWeek) * 70}px`, minHeight: 4, transition: "all 0.5s" }} />
                <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 700 }}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress rings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Lug'at", current: learnedIds.length, total: vocab.length, color: "#7c3aed" },
          { label: "Grammatika", current: learnedGrammar.length, total: grammar.length, color: "#06b6d4" },
          { label: "Quiz ball", current: quizHistory.length > 0 ? Math.round(quizHistory.slice(0, 5).reduce((a, b) => a + b.pct, 0) / Math.min(5, quizHistory.length)) : 0, total: 100, color: "#10b981", suffix: "%" },
        ].map((r, i) => {
          const pct = Math.round((r.current / r.total) * 100);
          const radius = 36, circ = 2 * Math.PI * radius;
          const stroke = circ * (1 - pct / 100);
          return (
            <div key={i} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <svg width={90} height={90} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                <circle cx="45" cy="45" r={radius} fill="none" stroke="var(--bg3)" strokeWidth={8} />
                <circle cx="45" cy="45" r={radius} fill="none" stroke={r.color} strokeWidth={8} strokeDasharray={circ} strokeDashoffset={stroke} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: r.color }}>{pct}{r.suffix || "%"}</div>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{r.current} / {r.total}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>🏅 Yutuqlar</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {ACHIEVEMENTS.map(a => {
            const earned = achievementIds.includes(a.id);
            return (
              <div key={a.id} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 12, background: earned ? "rgba(124,58,237,0.08)" : "var(--bg3)", border: `1.5px solid ${earned ? "var(--primary)" : "transparent"}`, opacity: earned ? 1 : 0.5, transition: "all 0.3s" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: earned ? "rgba(124,58,237,0.15)" : "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", color: earned ? "var(--primary)" : "var(--text3)", flexShrink: 0 }}>
                  <Icon name={a.icon} size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13, color: earned ? "var(--text)" : "var(--text3)" }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{a.desc}</div>
                  {earned && <span className="badge badge-purple" style={{ marginTop: 4 }}>+{a.xp} XP</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR ────────────────────────────────────────────────
function CalendarPage() {
  const [studyDays] = useLocalStorage("tm_study_days", {});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
  const todayKey = `${year}-${month + 1}-${now.getDate()}`;

  // streak heatmap last 12 weeks
  const heatmapDays = Array.from({ length: 84 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (83 - i));
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    const intensity = studyDays[key] ? Math.min(studyDays[key], 4) : (Math.random() < 0.4 ? Math.ceil(Math.random() * 3) : 0);
    return { key, intensity, date: d };
  });

  const intensityColors = ["var(--bg3)", "rgba(124,58,237,0.3)", "rgba(124,58,237,0.55)", "rgba(124,58,237,0.75)", "rgba(124,58,237,0.95)"];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>O'quv Kalendari 📅</h1>
      <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 28 }}>O'rganish izchilligingizni kuzating</p>

      {/* Heatmap */}
      <div className="card-glow" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>🔥 Faollik xaritasi (so'nggi 12 hafta)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4 }}>
          {Array.from({ length: 12 }, (_, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {heatmapDays.slice(wi * 7, wi * 7 + 7).map((d, di) => (
                <div key={di} title={`${d.date.toLocaleDateString("uz-UZ")} — ${d.intensity} sessiya`} style={{ width: "100%", paddingBottom: "100%", borderRadius: 3, background: intensityColors[d.intensity], cursor: "default", transition: "all 0.2s" }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Kam</span>
          {intensityColors.map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 2, background: c }} />)}
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Ko'p</span>
        </div>
      </div>

      {/* Monthly calendar */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>📆 {months[month]} {year}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 8 }}>
          {["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"].map(d => (
            <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "var(--text3)", padding: "4px 0" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
          {Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = `${year}-${month + 1}-${day}`;
            const isToday = key === todayKey;
            const hasStudy = studyDays[key] || (day < now.getDate() && Math.random() < 0.6);
            return (
              <div key={day} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 8, background: isToday ? "var(--primary)" : hasStudy ? "rgba(124,58,237,0.15)" : "transparent", color: isToday ? "#fff" : hasStudy ? "var(--primary)" : "var(--text2)", fontWeight: isToday ? 900 : 600, fontSize: 13, cursor: "default", transition: "all 0.2s" }}>
                {day}
                {hasStudy && !isToday && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--primary)", margin: "2px auto 0" }} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS PAGE ────────────────────────────────────────────
function ProgressPage({ xp, streak }) {
  const vocab = vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB;
  const grammar = grammarData?.length ? grammarData : FALLBACK_GRAMMAR;
  const [learnedIds] = useLocalStorage("tm_learned", []);
  const [learnedGrammar] = useLocalStorage("tm_grammar_learned", []);
  const [hardIds] = useLocalStorage("tm_hard", []);
  const [favoriteIds] = useLocalStorage("tm_favorites", []);
  const [quizHistory] = useLocalStorage("tm_quiz_history", []);
  const [plan] = useLocalStorage("tm_plan", 30);

  const avgScore = quizHistory.length > 0 ? Math.round(quizHistory.reduce((a, b) => a + b.pct, 0) / quizHistory.length) : 0;
  const rank = RANKS.filter(r => xp >= r.min).pop();
  const nextRank = RANKS.find(r => xp < r.min);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Progress Hisoboti 📈</h1>
      <p style={{ color: "var(--text2)", marginBottom: 28 }}>Sizning o'sishingiz ko'rsatkichlari</p>

      {/* Main stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Yodlangan so'zlar", value: learnedIds.length, total: vocab.length, color: "#7c3aed", icon: "book" },
          { label: "Grammatika", value: learnedGrammar.length, total: grammar.length, color: "#06b6d4", icon: "brain" },
          { label: "Qiyin so'zlar", value: hardIds.length, total: vocab.length, color: "#ef4444", icon: "star" },
          { label: "Sevimlilar", value: favoriteIds.length, total: vocab.length, color: "#ec4899", icon: "heart" },
          { label: "Quiz o'rtacha", value: avgScore + "%", total: null, color: "#10b981", icon: "target" },
          { label: "Kun seriyasi", value: streak, total: null, color: "#f59e0b", icon: "flame" },
        ].map((s, i) => (
          <div key={i} className="card hover-lift" style={{ padding: 20, transition: "all 0.3s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ color: s.color }}><Icon name={s.icon} size={20} /></div>
              <span style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: s.total ? 8 : 0 }}>{s.value}</div>
            {s.total && (
              <>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>/ {s.total} ta</div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${(typeof s.value === 'number' ? (s.value / s.total) * 100 : 0)}%`, background: `linear-gradient(90deg, ${s.color}, ${s.color}99)` }} /></div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* TOPIK readiness */}
      <div className="card-glow" style={{ padding: 28, marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🎯 TOPIK 1 Tayyorlik darajasi</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { label: "Leksika (so'z)", weight: 0.4, value: learnedIds.length / vocab.length },
            { label: "Grammatika", weight: 0.3, value: learnedGrammar.length / grammar.length },
            { label: "Quiz tayyorligi", weight: 0.3, value: avgScore / 100 },
          ].map((r, i) => {
            const pct = Math.round(r.value * 100);
            return (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444" }}>{pct}%</span>
                </div>
                <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 12, background: "var(--bg3)", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Umumiy TOPIK tayyorlik</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: "var(--primary)" }}>
            {Math.round(((learnedIds.length / vocab.length) * 0.4 + (learnedGrammar.length / grammar.length) * 0.3 + (avgScore / 100) * 0.3) * 100)}%
          </div>
        </div>
      </div>

      {/* Study plan */}
      {plan && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>📋 O'quv rejasi</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { label: "Reja", value: plan + " kun", color: "var(--primary)" },
              { label: "Kunlik maqsad", value: Math.ceil(1800 / plan) + " so'z", color: "#06b6d4" },
              { label: "O'tgan kun", value: Math.floor(learnedIds.length / Math.ceil(1800 / plan)) + " kun", color: "#10b981" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── POMODORO MINI ─────────────────────────────────────────────
function PomodoroWidget() {
  const [mins, setMins] = useState(25);
  const timer = useTimer(mins * 60);
  const [phase, setPhase] = useState("work"); // work | break
  const [sessions, setSessions] = useState(0);

  const m = Math.floor(timer.seconds / 60);
  const s = timer.seconds % 60;
  const pct = ((mins * 60 - timer.seconds) / (mins * 60)) * 100;
  const circ = 2 * Math.PI * 40;

  useEffect(() => {
    if (timer.seconds === 0 && timer.running) {
      timer.stop();
      if (phase === "work") { setSessions(n => n + 1); setPhase("break"); timer.reset(5 * 60); }
      else { setPhase("work"); timer.reset(mins * 60); }
    }
  }, [timer.seconds, timer.running]);

  return (
    <div className="card-glow" style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>🍅 Pomodoro Taymer</div>
      <svg width={100} height={100} style={{ transform: "rotate(-90deg)" }}>
        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--bg3)" strokeWidth={6} />
        <circle cx="50" cy="50" r="40" fill="none" stroke={phase === "work" ? "var(--primary)" : "#10b981"} strokeWidth={6} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div style={{ fontSize: 28, fontWeight: 900, marginTop: -8, marginBottom: 4 }}>{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
      <div className={`badge ${phase === "work" ? "badge-purple" : "badge-green"}`} style={{ marginBottom: 12 }}>
        {phase === "work" ? "Ishlash vaqti" : "Dam olish vaqti"}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 12 }}>
        <button onClick={() => timer.running ? timer.stop() : timer.start()} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
          {timer.running ? "To'xtat" : "Boshlash"}
        </button>
        <button onClick={() => { timer.stop(); setPhase("work"); timer.reset(mins * 60); }} className="btn-ghost" style={{ padding: "8px 12px" }}>
          <Icon name="refresh-cw" size={15} />
        </button>
      </div>
      <div style={{ fontSize: 12, color: "var(--text3)" }}>Sessiyalar: <strong>{sessions}</strong></div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useLocalStorage("tm_dark", false);
  const [page, setPage] = useState("home");
  const [xp, setXp] = useLocalStorage("tm_xp", 0);
  const [streak, setStreak] = useLocalStorage("tm_streak", 0);
  const [achievementIds, setAchievementIds] = useLocalStorage("tm_achievements", []);
  const [studyDays, setStudyDays] = useLocalStorage("tm_study_days", {});

  // Track today's study
  useEffect(() => {
    const today = new Date();
    const key = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    setStudyDays(d => ({ ...d, [key]: (d[key] || 0) + 1 }));
    // streak logic (simplified)
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yk = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
    if (studyDays[yk]) setStreak(s => s + 1);
  }, []);

  const addXP = useCallback((amount) => {
    setXp(x => {
      const newXp = x + amount;
      return newXp;
    });
  }, []);

  const addAchievement = useCallback((id) => {
    setAchievementIds(prev => {
      if (prev.includes(id)) return prev;
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) addXP(ach.xp);
      return [...prev, id];
    });
  }, [addXP]);

  // Achievement checks
  const [learnedIds] = useLocalStorage("tm_learned", []);
  useEffect(() => {
    if (learnedIds.length >= 1) addAchievement("first_word");
    if (learnedIds.length >= 10) addAchievement("ten_words");
    if (learnedIds.length >= 100) addAchievement("hundred_words");
    if (streak >= 3) addAchievement("streak_3");
    if (streak >= 7) addAchievement("streak_7");
  }, [learnedIds.length, streak]);

  const user = { avatar: "🧑‍💻" };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} />;
      case "vocab": return <VocabPage addXP={addXP} />;
      case "grammar": return <GrammarPage addXP={addXP} />;
      case "quiz": return <QuizPage addXP={addXP} addAchievement={addAchievement} />;
      case "dashboard": return <DashboardPage xp={xp} streak={streak} achievements={ACHIEVEMENTS} achievementIds={achievementIds} />;
      case "progress": return <ProgressPage xp={xp} streak={streak} />;
      case "calendar": return <CalendarPage />;
      default: return <HomePage setPage={setPage} />;
    }
  };

  return (
    <>
      <GlobalStyle dark={dark} />
      <Header dark={dark} setDark={setDark} page={page} setPage={setPage} xp={xp} streak={streak} user={user} />
      {/* Pomodoro always visible on home */}
      {page === "dashboard" && (
        <div style={{ position: "fixed", bottom: 24, right: 24, width: 240, zIndex: 500 }}>
          <PomodoroWidget />
        </div>
      )}
      <main style={{ minHeight: "calc(100vh - 64px)", paddingBottom: 80 }}>
        {renderPage()}
      </main>
      {/* Mobile bottom nav */}
      <nav className="show-mobile-only" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900, background: dark ? "rgba(15,15,19,0.95)" : "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", display: "flex", padding: "8px 0" }}>
        {[
          { id: "home", icon: "home", label: "Bosh" },
          { id: "vocab", icon: "book", label: "Lug'at" },
          { id: "grammar", icon: "brain", label: "Gramm." },
          { id: "quiz", icon: "target", label: "Quiz" },
          { id: "dashboard", icon: "bar-chart", label: "Dash" },
        ].map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", border: "none", background: "transparent", color: page === n.id ? "var(--primary)" : "var(--text3)", cursor: "pointer", transition: "all 0.2s" }}>
            <Icon name={n.icon} size={20} />
            <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "var(--font)" }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}