import "./RecentCalls.css";
import { useMemo } from "react";
import { formatDateGroupHeader, formatTime } from "../../utils/formatters.js";
import EmptyState from "../EmptyState/EmptyState.jsx";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader.jsx";

function Participants() {
  return (
    <div className="rc-participants" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, idx) => (
        <span key={idx} className="rc-person" style={{ left: `${idx * 10}px` }}>
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="9" r="4" fill="currentColor" />
            <path d="M4 21c1.8-4 5-6 8-6s6.2 2 8 6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      ))}
    </div>
  );
}

function Kebab() {
  return (
    <span className="rc-kebab" aria-hidden="true">
      <span className="rc-dot" />
      <span className="rc-dot" />
      <span className="rc-dot" />
    </span>
  );
}

function groupByDate(sessions) {
  const map = new Map();
  sessions.forEach((s) => {
    const key = formatDateGroupHeader(s.started_at);
    if (!key) return;
    map.set(key, [...(map.get(key) || []), s]);
  });
  return Array.from(map.entries());
}

export default function RecentCalls({ sessions, loading, error, onRetry }) {
  const grouped = useMemo(() => groupByDate(sessions || []), [sessions]);
  const isEmpty = !loading && !error && (!sessions || sessions.length === 0);

  return (
    <section className="rc">
      <div className="rc-title">Recent calls</div>

      {error ? (
        <div className="rc-error card">
          <div className="rc-error-title">Something went wrong.</div>
          <div className="rc-error-sub">{error.message}</div>
          <button type="button" className="btn btn-outline" onClick={onRetry}>
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="rc-card card">
          <div className="rc-skel">
            <SkeletonLoader className="rc-skel-row" />
            <SkeletonLoader className="rc-skel-row" />
            <SkeletonLoader className="rc-skel-row" />
            <SkeletonLoader className="rc-skel-row" />
          </div>
        </div>
      ) : null}

      {isEmpty ? (
        <div className="rc-card">
          <EmptyState />
        </div>
      ) : null}

      {!loading && !error && sessions && sessions.length > 0 ? (
        <div className="rc-list-wrap">
          {grouped.map(([header, items]) => (
            <div key={header} className="rc-group">
              <div className="rc-group-title">{header}</div>
              <div className="rc-rows">
                {items.map((s) => {
                  const id = s._id || s.id;
                  const title = s.description || s.title || "Call";
                  const client = s.client || "";
                  const letter = (client || title || "C").trim().slice(0, 1).toUpperCase();
                  return (
                    <div key={id} className="rc-row">
                      <div className="rc-left">
                        <div className="rc-avatar">{letter}</div>
                        <div className="rc-text">
                          <div className="rc-name">{title}</div>
                          <Participants />
                        </div>
                      </div>
                      <div className="rc-right">
                        <div className="rc-time">{formatTime(s.started_at)}</div>
                        <Kebab />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
