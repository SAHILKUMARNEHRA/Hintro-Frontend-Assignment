import { useEffect, useState } from "react";
import "./LogoutModal.css";

export default function LogoutModal({ open, onClose, onLogout }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) setVisible(true);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (!open) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open && !visible) return null;

  return (
    <div
      className={`logout-backdrop ${open ? "is-open" : "is-closed"}`}
      onClick={() => onClose?.()}
      role="presentation"
    >
      <div
        className={`logout-modal ${open ? "is-open" : "is-closed"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Logout confirmation"
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => {
          if (!open) setVisible(false);
        }}
      >
        <div className="logout-title">Leaving already?</div>
        <div className="logout-divider" />
        <div className="logout-body">You can log back in anytime to continue your meetings with Hintro.</div>
        <div className="logout-actions">
          <button type="button" className="btn btn-outline logout-cancel" onClick={() => onClose?.()}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary logout-confirm" onClick={() => onLogout?.()}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

