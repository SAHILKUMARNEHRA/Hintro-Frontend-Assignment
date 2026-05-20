import { useEffect, useMemo, useState } from "react";
import "./FeedbackHistoryModal.css";
import { getFeedbackList } from "../../utils/storage.js";

function StarRow({ rating }) {
  return (
    <div className="fb-h-stars" aria-label={`${rating} stars`}>
      {Array.from({ length: 5 }).map((_, idx) => {
        const active = idx + 1 <= rating;
        return (
          <span key={idx} className={`fb-h-star ${active ? "is-active" : ""}`} aria-hidden="true">
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function FeedbackHistoryModal({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const list = useMemo(() => (open ? getFeedbackList() : []), [open]);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open && !visible) return null;

  return (
    <div className={`fb-h-backdrop ${open ? "is-open" : "is-closed"}`} onClick={() => onClose?.()} role="presentation">
      <div
        className={`fb-h-modal ${open ? "is-open" : "is-closed"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Feedback history"
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => {
          if (!open) setVisible(false);
        }}
      >
        <div className="fb-h-title">Feedback History</div>
        <div className="fb-h-divider" />

        {list.length === 0 ? (
          <div className="fb-h-empty">No feedback submitted yet.</div>
        ) : (
          <div className="fb-h-list">
            {list.map((item, idx) => {
              const date = item?.timestamp ? new Date(item.timestamp) : null;
              const dateText = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-US") : "";
              return (
                <div key={`${item.timestamp || "t"}-${idx}`} className="fb-h-item">
                  <StarRow rating={Number(item.rating) || 0} />
                  {item?.message ? <div className="fb-h-message">{item.message}</div> : null}
                  {dateText ? <div className="fb-h-date">{dateText}</div> : null}
                </div>
              );
            })}
          </div>
        )}

        <div className="fb-h-actions">
          <button type="button" className="btn btn-outline" onClick={() => onClose?.()}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

