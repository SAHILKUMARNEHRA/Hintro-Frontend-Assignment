import { useEffect, useMemo, useState } from "react";
import "./StatCard.css";
import { formatDuration } from "../../utils/formatters.js";

function useCountUp(to, durationMs, enabled) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, durationMs, enabled]);

  return value;
}

function Icon({ kind }) {
  if (kind === "sessions") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 12V3a9 9 0 1 1-9 9h9Z" fill="currentColor" opacity="0.2" />
        <path d="M12 12V3a9 9 0 0 1 9 9h-9Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 12H3a9 9 0 1 0 9-9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (kind === "duration") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v6l4 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === "ai") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 2l1.2 4.1L17.3 8l-4.1 1.2L12 13.3l-1.2-4.1L6.7 8l4.1-1.9L12 2Z"
          fill="currentColor"
          opacity="0.25"
        />
        <path
          d="M18.5 10.5l.8 2.6 2.7.9-2.7.8-.8 2.7-.9-2.7-2.6-.8 2.6-.9.9-2.6Z"
          fill="currentColor"
          opacity="0.35"
        />
        <path
          d="M6.2 12.6l.7 2.2 2.3.8-2.3.7-.7 2.3-.8-2.3-2.2-.7 2.2-.8.8-2.2Z"
          fill="currentColor"
          opacity="0.35"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 2v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 2v4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10h18" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function StatCard({ label, value, iconKind, iconBg, delayMs = 0 }) {
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const animated = useCountUp(isNumber ? value : 0, 800, isNumber);

  const displayValue = useMemo(() => {
    if (label === "Average Duration") return formatDuration(Math.round(animated));
    if (label === "AI Used") return `${Math.round(animated)} times`;
    if (label === "Total Sessions") return `${Math.round(animated)}`;
    return typeof value === "string" ? value : "-";
  }, [animated, label, value]);

  return (
    <div className="stat-card" style={{ animationDelay: `${delayMs}ms` }}>
      <div className={`stat-icon ${iconBg}`}>
        <Icon kind={iconKind} />
      </div>
      <div className="stat-meta">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{displayValue}</div>
      </div>
    </div>
  );
}
