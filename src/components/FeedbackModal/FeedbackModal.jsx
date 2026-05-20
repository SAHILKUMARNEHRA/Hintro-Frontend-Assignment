import { useEffect, useMemo, useState } from "react";
import "./FeedbackModal.css";
import { addFeedbackEntry } from "../../utils/storage.js";

function Star({ filled, hovered, onClick, onEnter, onLeave }) {
  const color = filled || hovered ? "var(--color-star)" : "var(--color-border)";
  return (
    <button type="button" className="fb-star" onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M12 17.3l-5.2 3.1 1.4-5.9-4.6-4 6-.5L12 4.5l2.4 5.5 6 .5-4.6 4 1.4 5.9L12 17.3Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
        />
      </svg>
    </button>
  );
}

export default function FeedbackModal({ open, onClose }) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (open) {
      setVisible(true);
      setStep(1);
      setRating(0);
      setHover(0);
      setMessage("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (step !== 3) return;
    const t = window.setTimeout(() => onClose?.(), 2000);
    return () => window.clearTimeout(t);
  }, [open, step, onClose]);

  const title = useMemo(() => {
    if (step === 1) return "How would you rate your experience?";
    if (step === 2) return "Tell us more...";
    return "Thanks for your feedback! 🎉";
  }, [step]);

  if (!open && !visible) return null;

  return (
    <div className={`fb-backdrop ${open ? "is-open" : "is-closed"}`} onClick={() => onClose?.()} role="presentation">
      <div
        className={`fb-modal ${open ? "is-open" : "is-closed"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Feedback"
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => {
          if (!open) setVisible(false);
        }}
      >
        <div className="fb-title">{title}</div>
        <div className="fb-divider" />

        {step === 1 ? (
          <div className="fb-step">
            <div className="fb-stars" role="group" aria-label="Rating">
              {Array.from({ length: 5 }).map((_, idx) => {
                const value = idx + 1;
                return (
                  <Star
                    key={value}
                    filled={value <= rating}
                    hovered={value <= hover}
                    onEnter={() => setHover(value)}
                    onLeave={() => setHover(0)}
                    onClick={() => {
                      setRating(value);
                      setStep(2);
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="fb-step">
            <textarea
              className="fb-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us more..."
              rows={4}
            />
            <div className="fb-actions">
              <button
                type="button"
                className="btn btn-primary fb-submit"
                onClick={() => {
                  addFeedbackEntry({ rating, message, timestamp: new Date().toISOString() });
                  setStep(3);
                }}
                disabled={rating === 0}
              >
                Submit
              </button>
              <button type="button" className="fb-skip" onClick={() => onClose?.()}>
                Skip
              </button>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="fb-step">
            <div className="fb-success">Your feedback has been saved.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
