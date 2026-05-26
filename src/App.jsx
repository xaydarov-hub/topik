import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { vocabularyData } from "./vocabularyData";
import { grammarData } from "./grammarData";

// ================================================================
//  TOPIK Master — by Xaydarov  | Production-Grade React App
//  v2.0 — Full rewrite: buglar tuzatildi, yangi funksiyalar qo'shildi
// ================================================================

// ─── MOTION SHIM ────────────────────────────────────────────────
const motion = {
  div: ({ children, className, style, onClick, initial, animate, exit, transition, whileHover, whileTap, layoutId, ...rest }) => {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current || !animate) return;
      const el = ref.current;
      const dur = (transition?.duration || 0.35) * 1000;
      const ease = transition?.ease || "cubic-bezier(0.4,0,0.2,1)";
      const from = {};
      const to = {};
      if (animate.opacity !== undefined) { from.opacity = initial?.opacity ?? 0; to.opacity = animate.opacity; }
      if (animate.y !== undefined) { from.transform = `translateY(${initial?.y ?? 24}px)`; to.transform = `translateY(${animate.y}px)`; }
      if (animate.x !== undefined) { from.transform = `translateX(${initial?.x ?? -24}px)`; to.transform = `translateX(${animate.x}px)`; }
      if (animate.scale !== undefined) { from.transform = (from.transform || "") + ` scale(${initial?.scale ?? 0.92})`; to.transform = (to.transform || "") + ` scale(${animate.scale})`; }
      if (Object.keys(from).length) el.animate([from, to], { duration: dur, fill: "forwards", easing: ease });
    }, []);
    return <div ref={ref} className={className} style={style} onClick={onClick} {...rest}>{children}</div>;
  }
};
const AnimatePresence = ({ children }) => <>{children}</>;

// ─── INLINE SVG ICONS ────────────────────────────────────────────
const Icon = ({ name, size = 20, className = "" }) => {
  const icons = {
    home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9,22 9,12 15,12 15,22" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></>,
    "book-open": <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" /></>,
    brain: <><path d="M9.5 2A2.5 2.5 0 007 4.5A2.5 2.5 0 004.5 7A2.5 2.5 0 002 9.5A2.5 2.5 0 004.5 12A2.5 2.5 0 007 14.5A2.5 2.5 0 009.5 17h5A2.5 2.5 0 0017 14.5A2.5 2.5 0 0019.5 12A2.5 2.5 0 0022 9.5A2.5 2.5 0 0019.5 7A2.5 2.5 0 0017 4.5A2.5 2.5 0 0014.5 2z" /></>,
    zap: <><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" /></>,
    star: <><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" /></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    user: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    sun: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
    moon: <><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></>,
    check: <><polyline points="20,6 9,17 4,12" /></>,
    "check-circle": <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22,4 12,14.01 9,11.01" /></>,
    "rotate-ccw": <><polyline points="1,4 1,10 7,10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></>,
    "chevron-right": <><polyline points="9,18 15,12 9,6" /></>,
    "chevron-left": <><polyline points="15,18 9,12 15,6" /></>,
    "chevron-down": <><polyline points="6,9 12,15 18,9" /></>,
    "chevron-up": <><polyline points="18,15 12,9 6,15" /></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" /></>,
    award: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></>,
    target: <><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    filter: <><polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3" /></>,
    heart: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></>,
    "volume-2": <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" /><path d="M19.07 4.93a10 10 0 010 14.14" /><path d="M15.54 8.46a5 5 0 010 7.07" /></>,
    "volume-x": <><polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></>,
    "refresh-cw": <><polyline points="23,4 23,10 17,10" /><polyline points="1,20 1,14 7,14" /><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12" /></>,
    timer: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></>,
    layers: <><polygon points="12,2 2,7 12,12 22,7 12,2" /><polyline points="2,17 12,22 22,17" /><polyline points="2,12 12,17 22,12" /></>,
    "bar-chart": <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    "trending-up": <><polyline points="23,6 13.5,15.5 8.5,10.5 1,18" /><polyline points="17,6 23,6 23,12" /></>,
    bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></>,
    "play-circle": <><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16 10,8" /></>,
    globe: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></>,
    "message-circle": <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>,
    sparkles: <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M5 17l.75 2.25L8 20l-2.25.75L5 23l-.75-2.25L2 20l2.25-.75z" /><path d="M18 1l.75 2.25L21 4l-2.25.75L18 7l-.75-2.25L15 4l2.25-.75z" /></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></>,
    "arrow-right": <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12,5 19,12 12,19" /></>,
    "arrow-left": <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12,19 5,12 12,5" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>,
    menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    "eye-off": <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></>,
    lightbulb: <><line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" /><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14" /></>,
    infinity: <><path d="M12 12c-2-2.5-4-4-6-4a4 4 0 000 8c2 0 4-1.5 6-4z" /><path d="M12 12c2 2.5 4 4 6 4a4 4 0 000-8c-2 0-4 1.5-6 4z" /></>,
    flag: <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
    circle: <><circle cx="12" cy="12" r="10" /></>,
    "skip-forward": <><polygon points="5,4 15,12 5,20 5,4" /><line x1="19" y1="5" x2="19" y2="19" /></>,
    shuffle: <><polyline points="16,3 21,3 21,8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21,16 21,21 16,21" /><line x1="15" y1="15" x2="21" y2="21" /></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
    "grid-2": <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    list: <><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></>,
    keyboard: <><rect x="2" y="4" width="20" height="16" rx="2" ry="2" /><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" /></>,
    "pen-tool": <><path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" /></>,
    "bar-chart-2": <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    "pie-chart": <><path d="M21.21 15.89A10 10 0 118 2.83" /><path d="M22 12A10 10 0 0012 2v10z" /></>,
    "clock": <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></>,
    "map": <><polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>,
    "mic": <><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></>,
    "help-circle": <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    "info": <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></>,
    "alert-circle": <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
    "edit": <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    "trash": <><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /></>,
    "save": <><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17,21 17,13 7,13 7,21" /><polyline points="7,3 7,8 15,8" /></>,
    "maximize": <><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" /></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name] || icons["circle"]}
    </svg>
  );
};

// ─── CUSTOM HOOKS ────────────────────────────────────────────────

// useLocalStorage — production safe
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : defaultValue;
    } catch { return defaultValue; }
  });
  const setStoredValue = useCallback((newValue) => {
    setValue(prev => {
      const val = typeof newValue === "function" ? newValue(prev) : newValue;
      try { window.localStorage.setItem(key, JSON.stringify(val)); } catch { }
      return val;
    });
  }, [key]);
  const removeValue = useCallback(() => {
    setValue(defaultValue);
    try { window.localStorage.removeItem(key); } catch { }
  }, [key, defaultValue]);
  return [value, setStoredValue, removeValue];
}

// useDebounce — search optimizatsiyasi uchun
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// useTimer — to'g'ri timer (stale closure yo'q)
function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);
  const runningRef = useRef(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    runningRef.current = true;
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback((s) => {
    runningRef.current = false;
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(s ?? initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            runningRef.current = false;
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  return { seconds, running, start, stop, reset };
}

// useTTS — Text-to-Speech hook
function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);

  const speak = useCallback((text, lang = "ko-KR") => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang;
    utt.rate = 0.85;
    utt.pitch = 1;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    const voices = window.speechSynthesis.getVoices();
    const krVoice = voices.find(v => v.lang.startsWith("ko"));
    if (krVoice) utt.voice = krVoice;
    window.speechSynthesis.speak(utt);
  }, [supported]);

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported };
}

// useSet — Set-based state (O(1) lookup)
function useSet(initialArray = []) {
  const [set, setSet] = useState(() => new Set(initialArray));
  const add = useCallback((item) => setSet(prev => new Set([...prev, item])), []);
  const remove = useCallback((item) => setSet(prev => { const n = new Set(prev); n.delete(item); return n; }), []);
  const toggle = useCallback((item) => setSet(prev => { const n = new Set(prev); n.has(item) ? n.delete(item) : n.add(item); return n; }), []);
  const has = useCallback((item) => set.has(item), [set]);
  const toArray = useCallback(() => [...set], [set]);
  const size = set.size;
  return { set, add, remove, toggle, has, toArray, size };
}

// ─── SM-2 SPACED REPETITION ALGORITHM ────────────────────────────
const SM2 = {
  // quality: 0=blackout, 1=wrong, 2=hard, 3=correct, 4=easy, 5=perfect
  calculate(card, quality) {
    const q = Math.max(0, Math.min(5, quality));
    let { repetitions = 0, easeFactor = 2.5, interval = 1 } = card;

    if (q < 3) {
      repetitions = 0;
      interval = 1;
    } else {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    }

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    return { repetitions, easeFactor, interval, nextReview: nextReview.toISOString(), lastQuality: q };
  },
  isDue(card) {
    if (!card.nextReview) return true;
    return new Date(card.nextReview) <= new Date();
  }
};

// ─── CONSTANTS ────────────────────────────────────────────────────
const RANKS = [
  { name: "Yangi boshlovchi", min: 0, color: "#6b7280", emoji: "🌱" },
  { name: "Bronza", min: 100, color: "#cd7f32", emoji: "🥉" },
  { name: "Kumush", min: 500, color: "#9ca3af", emoji: "🥈" },
  { name: "Oltin", min: 1500, color: "#f59e0b", emoji: "🥇" },
  { name: "Diamond", min: 4000, color: "#06b6d4", emoji: "💎" },
  { name: "Grandmaster", min: 10000, color: "#8b5cf6", emoji: "🚀" },
];

const ACHIEVEMENTS = [
  { id: "first_word", label: "Birinchi so'z", desc: "1 ta so'z yodlandi", emoji: "⭐", xp: 10 },
  { id: "ten_words", label: "O'nta kalit", desc: "10 ta so'z yodlandi", emoji: "🗝️", xp: 50 },
  { id: "fifty_words", label: "Yarim yuz", desc: "50 ta so'z yodlandi", emoji: "📖", xp: 100 },
  { id: "hundred_words", label: "Yuz qadamchi", desc: "100 ta so'z yodlandi", emoji: "🏅", xp: 200 },
  { id: "streak_3", label: "3 kunlik zanjir", desc: "3 kun ketma-ket", emoji: "🔥", xp: 75 },
  { id: "streak_7", label: "Haftalik jangchi", desc: "7 kun ketma-ket", emoji: "💪", xp: 200 },
  { id: "streak_30", label: "Oylik ustoz", desc: "30 kun ketma-ket", emoji: "👑", xp: 1000 },
  { id: "first_quiz", label: "Birinchi sinov", desc: "Birinchi quiz yakunlandi", emoji: "🎯", xp: 30 },
  { id: "perfect_quiz", label: "Mukammal!", desc: "100% natija", emoji: "💯", xp: 150 },
  { id: "grammar_10", label: "Grammatika ustasi", desc: "10 ta grammatika o'rganildi", emoji: "🧠", xp: 100 },
  { id: "grammar_50", label: "Grammatika professori", desc: "50 ta grammatika o'rganildi", emoji: "🎓", xp: 300 },
  { id: "quiz_10", label: "Quiz veteran", desc: "10 ta quiz yakunlandi", emoji: "🏆", xp: 200 },
  { id: "speed_demon", label: "Tez javob", desc: "5 soniyada to'g'ri javob", emoji: "⚡", xp: 50 },
  { id: "vocab_tts", label: "Tinglovchi", desc: "50 marta talaffuz eshitildi", emoji: "🔊", xp: 30 },
];

const MOTIVATIONAL_QUOTES = [
  { text: "한국어는 매일 연습해야 해요! 포기하지 마세요!", author: "TOPIK Master" },
  { text: "Har bir kichik qadam — katta g'alabaga olib boradi!", author: "Xaydarov" },
  { text: "TOPIK sertifikati orzusi emas, bu — maqsad!", author: "Motivatsiya" },
  { text: "오늘도 화이팅! Bugun ham kuch bilan!", author: "Korean Proverb" },
  { text: "Har kuni 1% o'sish — 365 kunda 37x yaxshiroq!", author: "Compound Effect" },
  { text: "Koreys tili qiyin emas — faqat izchillik kerak!", author: "TOPIK Master" },
  { text: "실패는 성공의 어머니! Muvaffaqiyatsizlik — muvaffaqiyat onasi!", author: "Korean Wisdom" },
  { text: "꿈을 향해 달려가자! Orzunga qarab yug'ur!", author: "Motivation" },
];

const FALLBACK_VOCAB = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  korean: ["안녕하세요", "감사합니다", "사랑해요", "학교", "친구", "책", "물", "밥", "집", "일",
    "공부", "한국", "사람", "이름", "시간", "날씨", "음식", "영화", "음악", "여행",
    "의사", "병원", "약국", "버스", "지하철", "공항", "호텔", "식당", "시장", "백화점"][i % 30] || `단어 ${i + 1}`,
  uzbek: ["Salom", "Rahmat", "Sevaman", "Maktab", "Do'st", "Kitob", "Suv", "Guruch", "Uy", "Ish",
    "O'qish", "Koreya", "Odam", "Ism", "Vaqt", "Ob-havo", "Ovqat", "Kino", "Musiqa", "Sayohat",
    "Shifokor", "Kasalxona", "Dorixona", "Avtobus", "Metro", "Aeroport", "Mehmonxona", "Restoran", "Bozor", "Do'kon"][i % 30] || `So'z ${i + 1}`,
  pronunciation: ["annyeonghaseyo", "gamsahamnida", "saranghaeyo", "hakgyo", "chingu",
    "chaek", "mul", "bap", "jip", "il", "gongbu", "hanguk", "saram", "ireum", "sigan",
    "nalssi", "eumsik", "yeonghwa", "eumak", "yeohaeng",
    "uisa", "byeongwon", "yakguk", "beoseu", "jihacheol", "gonghang", "hotel", "sikdang", "sijang", "baekhwajeom"][i % 30] || `talaffuz`,
  example: `저는 ${["한국어를 공부해요", "친구를 만나요"][i % 2]}.`,
  category: ["Asosiy", "Kundalik", "Maktab", "Sog'liq", "Transport", "Ovqat"][i % 6],
  difficulty: ["easy", "medium", "hard"][i % 3],
  level: ["A1", "A2", "B1"][i % 3],
}));

const FALLBACK_GRAMMAR = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  grammar: [`이에요/예요`, `은/는`, `이/가`, `을/를`, `에`, `에서`, `하고`, `그리고`, `그런데`, `왜냐하면`,
    `아/어요`, `겠어요`, `고 싶다`, `할 수 있다`, `해야 하다`, `지 않다`, `못 하다`,
    `때문에`, `-(으)면`, `는 것 같다`][i % 20] || `문법 ${i + 1}`,
  meaningUzbek: ["Bu/U", "Mavzu belgisi", "Ega belgisi", "To'ldiruvchi belgisi", "Joy/Vaqt", "Joylashuv",
    "va (bilan)", "va (gap)", "lekin", "chunki", "Hozirgi zamon", "Kelajak zamon",
    "Xohlash", "Qila olish", "Keraklik", "Inkor", "Uda qilolmaslik",
    "Sabab", "Shart", "O'ylash"][i % 20] || `Ma'no`,
  explanation: `Bu grammatik qoida ${i + 1}-darsda o'rgatiladi va kundalik muloqotda juda ko'p ishlatiladi.`,
  structure: `[Ot] + ${["이에요", "은/는", "이/가", "을/를"][i % 4]}`,
  examples: [
    { korean: `저는 학생이에요.`, uzbek: `Men talabaman.` },
    { korean: `이것은 책이에요.`, uzbek: `Bu kitob.` },
  ],
  usageTips: `Bu qoidani kundalik hayotda tez-tez ishlating. Ayniqsa ${["do'stlar bilan", "maktabda", "bozorda"][i % 3]} foydali.`,
  level: ["TOPIK1", "TOPIK1", "TOPIK2"][i % 3],
}));

// ─── DATE UTILS ───────────────────────────────────────────────────
const dateKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const getYesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
};

// ─── GLOBAL STYLES ─────────────────────────────────────────────────
const GlobalStyle = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
    :root {
      --bg:       ${dark ? "#0c0c12" : "#f4f2ff"};
      --bg2:      ${dark ? "#13131a" : "#ffffff"};
      --bg3:      ${dark ? "#1a1a24" : "#ede9ff"};
      --card:     ${dark ? "#18182200" : "#ffffff"};
      --card-s:   ${dark ? "#1e1e2c" : "#ffffff"};
      --border:   ${dark ? "rgba(139,92,246,0.2)" : "rgba(124,58,237,0.14)"};
      --border2:  ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
      --text:     ${dark ? "#f0eeff" : "#160f2d"};
      --text2:    ${dark ? "#948fad" : "#5e576e"};
      --text3:    ${dark ? "#5e576e" : "#948fad"};
      --primary:  #7c3aed;
      --p2:       #6d28d9;
      --accent:   #06b6d4;
      --a2:       #0891b2;
      --gold:     #f59e0b;
      --green:    #10b981;
      --red:      #ef4444;
      --pink:     #ec4899;
      --orange:   #f97316;
      --grad1:    linear-gradient(135deg, #7c3aed 0%, #6d28d9 60%, #4c1d95 100%);
      --grad2:    linear-gradient(135deg, #06b6d4 0%, #7c3aed 100%);
      --grad3:    linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
      --grad4:    linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      --glow:     0 0 40px rgba(124,58,237,0.35);
      --glow2:    0 0 20px rgba(6,182,212,0.25);
      --shadow:   ${dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(124,58,237,0.14)"};
      --shadow2:  ${dark ? "0 2px 12px rgba(0,0,0,0.4)" : "0 2px 12px rgba(124,58,237,0.08)"};
      --r:        16px;
      --r2:       12px;
      --r3:       8px;
      --font:     'Nunito', sans-serif;
      --font-kr:  'Noto Sans KR', sans-serif;
    }
    html, body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font);
      min-height: 100vh;
      transition: background 0.3s ease, color 0.3s ease;
      -webkit-font-smoothing: antialiased;
    }
    input, textarea, select {
      font-family: var(--font);
      background: var(--bg3);
      color: var(--text);
      border: 1.5px solid var(--border2);
      border-radius: var(--r3);
      padding: 10px 14px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      width: 100%;
    }
    input:focus, textarea:focus, select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
    }
    button { font-family: var(--font); cursor: pointer; transition: all 0.18s ease; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 4px; opacity: 0.6; }
    .glass {
      background: ${dark ? "rgba(24,24,34,0.88)" : "rgba(255,255,255,0.88)"};
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    .kr { font-family: var(--font-kr); }
    /* Buttons */
    .btn-primary {
      background: var(--grad1);
      color: #fff;
      border: none;
      border-radius: var(--r3);
      padding: 10px 20px;
      font-weight: 800;
      font-size: 14px;
      box-shadow: 0 4px 16px rgba(124,58,237,0.35);
      letter-spacing: 0.3px;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(124,58,237,0.5); }
    .btn-primary:active { transform: translateY(0); box-shadow: 0 2px 8px rgba(124,58,237,0.3); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .btn-secondary {
      background: var(--grad2);
      color: #fff;
      border: none;
      border-radius: var(--r3);
      padding: 10px 20px;
      font-weight: 800;
      font-size: 14px;
      box-shadow: 0 4px 16px rgba(6,182,212,0.3);
    }
    .btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(6,182,212,0.4); }
    .btn-ghost {
      background: transparent;
      color: var(--text2);
      border: 1.5px solid var(--border2);
      border-radius: var(--r3);
      padding: 9px 18px;
      font-weight: 700;
      font-size: 14px;
    }
    .btn-ghost:hover { background: var(--bg3); color: var(--text); border-color: var(--primary); }
    .btn-danger {
      background: rgba(239,68,68,0.12);
      color: #ef4444;
      border: 1.5px solid rgba(239,68,68,0.3);
      border-radius: var(--r3);
      padding: 9px 18px;
      font-weight: 700;
      font-size: 14px;
    }
    .btn-danger:hover { background: rgba(239,68,68,0.2); }
    .btn-success {
      background: rgba(16,185,129,0.12);
      color: #10b981;
      border: 1.5px solid rgba(16,185,129,0.3);
      border-radius: var(--r3);
      padding: 9px 18px;
      font-weight: 700;
      font-size: 14px;
    }
    .btn-success:hover { background: rgba(16,185,129,0.2); }
    /* Cards */
    .card {
      background: var(--card-s);
      border: 1px solid var(--border2);
      border-radius: var(--r);
      box-shadow: var(--shadow2);
    }
    .card-glow {
      background: var(--card-s);
      border: 1px solid var(--border);
      border-radius: var(--r);
      box-shadow: var(--shadow);
    }
    .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
    .card-hover:hover { transform: translateY(-3px); box-shadow: var(--glow); }
    /* Badges */
    .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.3px; }
    .badge-purple { background: rgba(124,58,237,0.15); color: #a78bfa; }
    .badge-cyan   { background: rgba(6,182,212,0.15);  color: #22d3ee; }
    .badge-gold   { background: rgba(245,158,11,0.15); color: #fbbf24; }
    .badge-green  { background: rgba(16,185,129,0.15); color: #34d399; }
    .badge-red    { background: rgba(239,68,68,0.15);  color: #f87171; }
    .badge-pink   { background: rgba(236,72,153,0.15); color: #f472b6; }
    .badge-orange { background: rgba(249,115,22,0.15); color: #fb923c; }
    /* Progress */
    .progress-bar  { height: 6px; border-radius: 3px; background: var(--bg3); overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 3px; background: var(--grad1); transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
    /* Animations */
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
    @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(124,58,237,0.3)} 50%{box-shadow:0 0 40px rgba(124,58,237,0.6)} }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
    @keyframes slideIn  { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
    @keyframes scaleIn  { from{opacity:0;transform:scale(0.88)} to{opacity:1;transform:scale(1)} }
    @keyframes shimmer  { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
    @keyframes flip     { 0%{transform:rotateY(0)} 100%{transform:rotateY(180deg)} }
    @keyframes bounce-in { 0%{transform:scale(0.6);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
    @keyframes countdown { from{stroke-dashoffset:0} to{stroke-dashoffset:251} }
    @keyframes spin      { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    .animate-fadein   { animation: fadeUp 0.38s cubic-bezier(0.4,0,0.2,1) both; }
    .animate-scalein  { animation: scaleIn 0.3s ease both; }
    .animate-float    { animation: float 3s ease-in-out infinite; }
    .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
    .animate-spin     { animation: spin 1s linear infinite; }
    .animate-bounce-in { animation: bounce-in 0.4s ease both; }
    /* Skeleton loader */
    .skeleton {
      background: linear-gradient(90deg, var(--bg3) 25%, var(--bg2) 50%, var(--bg3) 75%);
      background-size: 400px 100%;
      animation: shimmer 1.4s ease infinite;
    }
    /* Responsive */
    @media(max-width:768px) {
      .hide-mobile { display: none !important; }
      .mobile-full { width: 100% !important; }
      .mobile-col { flex-direction: column !important; }
      .mobile-wrap { flex-wrap: wrap !important; }
    }
    @media(min-width:769px) { .show-mobile-only { display: none !important; } }
    /* Toast */
    .toast-container { position: fixed; top: 80px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px; }
    .toast { padding: 12px 18px; border-radius: 12px; font-weight: 700; font-size: 14px; backdrop-filter: blur(12px); animation: fadeUp 0.3s ease both; box-shadow: var(--shadow); min-width: 220px; display: flex; align-items: center; gap: 10px; }
    .toast-success { background: rgba(16,185,129,0.92); color: #fff; }
    .toast-error   { background: rgba(239,68,68,0.92); color: #fff; }
    .toast-info    { background: rgba(124,58,237,0.92); color: #fff; }
    .toast-warning { background: rgba(245,158,11,0.92); color: #fff; }
    /* Card flip */
    .flip-container { perspective: 1000px; }
    .flip-inner { transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); transform-style: preserve-3d; position: relative; }
    .flip-inner.flipped { transform: rotateY(180deg); }
    .flip-front, .flip-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .flip-back { transform: rotateY(180deg); }
    /* Scrollbar hiding */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// ─── TOAST SYSTEM ─────────────────────────────────────────────────
const ToastContext = React.createContext(null);
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info", duration = 2800) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), duration);
  }, []);
  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" && "✅"}
            {t.type === "error" && "❌"}
            {t.type === "info" && "💡"}
            {t.type === "warning" && "⚠️"}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
const useToast = () => React.useContext(ToastContext);

// ─── XP POPUP ─────────────────────────────────────────────────────
function XPPopup({ amount, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 1600); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 9998, pointerEvents: "none", animation: "bounce-in 0.35s ease both, fadeIn 0.3s ease 1.2s reverse both" }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#f59e0b", textShadow: "0 2px 20px rgba(245,158,11,0.6)" }}>
        +{amount} XP ⚡
      </div>
    </div>
  );
}

// ─── HEADER ───────────────────────────────────────────────────────
function Header({ dark, setDark, page, setPage, xp, streak, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const rank = RANKS.filter(r => xp >= r.min).pop();

  const nav = [
    { id: "dashboard", label: "Dashboard", icon: "bar-chart" },
    { id: "vocab", label: "Lug'at", icon: "book" },
    { id: "grammar", label: "Grammatika", icon: "brain" },
    { id: "quiz", label: "Quiz", icon: "target" },
    { id: "practice", label: "Mashq", icon: "pen-tool" },
    { id: "progress", label: "Progress", icon: "trending-up" },
    { id: "calendar", label: "Kalendar", icon: "calendar" },
  ];

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 1000, background: dark ? "rgba(12,12,18,0.93)" : "rgba(244,242,255,0.93)", backdropFilter: "blur(28px)", borderBottom: "1px solid var(--border)", padding: "0 20px" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", gap: 14, height: 62 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flexShrink: 0 }} onClick={() => setPage("home")}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow)", fontSize: 14, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>KR</div>
          <div className="hide-mobile">
            <div style={{ fontWeight: 900, fontSize: 14, background: "var(--grad2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15 }}>TOPIK</div>
            <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 700, letterSpacing: 2.5, lineHeight: 1 }}>by Xaydarov</div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", gap: 2, flex: 1, marginLeft: 12 }} className="hide-mobile">
          {nav.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 11px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 12.5, background: page === n.id ? "rgba(124,58,237,0.14)" : "transparent", color: page === n.id ? "var(--primary)" : "var(--text2)", transition: "all 0.2s", letterSpacing: "0.2px" }}>
              <Icon name={n.icon} size={14} /> {n.label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          {/* Streak */}
          <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
            <Icon name="flame" size={15} /><span style={{ fontWeight: 900, fontSize: 13 }}>{streak}</span>
          </div>
          {/* XP */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(124,58,237,0.12)", color: "var(--primary)", cursor: "pointer" }} onClick={() => setPage("progress")}>
            <Icon name="zap" size={15} /><span style={{ fontWeight: 900, fontSize: 13 }}>{xp.toLocaleString()}</span>
          </div>
          {/* Rank emoji */}
          <div className="hide-mobile" style={{ fontSize: 18, lineHeight: 1 }} title={rank.name}>{rank.emoji}</div>
          {/* Dark toggle */}
          <button onClick={() => setDark(d => !d)} style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid var(--border2)", background: "var(--card-s)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
            <Icon name={dark ? "sun" : "moon"} size={16} />
          </button>
          {/* Avatar */}
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--grad1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, cursor: "pointer", boxShadow: "var(--glow)", border: "2px solid var(--primary)" }} onClick={() => setPage("profile")}>
            {user?.avatar || "🧑‍💻"}
          </div>
          {/* Mobile burger */}
          <button className="show-mobile-only" onClick={() => setMobileOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 9, border: "1.5px solid var(--border2)", background: "var(--card-s)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text2)" }}>
            <Icon name={mobileOpen ? "x" : "menu"} size={17} />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div style={{ background: "var(--card-s)", borderTop: "1px solid var(--border2)", padding: "10px 14px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {nav.map(n => (
              <button key={n.id} onClick={() => { setPage(n.id); setMobileOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 13, background: page === n.id ? "rgba(124,58,237,0.12)" : "transparent", color: page === n.id ? "var(--primary)" : "var(--text2)" }}>
                <Icon name={n.icon} size={16} />{n.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 10, padding: "10px 0", borderTop: "1px solid var(--border2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>
              <Icon name="flame" size={15} /><span style={{ fontWeight: 900, fontSize: 13 }}>{streak} kun</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 8, background: "rgba(124,58,237,0.12)", color: "var(--primary)" }}>
              <Icon name="zap" size={15} /><span style={{ fontWeight: 900, fontSize: 13 }}>{xp} XP</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────
function HomePage({ setPage, xp, streak }) {
  const [quoteIdx] = useState(() => Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length);
  const quote = MOTIVATIONAL_QUOTES[quoteIdx];

  const features = [
    { icon: "book", label: "1800+ Lug'at", desc: "SM-2 algoritm bilan aqlli takrorlash", color: "#7c3aed", grad: "var(--grad1)" },
    { icon: "brain", label: "150+ Grammatika", desc: "Tuzilma, misol va maslahatlar", color: "#06b6d4", grad: "var(--grad2)" },
    { icon: "target", label: "Smart Quiz", desc: "Vaqt limiti va statistika", color: "#f59e0b", grad: "var(--grad3)" },
    { icon: "volume-2", label: "TTS Talaffuz", desc: "Native koreyscha ovoz", color: "#10b981", grad: "var(--grad4)" },
    { icon: "trending-up", label: "Progress Ring", desc: "TOPIK tayyorlik darajasi", color: "#ec4899", grad: "linear-gradient(135deg,#ec4899,#7c3aed)" },
    { icon: "calendar", label: "Streak Xarita", desc: "Har kunlik faollik", color: "#f97316", grad: "linear-gradient(135deg,#f97316,#f59e0b)" },
  ];

  const heroStats = [
    { label: "🔥 Streak", value: `${streak} kun` },
    { label: "⚡ XP", value: xp.toLocaleString() },
    { label: "📚 Lug'at", value: "1800+" },
    { label: "🧠 Grammatika", value: "150+" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section style={{ padding: "72px 0 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Quote */}
        <div style={{ marginBottom: 24, padding: "12px 20px", background: "rgba(124,58,237,0.07)", borderRadius: 14, border: "1px solid var(--border)", display: "inline-block", maxWidth: 600 }}>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }} className="kr">"{quote.text}"</div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>— {quote.author}</div>
        </div>

        <div className="badge badge-purple" style={{ marginBottom: 20, fontSize: 12, padding: "6px 16px" }}>
          ✨ 🇰🇷 TOPIK 1 — Premium O'quv Platformasi
        </div>

        <h1 style={{ fontSize: "clamp(30px,6vw,62px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 20 }}>
          <span style={{ background: "var(--grad1)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", display: "block" }}>Koreyscha — professional</span>
          <span>darajada egalla 🇰🇷</span>
        </h1>

        <p style={{ fontSize: "clamp(14px,2vw,17px)", color: "var(--text2)", maxWidth: 560, margin: "0 auto 36px", lineHeight: 1.75 }}>
          1800 ta lug'at, 150+ grammatika, SM-2 algoritm, native TTS talaffuz va to'liq quiz tizimi.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <button className="btn-primary" style={{ padding: "13px 30px", fontSize: 15, borderRadius: 12 }} onClick={() => setPage("vocab")}>
            🚀 O'rganishni Boshlash
          </button>
          <button className="btn-ghost" style={{ padding: "13px 30px", fontSize: 15, borderRadius: 12 }} onClick={() => setPage("quiz")}>
            <Icon name="play-circle" size={17} /> Quiz Sinash
          </button>
        </div>

        {/* Hero stats */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {heroStats.map((s, i) => (
            <div key={i} className="glass card animate-float" style={{ padding: "11px 18px", borderRadius: 13, border: "1px solid var(--border)", animationDelay: `${i * 0.4}s` }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: "var(--primary)" }}>{s.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section style={{ marginBottom: 64 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6, textAlign: "center" }}>Nima o'rganasiz? 📚</h2>
        <p style={{ color: "var(--text2)", textAlign: "center", marginBottom: 28, fontSize: 14 }}>Platforma xususiyatlari</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14 }}>
          {features.map((f, i) => (
            <div key={i} className="card card-hover" style={{ padding: "20px 18px", cursor: "pointer", transition: "all 0.25s" }} onClick={() => setPage(["vocab", "grammar", "quiz", "vocab", "progress", "calendar"][i])}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 12 }}>
                <Icon name={f.icon} size={22} />
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 5 }}>{f.label}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ marginBottom: 80 }}>
        <div className="card-glow" style={{ padding: "36px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>🇰🇷</div>
          <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>TOPIK 1 ga hoziroq tayyorlaning!</h3>
          <p style={{ color: "var(--text2)", marginBottom: 24, maxWidth: 500, margin: "0 auto 24px" }}>Har kuni 15 daqiqa — 3 oyda TOPIK 1 sertifikati!</p>
          <button className="btn-primary" style={{ padding: "13px 32px", fontSize: 15 }} onClick={() => setPage("vocab")}>
            Boshlash →
          </button>
        </div>
      </section>
    </div>
  );
}

// ─── VOCAB SETUP ───────────────────────────────────────────────────
function VocabSetup({ onStart }) {
  const [days, setDays] = useState(30);
  const perDay = Math.ceil(1800 / days);
  const presets = [7, 14, 30, 60, 90, 180];

  return (
    <div style={{ maxWidth: 560, margin: "56px auto", padding: "0 20px" }}>
      <div className="card-glow animate-scalein" style={{ padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📅</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>O'quv Rejangizni Belgilang</h2>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>1800 ta lug'atni necha kunda o'rganmoqchisiz?</p>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
            <label style={{ fontWeight: 800, fontSize: 14 }}>Kun soni</label>
            <span style={{ fontWeight: 900, fontSize: 24, color: "var(--primary)" }}>{days} <span style={{ fontSize: 14 }}>kun</span></span>
          </div>
          <input type="range" min={7} max={365} value={days} onChange={e => setDays(+e.target.value)}
            style={{ width: "100%", height: 6, appearance: "none", WebkitAppearance: "none", borderRadius: 3, border: "none", background: `linear-gradient(to right, var(--primary) ${((days - 7) / (365 - 7)) * 100}%, var(--bg3) 0%)`, cursor: "pointer", outline: "none", padding: 0, accentColor: "var(--primary)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>7 kun</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>365 kun</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, justifyContent: "center" }}>
          {presets.map(d => (
            <button key={d} onClick={() => setDays(d)} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${days === d ? "var(--primary)" : "var(--border2)"}`, background: days === d ? "rgba(124,58,237,0.14)" : "transparent", color: days === d ? "var(--primary)" : "var(--text3)", fontSize: 12, fontWeight: 800, transition: "all 0.2s" }}>
              {d}k
            </button>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Kunlik", value: perDay, unit: "so'z", color: "var(--primary)" },
            { label: "Haftalik", value: Math.min(perDay * 7, 1800), unit: "so'z", color: "#06b6d4" },
            { label: "Jami", value: 1800, unit: "so'z", color: "#10b981" },
          ].map((s, i) => (
            <div key={i} style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.unit}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "rgba(124,58,237,0.07)", borderRadius: 12, padding: "14px 16px", marginBottom: 24, borderLeft: "3px solid var(--primary)" }}>
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.65 }}>
            🧠 <strong>SM-2 Spaced Repetition</strong> algoritmi: yodlab qolgan so'zlar optimal intervalda qayta ko'rsatiladi.
          </div>
        </div>

        <button className="btn-primary" style={{ width: "100%", padding: 14, fontSize: 15, borderRadius: 12 }} onClick={() => onStart(days)}>
          🚀 Boshlash
        </button>
      </div>
    </div>
  );
}

// ─── WORD CARD (flip animation, TTS, SM-2) ─────────────────────────
function WordCard({ word, onKnow, onRepeat, onHard, onFavorite, isFavorite, tts }) {
  const [flipped, setFlipped] = useState(false);
  const [showExample, setShowExample] = useState(false);

  // BUG FIX: flip state ni so'z o'zgarganda reset qilish
  useEffect(() => {
    setFlipped(false);
    setShowExample(false);
  }, [word?.id]);

  if (!word) return null;

  const diffConfig = {
    easy: { color: "#10b981", label: "Oson", bg: "rgba(16,185,129,0.1)" },
    medium: { color: "#f59e0b", label: "O'rta", bg: "rgba(245,158,11,0.1)" },
    hard: { color: "#ef4444", label: "Qiyin", bg: "rgba(239,68,68,0.1)" },
  };
  const diff = diffConfig[word.difficulty] || diffConfig.medium;

  return (
    <div className="animate-fadein">
      {/* Flip card */}
      <div className="flip-container" style={{ marginBottom: 14 }}>
        <div className={`flip-inner ${flipped ? "flipped" : ""}`} style={{ minHeight: 280 }}>
          {/* Front */}
          <div className="flip-front card-glow" style={{ padding: "52px 28px 28px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderRadius: "var(--r)" }} onClick={() => setFlipped(true)}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at top, rgba(124,58,237,0.04), transparent)", pointerEvents: "none" }} />
            {/* Top badges */}
            <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 6 }}>
              <span className="badge" style={{ background: diff.bg, color: diff.color, fontSize: 10 }}>{diff.label}</span>
              {word.level && <span className="badge badge-cyan" style={{ fontSize: 10 }}>{word.level}</span>}
            </div>
            {/* Fav button */}
            <button onClick={e => { e.stopPropagation(); onFavorite(word.id); }} style={{ position: "absolute", top: 12, right: 12, background: "transparent", border: "none", color: isFavorite ? "#ef4444" : "var(--text3)", transition: "all 0.2s", padding: 6 }}>
              <Icon name="heart" size={20} />
            </button>
            {/* TTS button */}
            <button onClick={e => { e.stopPropagation(); tts.speak(word.korean, "ko-KR"); }} style={{ position: "absolute", bottom: 14, right: 14, background: "rgba(124,58,237,0.1)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 8px", color: "var(--primary)", display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700 }}>
              <Icon name={tts.speaking ? "volume-x" : "volume-2"} size={14} />
              {tts.speaking ? "..." : "듣기"}
            </button>

            <div className="kr" style={{ fontSize: "clamp(40px,8vw,72px)", fontWeight: 900, color: "var(--text)", marginBottom: 10, textAlign: "center" }}>{word.korean}</div>
            <div style={{ fontSize: 14, color: "var(--text3)", letterSpacing: 0.5 }}>[{word.pronunciation || "..."}]</div>
            <div style={{ marginTop: 20, fontSize: 12, color: "var(--text3)", opacity: 0.7 }}>👆 tap → tarjimani ko'ring</div>
          </div>

          {/* Back */}
          <div className="flip-back card-glow" style={{ padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, borderRadius: "var(--r)", cursor: "pointer" }} onClick={() => setFlipped(false)}>
            <div style={{ position: "absolute", top: 14, right: 14 }}>
              <button onClick={e => { e.stopPropagation(); onFavorite(word.id); }} style={{ background: "transparent", border: "none", color: isFavorite ? "#ef4444" : "var(--text3)", padding: 6 }}>
                <Icon name="heart" size={20} />
              </button>
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "var(--primary)", marginBottom: 8, textAlign: "center" }}>{word.uzbek}</div>
            <div className="kr" style={{ fontSize: 20, color: "var(--text2)", marginBottom: 4 }}>{word.korean}</div>
            <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 14 }}>[{word.pronunciation}]</div>
            {word.category && <span className="badge badge-cyan" style={{ marginBottom: 12 }}>{word.category}</span>}

            <button onClick={e => { e.stopPropagation(); setShowExample(v => !v); }} style={{ fontSize: 12, color: "var(--accent)", background: "transparent", border: "none", fontWeight: 800, cursor: "pointer", padding: "4px 8px" }}>
              {showExample ? "▲ Yopish" : "📝 Misol ko'rish"}
            </button>

            {showExample && word.example && (
              <div className="kr" style={{ marginTop: 10, background: "var(--bg3)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "var(--text2)", maxWidth: "100%", textAlign: "center" }}>
                {word.example}
              </div>
            )}
            <div style={{ marginTop: 16, fontSize: 11, color: "var(--text3)" }}>👆 tap → koreyscha</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <button onClick={onHard} className="btn-danger" style={{ padding: "12px 0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 800 }}>
          <Icon name="alert-circle" size={15} /> Qiyin
        </button>
        <button onClick={onRepeat} style={{ padding: "12px 0", borderRadius: 12, border: "1.5px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.08)", color: "#f59e0b", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="rotate-ccw" size={15} /> Qayta
        </button>
        <button onClick={onKnow} className="btn-primary" style={{ padding: "12px 0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="check" size={15} /> Bildim!
        </button>
      </div>
    </div>
  );
}

// ─── VOCAB PAGE ─────────────────────────────────────────────────────
function VocabPage({ addXP, addAchievement }) {
  const vocab = useMemo(() => vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB, []);
  const toast = useToast();
  const tts = useTTS();

  const [plan, setPlan, removePlan] = useLocalStorage("tm_plan", null);
  const [srData, setSrData] = useLocalStorage("tm_sr_data", {}); // SM-2 data per word id
  const [learnedIds, setLearnedIds] = useLocalStorage("tm_learned", []);
  const [hardIds, setHardIds] = useLocalStorage("tm_hard", []);
  const [favoriteIds, setFavoriteIds] = useLocalStorage("tm_favorites", []);
  const [ttsCount, setTtsCount] = useLocalStorage("tm_tts_count", 0);

  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
  const hardSet = useMemo(() => new Set(hardIds), [hardIds]);
  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 280);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("cards");
  const [sessionMode, setSessionMode] = useState("daily"); // daily | hard | favorites | sr
  const [xpPopup, setXpPopup] = useState(null);

  const perDay = plan ? Math.ceil(1800 / plan) : 30;

  // SM-2 due words
  const dueWords = useMemo(() =>
    vocab.filter(w => srData[w.id] ? SM2.isDue(srData[w.id]) : !learnedSet.has(w.id)),
    [vocab, srData, learnedSet]
  );

  // Session words based on mode
  const sessionWords = useMemo(() => {
    if (sessionMode === "hard") return vocab.filter(w => hardSet.has(w.id));
    if (sessionMode === "favorites") return vocab.filter(w => favoriteSet.has(w.id));
    if (sessionMode === "sr") return dueWords.slice(0, 20);
    // daily: take next batch not yet learned
    const start = Math.floor(learnedSet.size / perDay) * perDay;
    return vocab.slice(start, Math.min(start + perDay, vocab.length)).filter(w => !learnedSet.has(w.id));
  }, [sessionMode, vocab, hardSet, favoriteSet, dueWords, learnedSet, perDay]);

  const currentWord = sessionWords[currentIdx % Math.max(sessionWords.length, 1)] || null;
  const pct = Math.round((learnedSet.size / vocab.length) * 100);

  // BUG FIX: learnedIds Set-based O(1) lookup
  const allFiltered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return vocab.filter(w => {
      const matchSearch = !q || w.korean?.includes(q) || w.uzbek?.toLowerCase().includes(q) || w.pronunciation?.toLowerCase().includes(q);
      if (filter === "learned") return matchSearch && learnedSet.has(w.id);
      if (filter === "hard") return matchSearch && hardSet.has(w.id);
      if (filter === "favorites") return matchSearch && favoriteSet.has(w.id);
      if (filter === "remaining") return matchSearch && !learnedSet.has(w.id);
      return matchSearch;
    });
  }, [vocab, debouncedSearch, filter, learnedSet, hardSet, favoriteSet]);

  const showXP = (amount) => {
    setXpPopup(amount);
    addXP(amount);
  };

  const handleKnow = useCallback(() => {
    if (!currentWord) return;
    const updated = SM2.calculate(srData[currentWord.id] || {}, 4);
    setSrData(d => ({ ...d, [currentWord.id]: updated }));
    setLearnedIds(prev => {
      const newSet = [...new Set([...prev, currentWord.id])];
      // Achievement checks
      if (newSet.length === 1) addAchievement("first_word");
      if (newSet.length === 10) addAchievement("ten_words");
      if (newSet.length === 50) addAchievement("fifty_words");
      if (newSet.length === 100) addAchievement("hundred_words");
      return newSet;
    });
    showXP(5);
    toast("So'z yodlandi! ✅", "success");
    setCurrentIdx(i => i + 1);
  }, [currentWord, srData]);

  const handleRepeat = useCallback(() => {
    if (!currentWord) return;
    const updated = SM2.calculate(srData[currentWord.id] || {}, 2);
    setSrData(d => ({ ...d, [currentWord.id]: updated }));
    toast("Keyinroq qayta ko'rsatiladi 🔁", "info");
    setCurrentIdx(i => i + 1);
  }, [currentWord, srData]);

  const handleHard = useCallback(() => {
    if (!currentWord) return;
    const updated = SM2.calculate(srData[currentWord.id] || {}, 1);
    setSrData(d => ({ ...d, [currentWord.id]: updated }));
    setHardIds(prev => [...new Set([...prev, currentWord.id])]);
    toast("Qiyin so'zlarga qo'shildi ⭐", "warning");
    setCurrentIdx(i => i + 1);
  }, [currentWord, srData]);

  const toggleFav = useCallback((id) => {
    setFavoriteIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const handleTTS = useCallback((word) => {
    tts.speak(word.korean, "ko-KR");
    setTtsCount(c => {
      const n = c + 1;
      if (n === 50) addAchievement("vocab_tts");
      return n;
    });
  }, [tts]);

  if (!plan) return <VocabSetup onStart={d => setPlan(d)} />;

  const sessionModes = [
    { id: "daily", label: "Kunlik", icon: "calendar", count: sessionWords.length },
    { id: "sr", label: "Takrorlash", icon: "refresh-cw", count: dueWords.length },
    { id: "hard", label: "Qiyin", icon: "alert-circle", count: hardSet.size },
    { id: "favorites", label: "Sevimli", icon: "heart", count: favoriteSet.size },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      {xpPopup && <XPPopup amount={xpPopup} onDone={() => setXpPopup(null)} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Smart Lug'at 📚</h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>Kunlik maqsad: <strong style={{ color: "var(--primary)" }}>{perDay}</strong> so'z • SM-2 algoritm</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setViewMode("cards")} className={viewMode === "cards" ? "btn-primary" : "btn-ghost"} style={{ padding: "7px 14px", fontSize: 12 }}>🃏 Kartalar</button>
          <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "btn-primary" : "btn-ghost"} style={{ padding: "7px 14px", fontSize: 12 }}>📋 Ro'yxat</button>
          <button onClick={() => removePlan()} className="btn-ghost" style={{ padding: "7px 10px", fontSize: 12 }} title="Rejani qayta sozlash">
            <Icon name="settings" size={15} />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: "16px 20px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 13 }}>Umumiy progress</span>
          <span style={{ fontWeight: 900, fontSize: 14, color: "var(--primary)" }}>{pct}% — {learnedSet.size}/{vocab.length}</span>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
        <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
          {[
            { label: "✅ Yodlangan", val: learnedSet.size },
            { label: "⭐ Qiyin", val: hardSet.size },
            { label: "❤️ Sevimli", val: favoriteSet.size },
            { label: "🔄 SR kutmoqda", val: dueWords.length },
            { label: "📖 Qolgan", val: vocab.length - learnedSet.size },
          ].map((s, i) => (
            <span key={i} style={{ fontSize: 12, color: "var(--text2)" }}>{s.label}: <strong style={{ color: "var(--text)" }}>{s.val}</strong></span>
          ))}
        </div>
      </div>

      {viewMode === "cards" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr clamp(280px,38%,400px)", gap: 20, alignItems: "start" }}>
          {/* Card + Session Selector */}
          <div>
            {/* Session mode tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {sessionModes.map(m => (
                <button key={m.id} onClick={() => { setSessionMode(m.id); setCurrentIdx(0); }}
                  style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${sessionMode === m.id ? "var(--primary)" : "var(--border2)"}`, background: sessionMode === m.id ? "rgba(124,58,237,0.12)" : "transparent", color: sessionMode === m.id ? "var(--primary)" : "var(--text2)", fontSize: 12, fontWeight: 700, transition: "all 0.2s" }}>
                  <Icon name={m.icon} size={13} /> {m.label} <span className="badge badge-purple" style={{ padding: "1px 7px", fontSize: 10 }}>{m.count}</span>
                </button>
              ))}
            </div>

            {currentWord ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>
                    {Math.min(currentIdx + 1, sessionWords.length)} / {sessionWords.length} so'z
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>
                    {dueWords.length > 0 && `🔄 ${dueWords.length} ta takrorlash kutmoqda`}
                  </span>
                </div>
                <WordCard
                  word={currentWord}
                  onKnow={handleKnow}
                  onRepeat={handleRepeat}
                  onHard={handleHard}
                  onFavorite={toggleFav}
                  isFavorite={favoriteSet.has(currentWord?.id)}
                  tts={{ speak: (t, l) => handleTTS(currentWord), speaking: tts.speaking, supported: tts.supported }}
                />
              </>
            ) : (
              <div className="card-glow animate-scalein" style={{ padding: 48, textAlign: "center" }}>
                <div style={{ fontSize: 60, marginBottom: 16 }}>🎊</div>
                <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Sessiya tugadi!</h3>
                <p style={{ color: "var(--text2)", marginBottom: 24 }}>
                  {sessionMode === "daily" ? "Bugungi so'zlarni tugatdingiz!" : "Bu rejim bo'yicha so'z qolmadi."}
                </p>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => { setCurrentIdx(0); }}>Qayta boshlash</button>
                  <button className="btn-ghost" onClick={() => setSessionMode("sr")}>Takrorlash rejimi</button>
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 14 }}>📊 Bugungi statistika</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { label: "Maqsad", val: perDay, color: "var(--primary)" },
                  { label: "Tugallandi", val: Math.min(currentIdx, sessionWords.length), color: "#10b981" },
                  { label: "Jami XP", val: `${Math.min(currentIdx, sessionWords.length) * 5}+`, color: "#f59e0b" },
                  { label: "SR due", val: dueWords.length, color: "#06b6d4" },
                ].map((s, i) => (
                  <div key={i} style={{ background: "var(--bg3)", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TTS info */}
            {tts.supported && (
              <div className="card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(6,182,212,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)", flexShrink: 0 }}>
                  <Icon name="volume-2" size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>Native Talaffuz</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{ttsCount} marta eshitildi</div>
                </div>
              </div>
            )}

            {/* Difficulty breakdown */}
            <div className="card" style={{ padding: 18 }}>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 12 }}>📈 Qiyinlik darajasi</div>
              {["easy", "medium", "hard"].map(d => {
                const count = vocab.filter(w => w.difficulty === d).length;
                const learned = vocab.filter(w => w.difficulty === d && learnedSet.has(w.id)).length;
                const pct2 = Math.round((learned / count) * 100) || 0;
                const colors = { easy: "#10b981", medium: "#f59e0b", hard: "#ef4444" };
                const labels = { easy: "Oson", medium: "O'rta", hard: "Qiyin" };
                return (
                  <div key={d} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: colors[d], fontWeight: 700 }}>{labels[d]}</span>
                      <span style={{ fontSize: 12, color: "var(--text3)" }}>{learned}/{count}</span>
                    </div>
                    <div className="progress-bar" style={{ height: 5 }}>
                      <div className="progress-fill" style={{ width: `${pct2}%`, background: colors[d] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* List view */
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Koreyscha yoki o'zbekcha qidirish..." style={{ flex: 1, minWidth: 200 }} />
            <select value={filter} onChange={e => setFilter(e.target.value)} style={{ minWidth: 160, flex: "none" }}>
              <option value="all">Hammasi ({vocab.length})</option>
              <option value="learned">Yodlangan ({learnedSet.size})</option>
              <option value="remaining">Qolgan ({vocab.length - learnedSet.size})</option>
              <option value="hard">Qiyin ({hardSet.size})</option>
              <option value="favorites">Sevimli ({favoriteSet.size})</option>
            </select>
          </div>

          <div style={{ marginBottom: 12, fontSize: 13, color: "var(--text3)" }}>
            {allFiltered.length} ta natija
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 10 }}>
            {allFiltered.slice(0, 100).map(w => (
              <div key={w.id} className="card card-hover" style={{ padding: "12px 14px", display: "flex", gap: 12, alignItems: "flex-start", position: "relative" }}>
                {learnedSet.has(w.id) && <div style={{ position: "absolute", top: 8, right: 8, color: "#10b981", fontSize: 13 }}>✅</div>}
                <div style={{ flexShrink: 0 }}>
                  <div className="kr" style={{ fontSize: 22, fontWeight: 900, color: "var(--text)" }}>{w.korean}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>[{w.pronunciation}]</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--primary)", marginBottom: 4 }}>{w.uzbek}</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {w.category && <span className="badge badge-cyan" style={{ fontSize: 10 }}>{w.category}</span>}
                    {hardSet.has(w.id) && <span className="badge badge-red" style={{ fontSize: 10 }}>Qiyin</span>}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  <button onClick={() => tts.speak(w.korean, "ko-KR")} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", padding: 4 }}>
                    <Icon name="volume-2" size={15} />
                  </button>
                  <button onClick={() => toggleFav(w.id)} style={{ background: "transparent", border: "none", color: favoriteSet.has(w.id) ? "#ef4444" : "var(--text3)", cursor: "pointer", padding: 4 }}>
                    <Icon name="heart" size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {allFiltered.length > 100 && (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text3)", fontSize: 13 }}>
              {allFiltered.length - 100} ta natija ko'rsatilmadi — qidirishni aniqlashtiring
            </div>
          )}
          {allFiltered.length === 0 && (
            <div style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>Hech narsa topilmadi 🔍</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── GRAMMAR PAGE ─────────────────────────────────────────────────
function GrammarPage({ addXP, addAchievement }) {
  const grammar = useMemo(() => grammarData?.length ? grammarData : FALLBACK_GRAMMAR, []);
  const toast = useToast();
  const tts = useTTS();

  const [learnedGrammar, setLearnedGrammar] = useLocalStorage("tm_grammar_learned", []);
  const [favorites, setFavorites] = useLocalStorage("tm_grammar_fav", []);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 280);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const learnedSet = useMemo(() => new Set(learnedGrammar), [learnedGrammar]);
  const favSet = useMemo(() => new Set(favorites), [favorites]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    return grammar.filter(g => {
      const matchQ = !q || g.grammar?.toLowerCase().includes(q) || g.meaningUzbek?.toLowerCase().includes(q) || g.explanation?.toLowerCase().includes(q);
      if (filter === "learned") return matchQ && learnedSet.has(g.id);
      if (filter === "favorites") return matchQ && favSet.has(g.id);
      if (filter === "remaining") return matchQ && !learnedSet.has(g.id);
      return matchQ;
    });
  }, [grammar, debouncedSearch, filter, learnedSet, favSet]);

  const markLearned = useCallback((id) => {
    setLearnedGrammar(prev => {
      const newArr = [...new Set([...prev, id])];
      if (newArr.length === 10) addAchievement("grammar_10");
      if (newArr.length === 50) addAchievement("grammar_50");
      return newArr;
    });
    addXP(10);
    toast("+10 XP — Grammatika o'rganildi! 🧠", "success");
  }, []);

  const toggleFav = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, []);

  const levelColors = { TOPIK1: "#10b981", TOPIK2: "#7c3aed" };
  const pct = Math.round((learnedSet.size / grammar.length) * 100);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>Grammatika Markazi 🧠</h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>{learnedSet.size}/{grammar.length} ta grammatika o'rganildi</p>
        </div>
        <span className="badge badge-purple" style={{ fontSize: 13, padding: "7px 15px" }}>{pct}% tugallandi</span>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 20 }}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Grammatika qidirish..." style={{ flex: 1, minWidth: 200 }} />
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", "learned", "remaining", "favorites"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? "btn-primary" : "btn-ghost"} style={{ padding: "7px 13px", fontSize: 12 }}>
              {f === "all" ? "Hammasi" : f === "learned" ? "✅ O'rganilgan" : f === "remaining" ? "📖 Qolgan" : "❤️ Sevimli"}
            </button>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: 16, alignItems: "start" }}>
        {/* List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(g => (
            <div key={g.id} className="card card-hover" onClick={() => setSelected(selected?.id === g.id ? null : g)}
              style={{ padding: "14px 18px", cursor: "pointer", border: selected?.id === g.id ? "1.5px solid var(--primary)" : "1px solid var(--border2)", transition: "all 0.2s" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6, flexWrap: "wrap" }}>
                    {learnedSet.has(g.id) && <span style={{ color: "#10b981", fontSize: 14 }}>✅</span>}
                    {g.level && (
                      <span className="badge" style={{ background: `${levelColors[g.level] || "#7c3aed"}18`, color: levelColors[g.level] || "#7c3aed", fontSize: 10 }}>{g.level}</span>
                    )}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }} className="kr">{g.grammar}</div>
                  <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>{g.meaningUzbek}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); tts.speak(g.grammar, "ko-KR"); }} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", padding: 4 }}>
                    <Icon name="volume-2" size={15} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); toggleFav(g.id); }} style={{ background: "transparent", border: "none", color: favSet.has(g.id) ? "#ef4444" : "var(--text3)", cursor: "pointer", padding: 4 }}>
                    <Icon name="heart" size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>Hech narsa topilmadi 🔍</div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="card-glow animate-fadein" style={{ padding: 28, position: "sticky", top: 80, maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 className="kr" style={{ fontSize: 22, fontWeight: 900 }}>{selected.grammar}</h3>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => tts.speak(selected.grammar, "ko-KR")} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", padding: 6 }}>
                  <Icon name="volume-2" size={18} />
                </button>
                <button onClick={() => setSelected(null)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text2)", padding: 6 }}>
                  <Icon name="x" size={18} />
                </button>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {selected.level && <span className="badge" style={{ background: `${levelColors[selected.level] || "#7c3aed"}18`, color: levelColors[selected.level] || "#7c3aed" }}>{selected.level}</span>}
              {learnedSet.has(selected.id) && <span className="badge badge-green">✅ O'rganilgan</span>}
            </div>

            {/* Meaning */}
            <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 6, color: "var(--text3)", letterSpacing: 1 }}>MA'NO</div>
              <div style={{ fontWeight: 800, fontSize: 16, color: "var(--primary)" }}>{selected.meaningUzbek}</div>
            </div>

            {/* Explanation */}
            <div style={{ background: "var(--bg3)", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 6, color: "var(--text3)", letterSpacing: 1 }}>TUSHUNTIRISH</div>
              <p style={{ lineHeight: 1.7, color: "var(--text2)", fontSize: 13 }}>{selected.explanation}</p>
            </div>

            {/* Structure */}
            <div style={{ background: "rgba(124,58,237,0.07)", borderRadius: 12, padding: "14px 16px", marginBottom: 14, borderLeft: "3px solid var(--primary)" }}>
              <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 6, color: "var(--primary)", letterSpacing: 1 }}>TUZILMA</div>
              <code style={{ fontSize: 13, fontFamily: "monospace", color: "var(--text)" }}>{selected.structure}</code>
            </div>

            {/* Examples */}
            {selected.examples?.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 10, color: "var(--text3)", letterSpacing: 1 }}>MISOLLAR</div>
                {selected.examples.map((ex, i) => (
                  <div key={i} style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 14px", marginBottom: 8 }}>
                    <div className="kr" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                      🇰🇷 {ex.korean}
                      <button onClick={() => tts.speak(ex.korean, "ko-KR")} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", padding: 2 }}>
                        <Icon name="volume-2" size={13} />
                      </button>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>🇺🇿 {ex.uzbek}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Tips */}
            {selected.usageTips && (
              <div style={{ background: "rgba(16,185,129,0.07)", borderRadius: 12, padding: "14px 16px", marginBottom: 18, borderLeft: "3px solid #10b981" }}>
                <div style={{ fontSize: 10, fontWeight: 800, marginBottom: 6, color: "#10b981", letterSpacing: 1 }}>💡 MASLAHAT</div>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--text2)" }}>{selected.usageTips}</p>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: "flex", gap: 8 }}>
              {!learnedSet.has(selected.id) ? (
                <button className="btn-primary" style={{ flex: 1, padding: 12 }} onClick={() => markLearned(selected.id)}>
                  ✅ O'rgandim (+10 XP)
                </button>
              ) : (
                <div style={{ flex: 1, textAlign: "center", padding: 12, borderRadius: 10, background: "rgba(16,185,129,0.1)", color: "#10b981", fontWeight: 800 }}>
                  ✅ O'rganilgan
                </div>
              )}
              <button onClick={() => toggleFav(selected.id)} className="btn-ghost" style={{ padding: "12px 14px" }}>
                <Icon name="heart" size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QUIZ PAGE ─────────────────────────────────────────────────────
function QuizPage({ addXP, addAchievement }) {
  const vocab = useMemo(() => Array.isArray(vocabularyData) && vocabularyData.length ? vocabularyData : FALLBACK_VOCAB, []);
  const grammar = useMemo(() => Array.isArray(grammarData) && grammarData.length ? grammarData : FALLBACK_GRAMMAR, []);
  const toast = useToast();
  const tts = useTTS();

  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [speedBonus, setSpeedBonus] = useState(false);
  const [history, setHistory] = useLocalStorage("tm_quiz_history", []);
  const [quizCount, setQuizCount] = useLocalStorage("tm_quiz_count", 0);

  const timer = useTimer(30);
  // BUG FIX: selectedRef to avoid stale closure in timer effect
  const selectedRef = useRef(null);
  const showResultRef = useRef(false);

  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5);

  const generateVocabQ = useCallback((count = 10) => {
    const pool = shuffle(vocab.filter(v => v?.id && v?.korean && v?.uzbek)).slice(0, count);
    return pool.map(w => {
      const wrongs = shuffle(vocab.filter(v => v.id !== w.id && v?.uzbek)).slice(0, 3).map(v => v.uzbek);
      return { id: w.id, question: w.korean, correct: w.uzbek, options: shuffle([w.uzbek, ...wrongs]), type: "vocab", pronunciation: w.pronunciation || "" };
    });
  }, [vocab]);

  const generateGrammarQ = useCallback((count = 10) => {
    const pool = shuffle(grammar.filter(g => g?.id && (g?.grammar || g?.structure))).slice(0, count);
    return pool.map(g => {
      const question = g.grammar || g.structure || "Grammatika";
      const correct = g.meaningUzbek || g.meaning || g.explanation || "Ma'no";
      const wrongs = shuffle(grammar.filter(x => x.id !== g.id && (x?.meaningUzbek || x?.meaning))).slice(0, 3).map(x => x.meaningUzbek || x.meaning);
      if (wrongs.length < 3) return null;
      return { id: g.id, question, correct, options: shuffle([correct, ...wrongs]), type: "grammar" };
    }).filter(Boolean);
  }, [grammar]);

  const startQuiz = useCallback((m, questionCount = 10) => {
    setMode(m);
    setQi(0);
    setScore(0);
    setSelected(null);
    selectedRef.current = null;
    showResultRef.current = false;
    setFinished(false);
    setShowResult(false);
    setSpeedBonus(false);
    let qs = [];
    if (m === "vocab") qs = generateVocabQ(questionCount);
    else if (m === "grammar") qs = generateGrammarQ(questionCount);
    else qs = shuffle([...generateVocabQ(7), ...generateGrammarQ(3)]).slice(0, 10);
    setQuestions(qs);
    timer.reset(30);
    timer.start();
  }, [generateVocabQ, generateGrammarQ, timer]);

  // BUG FIX: handleAnswer with useCallback, no stale closure
  const handleAnswer = useCallback((opt, currentQ, currentScore, currentQi, totalQ) => {
    if (selectedRef.current !== null) return;
    selectedRef.current = opt;
    showResultRef.current = true;
    setSelected(opt);
    timer.stop();
    setShowResult(true);

    const isCorrect = opt === currentQ?.correct;
    const isFast = timer.seconds > 20;
    let newScore = currentScore;

    if (isCorrect) {
      newScore = currentScore + 1;
      setScore(newScore);
      if (isFast) { setSpeedBonus(true); addAchievement("speed_demon"); }
    }

    // Auto-advance after 1.8s
    setTimeout(() => {
      if (currentQi + 1 >= totalQ) {
        const pct = Math.round((newScore / totalQ) * 100);
        const xpEarned = pct >= 80 ? 100 : pct >= 60 ? 60 : 30;
        addXP(xpEarned);
        const entry = { mode: mode, score: newScore, total: totalQ, pct, date: new Date().toISOString(), xp: xpEarned }; setHistory(h => [entry, ...h].slice(0, 30));
        setQuizCount(c => {
          const n = c + 1;
          if (n === 1) addAchievement("first_quiz");
          if (n === 10) addAchievement("quiz_10");
          return n;
        });
        if (pct === 100) addAchievement("perfect_quiz");
        toast(`Quiz tugadi! ${pct}% — +${xpEarned} XP 🎉`, pct >= 80 ? "success" : "info");
        setFinished(true);
      } else {
        setQi(i => i + 1);
        setSelected(null);
        selectedRef.current = null;
        showResultRef.current = false;
        setShowResult(false);
        setSpeedBonus(false);
        timer.reset(30);
        timer.start();
      }
    }, 1600);
  }, [timer, mode, addXP, addAchievement]);

  // BUG FIX: use refs in timer effect — no stale closure
  const qiRef = useRef(qi);
  const scoreRef = useRef(score);
  const questionsRef = useRef(questions);
  useEffect(() => { qiRef.current = qi; }, [qi]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { questionsRef.current = questions; }, [questions]);

  useEffect(() => {
    if (timer.seconds === 0 && !showResultRef.current && mode && !finished) {
      const q = questionsRef.current[qiRef.current];
      if (q) handleAnswer("__timeout__", q, scoreRef.current, qiRef.current, questionsRef.current.length);
    }
  }, [timer.seconds]);

  // Mode selection
  const modeCards = [
    { id: "vocab", label: "Lug'at Quiz", emoji: "📚", desc: "1800 so'zdan 10 ta savol", color: "#7c3aed", grad: "var(--grad1)" },
    { id: "grammar", label: "Grammatika Quiz", emoji: "🧠", desc: "150+ grammatikadan 10 ta", color: "#06b6d4", grad: "var(--grad2)" },
    { id: "mixed", label: "Mixed TOPIK", emoji: "⚡", desc: "Aralash format (7+3)", color: "#f59e0b", grad: "var(--grad3)" },
  ];

  if (!mode) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, textAlign: "center" }}>Quiz Markazi 🎯</h1>
        <p style={{ color: "var(--text2)", textAlign: "center", marginBottom: 32, fontSize: 14 }}>Bilimingizni sinab ko'ring!</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))", gap: 18, marginBottom: 36 }}>
          {modeCards.map(m => (
            <div key={m.id} className="card-glow card-hover" style={{ padding: 28, cursor: "pointer" }} onClick={() => startQuiz(m.id)}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>{m.emoji}</div>
              <h3 style={{ fontSize: 19, fontWeight: 900, marginBottom: 8 }}>{m.label}</h3>
              <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 18 }}>{m.desc}</p>
              <button className="btn-primary" style={{ width: "100%", padding: 11 }}>Boshlash →</button>
            </div>
          ))}
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="card" style={{ padding: 22 }}>
            <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>📊 So'nggi quizlar</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 10, background: "var(--bg3)" }}>
                  <span style={{ fontSize: 20 }}>{h.pct >= 80 ? "🏆" : h.pct >= 60 ? "✅" : "📚"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{h.mode === "vocab" ? "Lug'at" : h.mode === "grammar" ? "Grammatika" : "Mixed"}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{new Date(h.date).toLocaleDateString("uz-UZ")}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 900, fontSize: 14, color: h.pct >= 80 ? "#10b981" : h.pct >= 60 ? "#f59e0b" : "#ef4444" }}>{h.pct}%</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{h.score}/{h.total}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪";
    return (
      <div style={{ maxWidth: 520, margin: "56px auto", padding: "0 20px" }}>
        <div className="card-glow animate-scalein" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{emoji}</div>
          <h2 style={{ fontSize: 30, fontWeight: 900, marginBottom: 10 }}>Quiz Tugadi!</h2>
          <div style={{ fontSize: 64, fontWeight: 900, color: pct >= 80 ? "#10b981" : pct >= 60 ? "#f59e0b" : "#ef4444", marginBottom: 8 }}>{pct}%</div>
          <p style={{ color: "var(--text2)", marginBottom: 8 }}>{score} / {questions.length} to'g'ri javob</p>
          {speedBonus && <div className="badge badge-gold" style={{ marginBottom: 16 }}>⚡ Tezlik bonusi!</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
            {[
              { label: "To'g'ri", val: score, color: "#10b981" },
              { label: "Noto'g'ri", val: questions.length - score, color: "#ef4444" },
              { label: "Natija", val: `${pct}%`, color: "var(--primary)" },
            ].map((s, i) => (
              <div key={i} style={{ background: "var(--bg3)", borderRadius: 12, padding: "12px 8px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "12px 24px" }} onClick={() => startQuiz(mode)}>🔄 Qayta urinish</button>
            <button className="btn-ghost" style={{ padding: "12px 24px" }} onClick={() => setMode(null)}>← Menyu</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[qi];
  if (!q) return null;

  const timerPct = (timer.seconds / 30) * 100;
  const timerColor = timer.seconds > 15 ? "#10b981" : timer.seconds > 8 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 20px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span className="badge badge-purple" style={{ fontSize: 13 }}>{qi + 1} / {questions.length}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Timer ring */}
          <div style={{ position: "relative", width: 48, height: 48 }}>
            <svg width={48} height={48} style={{ transform: "rotate(-90deg)" }}>
              <circle cx="24" cy="24" r="20" fill="none" stroke="var(--bg3)" strokeWidth={4} />
              <circle cx="24" cy="24" r="20" fill="none" stroke={timerColor} strokeWidth={4} strokeDasharray={125.6} strokeDashoffset={125.6 * (1 - timerPct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: timerColor }}>{timer.seconds}</div>
          </div>
          <div style={{ fontWeight: 900, color: "#10b981", fontSize: 15 }}>✅ {score}</div>
        </div>
        <button onClick={() => setMode(null)} className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }}>← Chiqish</button>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginBottom: 18 }}>
        <div className="progress-fill" style={{ width: `${(qi / questions.length) * 100}%` }} />
      </div>

      {/* Question card */}
      <div className="card-glow" style={{ padding: 32, marginBottom: 18, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 14 }}>
          <span className={`badge ${q.type === "vocab" ? "badge-purple" : "badge-cyan"}`}>
            {q.type === "vocab" ? "📚 Lug'at" : "🧠 Grammatika"}
          </span>
        </div>
        <div className="kr" style={{ fontSize: "clamp(28px,7vw,56px)", fontWeight: 900, lineHeight: 1.2, marginBottom: 8 }}>{q.question}</div>
        {q.pronunciation && (
          <div style={{ color: "var(--text3)", fontSize: 14, marginBottom: 10 }}>[{q.pronunciation}]</div>
        )}
        {q.type === "vocab" && tts.supported && (
          <button onClick={() => tts.speak(q.question, "ko-KR")} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", padding: 6, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700 }}>
            <Icon name="volume-2" size={16} /> Tinglash
          </button>
        )}
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {q.options?.map((opt, i) => {
          const isCorrect = opt === q.correct;
          const isSelected = opt === selected;
          let bg = "var(--card-s)", color = "var(--text)", border = "var(--border2)";
          if (showResult) {
            if (isCorrect) { bg = "rgba(16,185,129,0.12)"; color = "#10b981"; border = "#10b981"; }
            else if (isSelected && !isCorrect) { bg = "rgba(239,68,68,0.12)"; color = "#ef4444"; border = "#ef4444"; }
          }
          return (
            <button key={i} onClick={() => handleAnswer(opt, q, score, qi, questions.length)}
              disabled={selected !== null}
              style={{ padding: "16px 16px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontWeight: 700, fontSize: 14, textAlign: "left", cursor: selected !== null ? "default" : "pointer", transition: "all 0.2s", lineHeight: 1.4 }}>
              <span style={{ opacity: 0.5, marginRight: 8, fontSize: 12 }}>{["A", "B", "C", "D"][i]}.</span>
              {opt || "Javob yo'q"}
              {showResult && isCorrect && <span style={{ marginLeft: 6 }}>✅</span>}
              {showResult && isSelected && !isCorrect && <span style={{ marginLeft: 6 }}>❌</span>}
            </button>
          );
        })}
      </div>

      {/* Result feedback */}
      {showResult && (
        <div className="animate-fadein" style={{ padding: "12px 16px", borderRadius: 12, background: selected === q.correct ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${selected === q.correct ? "#10b981" : "#ef4444"}30`, textAlign: "center" }}>
          <div style={{ fontWeight: 800, color: selected === q.correct ? "#10b981" : "#ef4444", fontSize: 15 }}>
            {selected === q.correct ? (speedBonus ? "⚡ Tez va to'g'ri! +bonus" : "✅ To'g'ri!") : `❌ Noto'g'ri. To'g'ri: "${q.correct}"`}
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>Avtomatik davom etadi...</div>
        </div>
      )}
    </div>
  );
}

// ─── WRITING PRACTICE PAGE ─────────────────────────────────────────
function PracticePage({ addXP }) {
  const vocab = useMemo(() => vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB, []);
  const toast = useToast();
  const tts = useTTS();

  const [mode, setMode] = useState("typing"); // typing | matching | fillblank
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [shuffled] = useState(() => [...vocab].sort(() => Math.random() - 0.5).slice(0, 20));

  const current = shuffled[currentIdx];

  const checkAnswer = () => {
    if (!current || checked) return;
    const isCorrect = input.trim().toLowerCase() === current.uzbek.toLowerCase() ||
      input.trim() === current.korean;
    setChecked(true);
    if (isCorrect) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      addXP(8);
      toast("✅ To'g'ri! +8 XP", "success");
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      toast(`❌ Noto'g'ri. To'g'risi: "${current.uzbek}"`, "error");
    }
  };

  const next = () => {
    setInput("");
    setChecked(false);
    setCurrentIdx(i => (i + 1) % shuffled.length);
  };

  if (!current) return null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>Yozish Mashqi ✍️</h1>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 24 }}>Koreyscha so'zni ko'rib, o'zbekcha yozing</p>

      {/* Stats */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <div style={{ flex: 1, background: "rgba(16,185,129,0.1)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#10b981" }}>{score.correct}</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>To'g'ri</div>
        </div>
        <div style={{ flex: 1, background: "rgba(239,68,68,0.1)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#ef4444" }}>{score.wrong}</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Noto'g'ri</div>
        </div>
        <div style={{ flex: 1, background: "rgba(124,58,237,0.1)", borderRadius: 12, padding: "12px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 900, color: "var(--primary)" }}>{currentIdx + 1}/{shuffled.length}</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Savol</div>
        </div>
      </div>

      <div className="card-glow" style={{ padding: 36, textAlign: "center" }}>
        {/* Korean word */}
        <div className="kr" style={{ fontSize: 56, fontWeight: 900, marginBottom: 8 }}>{current.korean}</div>
        <div style={{ fontSize: 14, color: "var(--text3)", marginBottom: 8 }}>[{current.pronunciation}]</div>
        <button onClick={() => tts.speak(current.korean, "ko-KR")} style={{ background: "transparent", border: "none", color: "var(--accent)", cursor: "pointer", padding: 6, marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, fontSize: 13 }}>
          <Icon name="volume-2" size={16} /> Tinglash
        </button>

        {/* Input */}
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") checked ? next() : checkAnswer(); }}
            placeholder="O'zbekcha tarjimasini yozing..."
            disabled={checked}
            style={{
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
              background: checked ? (input.trim().toLowerCase() === current.uzbek.toLowerCase() ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)") : "var(--bg3)",
              borderColor: checked ? (input.trim().toLowerCase() === current.uzbek.toLowerCase() ? "#10b981" : "#ef4444") : "var(--border2)",
            }}
          />
        </div>

        {checked && (
          <div className="animate-fadein" style={{ marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "var(--bg3)", fontSize: 14 }}>
            <span style={{ color: "var(--text3)" }}>To'g'ri javob: </span>
            <strong style={{ color: "var(--primary)" }}>{current.uzbek}</strong>
            {current.category && <span className="badge badge-cyan" style={{ marginLeft: 8 }}>{current.category}</span>}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          {!checked ? (
            <button className="btn-primary" style={{ padding: "12px 28px" }} onClick={checkAnswer}>
              ✅ Tekshirish (Enter)
            </button>
          ) : (
            <button className="btn-primary" style={{ padding: "12px 28px" }} onClick={next}>
              Keyingi → (Enter)
            </button>
          )}
          <button className="btn-ghost" style={{ padding: "12px 16px" }} onClick={next}>O'tkazib yuborish</button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────────
function DashboardPage({ xp, streak, achievementIds, addXP }) {
  const vocab = useMemo(() => vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB, []);
  const grammar = useMemo(() => grammarData?.length ? grammarData : FALLBACK_GRAMMAR, []);
  const [learnedIds] = useLocalStorage("tm_learned", []);
  const [learnedGrammar] = useLocalStorage("tm_grammar_learned", []);
  const [quizHistory] = useLocalStorage("tm_quiz_history", []);
  const [ttsCount] = useLocalStorage("tm_tts_count", 0);

  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
  const rank = RANKS.filter(r => xp >= r.min).pop();
  const nextRank = RANKS.find(r => xp < r.min);
  const rankPct = nextRank ? Math.round(((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100;
  const avgScore = quizHistory.length > 0 ? Math.round(quizHistory.reduce((a, b) => a + b.pct, 0) / quizHistory.length) : 0;
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length];

  // Stable weekly data (seeded by day)
  const weekData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const dayLabels = ["Yak", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];
      const seed = d.getDate() + d.getMonth() * 31;
      const value = (seed * 17 + 13) % 40 + 5;
      return { day: dayLabels[d.getDay()], value };
    });
  }, []);
  const maxWeek = Math.max(...weekData.map(d => d.value));

  const rings = [
    { label: "Lug'at", current: learnedSet.size, total: vocab.length, color: "#7c3aed" },
    { label: "Grammatika", current: learnedGrammar.length, total: grammar.length, color: "#06b6d4" },
    { label: "Quiz o'rt.", current: avgScore, total: 100, color: "#10b981", suffix: "%" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Dashboard 📊</h1>
        <div style={{ fontSize: 14, color: "var(--text2)", fontStyle: "italic" }} className="kr">"{quote.text}" — {quote.author}</div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Jami XP", val: xp.toLocaleString(), icon: "zap", color: "#7c3aed", suffix: "XP" },
          { label: "Kun seriyasi", val: streak, icon: "flame", color: "#f59e0b", suffix: "kun" },
          { label: "So'z yodlandi", val: learnedSet.size, icon: "book", color: "#06b6d4" },
          { label: "Grammatika", val: learnedGrammar.length, icon: "brain", color: "#10b981" },
          { label: "Quiz o'yindi", val: quizHistory.length, icon: "target", color: "#ec4899" },
          { label: "TTS foydalanish", val: ttsCount, icon: "volume-2", color: "#f97316" },
        ].map((s, i) => (
          <div key={i} className="card card-hover" style={{ padding: "16px 14px", transition: "all 0.25s" }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color, marginBottom: 10 }}>
              <Icon name={s.icon} size={17} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.val}{s.suffix ? ` ${s.suffix}` : ""}</div>
            <div style={{ fontSize: 12, color: "var(--text3)", fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 20 }}>
        {/* Rank */}
        <div className="card-glow" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>🏆 Daraja Tizimi</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 48 }}>{rank.emoji}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 20, color: rank.color }}>{rank.name}</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{xp.toLocaleString()} XP</div>
            </div>
          </div>
          {nextRank && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12, color: "var(--text3)" }}>
                <span>→ {nextRank.name}</span>
                <span>{(nextRank.min - xp).toLocaleString()} XP qoldi</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${rankPct}%`, background: `linear-gradient(90deg, ${rank.color}, ${nextRank.color})` }} />
              </div>
            </>
          )}
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {RANKS.map((r, i) => (
              <div key={i} title={r.name} style={{ fontSize: 20, opacity: xp >= r.min ? 1 : 0.25, filter: xp >= r.min ? "none" : "grayscale(1)" }}>{r.emoji}</div>
            ))}
          </div>
        </div>

        {/* Weekly chart */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>📈 Haftalik faollik</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 90 }}>
            {weekData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: "var(--grad1)", height: `${(d.value / maxWeek) * 72}px`, minHeight: 4, transition: "height 0.5s ease", opacity: i === 6 ? 1 : 0.6 }} />
                <div style={{ fontSize: 9, color: "var(--text3)", fontWeight: 700 }}>{d.day}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress rings */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 14, marginBottom: 20 }}>
        {rings.map((r, i) => {
          const pct = Math.min(100, Math.round((r.current / r.total) * 100));
          const radius = 38, circ = 2 * Math.PI * radius;
          return (
            <div key={i} className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <svg width={92} height={92} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
                <circle cx="46" cy="46" r={radius} fill="none" stroke="var(--bg3)" strokeWidth={7} />
                <circle cx="46" cy="46" r={radius} fill="none" stroke={r.color} strokeWidth={7} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
              </svg>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: r.color }}>{pct}{r.suffix || "%"}</div>
                <div style={{ fontWeight: 800, fontSize: 13 }}>{r.label}</div>
                <div style={{ fontSize: 12, color: "var(--text3)" }}>{r.current} / {r.total}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements */}
      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>🏅 Yutuqlar — {achievementIds.length}/{ACHIEVEMENTS.length} ta</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px,1fr))", gap: 8 }}>
          {ACHIEVEMENTS.map(a => {
            const earned = achievementIds.includes(a.id);
            return (
              <div key={a.id} style={{ display: "flex", gap: 10, padding: "11px 13px", borderRadius: 12, background: earned ? "rgba(124,58,237,0.08)" : "var(--bg3)", border: `1px solid ${earned ? "rgba(124,58,237,0.25)" : "transparent"}`, opacity: earned ? 1 : 0.45, transition: "all 0.3s" }}>
                <div style={{ fontSize: 26, flexShrink: 0 }}>{a.emoji}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 13 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 3 }}>{a.desc}</div>
                  {earned && <span className="badge badge-purple" style={{ fontSize: 10 }}>+{a.xp} XP</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR PAGE ─────────────────────────────────────────────────
function CalendarPage() {
  const [studyDays] = useLocalStorage("tm_study_days", {});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const months = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"];
  const todayKey = dateKey(now);

  // BUG FIX: correct firstDay (Monday=0)
  const firstDayRaw = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
  const firstDay = firstDayRaw === 0 ? 6 : firstDayRaw - 1; // Mon-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Heatmap — stable (no random)
  const heatmapDays = useMemo(() => Array.from({ length: 84 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (83 - i));
    const key = dateKey(d);
    const intensity = Math.min(studyDays[key] || 0, 4);
    return { key, intensity, d };
  }), [studyDays]);

  const intensityColors = [
    "var(--bg3)",
    "rgba(124,58,237,0.25)",
    "rgba(124,58,237,0.45)",
    "rgba(124,58,237,0.65)",
    "rgba(124,58,237,0.9)",
  ];

  const totalStudyDays = Object.values(studyDays).filter(v => v > 0).length;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 20px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>O'quv Kalendari 📅</h1>
      <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>Izchilligingizni kuzating</p>

      {/* Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 22 }}>
        {[
          { label: "Jami o'quv kunlari", val: totalStudyDays, icon: "calendar", color: "#7c3aed" },
          { label: "Bu oy", val: Object.keys(studyDays).filter(k => k.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)).length, icon: "trending-up", color: "#06b6d4" },
          { label: "Bugun", val: studyDays[todayKey] ? "✅" : "—", icon: "check-circle", color: "#10b981" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: "16px 14px" }}>
            <div style={{ color: s.color, marginBottom: 8 }}><Icon name={s.icon} size={20} /></div>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="card-glow" style={{ padding: 24, marginBottom: 22 }}>
        <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 16 }}>🔥 Faollik xaritasi (so'nggi 12 hafta)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 4 }}>
          {Array.from({ length: 12 }, (_, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {heatmapDays.slice(wi * 7, wi * 7 + 7).map((d, di) => (
                <div key={di} title={`${d.d.toLocaleDateString("uz-UZ")} — ${d.intensity} sessiya`}
                  style={{ width: "100%", paddingBottom: "100%", borderRadius: 3, background: intensityColors[d.intensity], cursor: "default", transition: "all 0.2s" }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14 }}>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Kam</span>
          {intensityColors.map((c, i) => <div key={i} style={{ width: 13, height: 13, borderRadius: 2, background: c, border: "1px solid var(--border2)" }} />)}
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
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = key === todayKey;
            const hasStudy = (studyDays[key] || 0) > 0;
            return (
              <div key={day} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 8, background: isToday ? "var(--primary)" : hasStudy ? "rgba(124,58,237,0.12)" : "transparent", color: isToday ? "#fff" : hasStudy ? "var(--primary)" : "var(--text2)", fontWeight: isToday ? 900 : 600, fontSize: 13 }}>
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

// ─── PROGRESS PAGE ─────────────────────────────────────────────────
function ProgressPage({ xp, streak }) {
  const vocab = useMemo(() => vocabularyData?.length ? vocabularyData : FALLBACK_VOCAB, []);
  const grammar = useMemo(() => grammarData?.length ? grammarData : FALLBACK_GRAMMAR, []);
  const [learnedIds] = useLocalStorage("tm_learned", []);
  const [learnedGrammar] = useLocalStorage("tm_grammar_learned", []);
  const [hardIds] = useLocalStorage("tm_hard", []);
  const [favoriteIds] = useLocalStorage("tm_favorites", []);
  const [quizHistory] = useLocalStorage("tm_quiz_history", []);
  const [plan] = useLocalStorage("tm_plan", 30);

  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
  const avgScore = quizHistory.length > 0 ? Math.round(quizHistory.reduce((a, b) => a + b.pct, 0) / quizHistory.length) : 0;
  const topikReadiness = Math.round(
    (learnedSet.size / vocab.length) * 0.4 +
    (learnedGrammar.length / grammar.length) * 0.3 +
    (avgScore / 100) * 0.3
  ) * 100;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>Progress Hisoboti 📈</h1>
      <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }}>Sizning o'sish ko'rsatkichlari</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(185px,1fr))", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Yodlangan so'zlar", val: learnedSet.size, total: vocab.length, color: "#7c3aed", icon: "book" },
          { label: "Grammatika", val: learnedGrammar.length, total: grammar.length, color: "#06b6d4", icon: "brain" },
          { label: "Qiyin so'zlar", val: hardIds.length, total: vocab.length, color: "#ef4444", icon: "alert-circle" },
          { label: "Sevimlilar", val: favoriteIds.length, total: vocab.length, color: "#ec4899", icon: "heart" },
          { label: "Quiz o'rtacha", val: avgScore + "%", color: "#10b981", icon: "target" },
          { label: "Streak", val: streak + " kun", color: "#f59e0b", icon: "flame" },
        ].map((s, i) => (
          <div key={i} className="card card-hover" style={{ padding: 18, transition: "all 0.25s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ color: s.color }}><Icon name={s.icon} size={18} /></div>
              <span style={{ fontSize: 12, color: "var(--text2)", fontWeight: 700 }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, marginBottom: s.total ? 6 : 0 }}>{s.val}</div>
            {s.total && (
              <>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 5 }}>/ {s.total}</div>
                <div className="progress-bar" style={{ height: 5 }}>
                  <div className="progress-fill" style={{ width: `${(typeof s.val === "number" ? (s.val / s.total) * 100 : 0)}%`, background: s.color }} />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* TOPIK Readiness */}
      <div className="card-glow" style={{ padding: 26, marginBottom: 22 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 20 }}>🎯 TOPIK 1 Tayyorlik Darajasi</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
          {[
            { label: "Leksika (40%)", val: Math.round((learnedSet.size / vocab.length) * 100), color: "#7c3aed" },
            { label: "Grammatika (30%)", val: Math.round((learnedGrammar.length / grammar.length) * 100), color: "#06b6d4" },
            { label: "Quiz tayyorligi (30%)", val: avgScore, color: "#10b981" },
          ].map((r, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: r.val >= 80 ? "#10b981" : r.val >= 50 ? "#f59e0b" : "#ef4444" }}>{r.val}%</span>
              </div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${r.val}%`, background: r.color }} /></div>
            </div>
          ))}
        </div>
        <div style={{ padding: "20px", borderRadius: 14, background: "var(--bg3)", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>Umumiy TOPIK 1 tayyorlik</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: topikReadiness >= 80 ? "#10b981" : topikReadiness >= 50 ? "#f59e0b" : "var(--primary)" }}>
            {topikReadiness}%
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 4 }}>
            {topikReadiness >= 80 ? "🏆 TOPIK 1 ga tayyorsiz!" : topikReadiness >= 50 ? "💪 Yaxshi natija, davom eting!" : "📚 Ko'proq o'rganish kerak"}
          </div>
        </div>
      </div>

      {/* Quiz history */}
      {quizHistory.length > 0 && (
        <div className="card" style={{ padding: 22 }}>
          <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 14 }}>📊 Quiz tarixi (so'nggi 10 ta)</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {quizHistory.slice(0, 10).map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 10, background: "var(--bg3)" }}>
                <span style={{ fontSize: 18 }}>{h.pct >= 80 ? "🏆" : h.pct >= 60 ? "✅" : "📚"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{h.mode === "vocab" ? "Lug'at" : h.mode === "grammar" ? "Grammatika" : "Mixed"}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{new Date(h.date).toLocaleDateString("uz-UZ")}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="badge badge-purple" style={{ fontSize: 10 }}>+{h.xp} XP</span>
                  <span style={{ fontWeight: 900, fontSize: 14, color: h.pct >= 80 ? "#10b981" : h.pct >= 60 ? "#f59e0b" : "#ef4444" }}>{h.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── POMODORO WIDGET ────────────────────────────────────────────────
function PomodoroWidget() {
  const [mins, setMins] = useState(25);
  const [phase, setPhase] = useState("work");
  const [sessions, setSessions] = useState(0);
  const timer = useTimer(mins * 60);
  const toast = useToast();

  const m = Math.floor(timer.seconds / 60);
  const s = timer.seconds % 60;
  const total = (phase === "work" ? mins : 5) * 60;
  const pct = (1 - timer.seconds / total) * 100;
  const circ = 2 * Math.PI * 42;

  useEffect(() => {
    if (timer.seconds === 0 && timer.running === false && sessions > 0) return; // don't fire on init
    if (timer.seconds === 0 && !timer.running) {
      if (phase === "work") {
        setSessions(n => n + 1);
        setPhase("break");
        timer.reset(5 * 60);
        toast("🍅 Sessiya tugadi! Dam oling.", "success");
      } else {
        setPhase("work");
        timer.reset(mins * 60);
        toast("💪 Dam olish tugadi! Davom eting.", "info");
      }
    }
  }, [timer.seconds, timer.running]);

  return (
    <div className="card-glow glass" style={{ padding: 20, textAlign: "center" }}>
      <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 12 }}>🍅 Pomodoro</div>
      <svg width={104} height={104} style={{ transform: "rotate(-90deg)", display: "block", margin: "0 auto 8px" }}>
        <circle cx="52" cy="52" r="42" fill="none" stroke="var(--bg3)" strokeWidth={6} />
        <circle cx="52" cy="52" r="42" fill="none" stroke={phase === "work" ? "var(--primary)" : "#10b981"} strokeWidth={6} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
      <div className={`badge ${phase === "work" ? "badge-purple" : "badge-green"}`} style={{ marginBottom: 12 }}>
        {phase === "work" ? "🧠 Ishlash" : "😴 Dam olish"}
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 10 }}>
        <button onClick={() => timer.running ? timer.stop() : timer.start()} className="btn-primary" style={{ padding: "7px 14px", fontSize: 12 }}>
          {timer.running ? "⏸ To'xtat" : "▶ Boshlash"}
        </button>
        <button onClick={() => { timer.stop(); setPhase("work"); timer.reset(mins * 60); }} className="btn-ghost" style={{ padding: "7px 10px" }}>
          <Icon name="refresh-cw" size={14} />
        </button>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 8 }}>
        {[15, 25, 50].map(m2 => (
          <button key={m2} onClick={() => { setMins(m2); timer.reset(m2 * 60); timer.stop(); }} style={{ padding: "3px 8px", borderRadius: 12, border: `1px solid ${mins === m2 ? "var(--primary)" : "var(--border2)"}`, background: "transparent", color: mins === m2 ? "var(--primary)" : "var(--text3)", fontSize: 11, fontWeight: 700 }}>{m2}d</button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: "var(--text3)" }}>Sessiyalar: <strong>{sessions}</strong></div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useLocalStorage("tm_dark", false);
  const [page, setPage] = useState("home");
  const [xp, setXp] = useLocalStorage("tm_xp", 0);
  const [streak, setStreak] = useLocalStorage("tm_streak", 0);
  const [achievementIds, setAchievementIds] = useLocalStorage("tm_achievements", []);
  const [studyDays, setStudyDays] = useLocalStorage("tm_study_days", {});
  // BUG FIX: streak only set once per day
  const [lastStudyDate, setLastStudyDate] = useLocalStorage("tm_last_study_date", null);

  useEffect(() => {
    const today = dateKey();
    if (lastStudyDate === today) return; // already tracked today

    setStudyDays(d => ({ ...d, [today]: (d[today] || 0) + 1 }));
    setLastStudyDate(today);

    // BUG FIX: streak logic correct
    const yesterday = getYesterdayKey();
    setStreak(s => {
      if (lastStudyDate === yesterday) return s + 1; // consecutive
      if (lastStudyDate === null) return 1; // first time
      return 1; // streak reset
    });
  }, []); // only on mount

  const addXP = useCallback((amount) => {
    setXp(x => x + amount);
  }, []);

  const addAchievement = useCallback((id) => {
    setAchievementIds(prev => {
      if (prev.includes(id)) return prev;
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) setXp(x => x + ach.xp);
      return [...prev, id];
    });
  }, []);

  // Achievement auto-checks
  const [learnedIds] = useLocalStorage("tm_learned", []);
  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
  useEffect(() => {
    if (learnedSet.size >= 1) addAchievement("first_word");
    if (learnedSet.size >= 10) addAchievement("ten_words");
    if (learnedSet.size >= 50) addAchievement("fifty_words");
    if (learnedSet.size >= 100) addAchievement("hundred_words");
  }, [learnedSet.size]);
  useEffect(() => {
    if (streak >= 3) addAchievement("streak_3");
    if (streak >= 7) addAchievement("streak_7");
    if (streak >= 30) addAchievement("streak_30");
  }, [streak]);

  const user = { avatar: "🧑‍💻" };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage setPage={setPage} xp={xp} streak={streak} />;
      case "vocab": return <VocabPage addXP={addXP} addAchievement={addAchievement} />;
      case "grammar": return <GrammarPage addXP={addXP} addAchievement={addAchievement} />;
      case "quiz": return <QuizPage addXP={addXP} addAchievement={addAchievement} />;
      case "practice": return <PracticePage addXP={addXP} />;
      case "dashboard": return <DashboardPage xp={xp} streak={streak} achievementIds={achievementIds} addXP={addXP} />;
      case "progress": return <ProgressPage xp={xp} streak={streak} />;
      case "calendar": return <CalendarPage />;
      default: return <HomePage setPage={setPage} xp={xp} streak={streak} />;
    }
  };

  return (
    <ToastProvider>
      <GlobalStyle dark={dark} />
      <Header dark={dark} setDark={setDark} page={page} setPage={setPage} xp={xp} streak={streak} user={user} />

      {/* Pomodoro floating widget on dashboard */}
      {page === "dashboard" && (
        <div style={{ position: "fixed", bottom: 24, right: 24, width: 230, zIndex: 500 }}>
          <PomodoroWidget />
        </div>
      )}

      <main style={{ minHeight: "calc(100vh - 62px)", paddingBottom: 80 }}>
        {renderPage()}
      </main>

      {/* Mobile bottom nav */}
      <nav className="show-mobile-only" style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 900, background: dark ? "rgba(12,12,18,0.96)" : "rgba(255,255,255,0.96)", backdropFilter: "blur(20px)", borderTop: "1px solid var(--border)", display: "flex", padding: "6px 0 4px" }}>
        {[
          { id: "home", icon: "home", label: "Bosh" },
          { id: "vocab", icon: "book", label: "Lug'at" },
          { id: "grammar", icon: "brain", label: "Gramm." },
          { id: "quiz", icon: "target", label: "Quiz" },
          { id: "dashboard", icon: "bar-chart", label: "Dash" },
          { id: "practice", icon: "pen-tool", label: "Mashq" },
        ].map(n => (
          <button key={n.id} onClick={() => setPage(n.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 0", border: "none", background: "transparent", color: page === n.id ? "var(--primary)" : "var(--text3)", cursor: "pointer", transition: "all 0.2s" }}>
            <Icon name={n.icon} size={19} />
            <span style={{ fontSize: 9, fontWeight: 800, fontFamily: "var(--font)" }}>{n.label}</span>
          </button>
        ))}
      </nav>
    </ToastProvider>
  );
}