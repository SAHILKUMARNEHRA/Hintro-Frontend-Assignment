import { NavLink } from "react-router-dom";
import { useMemo, useState } from "react";
import "./Sidebar.css";
import FeedbackModal from "../FeedbackModal/FeedbackModal.jsx";
import FeedbackHistoryModal from "../FeedbackModal/FeedbackHistoryModal.jsx";
import { useApi } from "../../hooks/useApi.js";
import { useUser } from "../../context/UserContext.jsx";

function InfoBadge() {
  return <span className="sidebar-info">ⓘ</span>;
}

function Icon({ name, active }) {
  const stroke = active ? "var(--color-accent)" : "var(--color-text-secondary)";
  const fill = active ? "var(--color-accent)" : "none";

  if (name === "grid") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h7v7H4V4Z" fill={active ? fill : "none"} stroke={stroke} strokeWidth="2" />
        <path d="M13 4h7v7h-7V4Z" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M4 13h7v7H4v-7Z" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M13 13h7v7h-7v-7Z" fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (name === "phone") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M6.6 10.8c1.6 3.1 3.5 5 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.9.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C11.9 21 3 12.1 3 1.6c0-.6.4-1 1-1H7c.6 0 1 .4 1 1 0 1.4.2 2.7.6 3.9.1.4 0 .8-.3 1.1l-2.3 2.2Z"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (name === "doc") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 3h7l3 3v15a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M14 3v4a2 2 0 0 0 2 2h4" fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (name === "chat") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H9l-4 3V7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8Z" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "globe") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M3 12h18" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M12 3c2.5 2.9 3.8 5.8 3.8 9S14.5 18.1 12 21c-2.5-2.9-3.8-5.8-3.8-9S9.5 5.9 12 3Z" fill="none" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  }

  if (name === "inbox") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v16H4V4Z" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M4 14h5l1.6 2h2.8L15 14h5" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  if (name === "gift") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V11Z" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M4 7h16v4H4V7Z" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M12 7v16" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M12 7c-1.8 0-3-1-3-2.3S10 2.5 11.7 3.1c1 .3 1.9 1.3 2.3 2.3.4-1 1.3-2 2.3-2.3 1.7-.6 2.7.3 2.7 1.6S19.8 7 18 7" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  }

  return null;
}

function NavItem({ to, label, icon, showInfo, onNavigate }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `sidebar-item ${isActive ? "is-active" : ""}`}
      onClick={() => onNavigate?.()}
      end={to === "/"}
    >
      {({ isActive }) => (
        <>
          <span className="sidebar-icon">
            <Icon name={icon} active={isActive} />
          </span>
          <span className="sidebar-label">{label}</span>
          {showInfo ? <InfoBadge /> : null}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ mobileOpen, onCloseMobile }) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { userId, setUserId } = useUser();
  const { data: usageData } = useApi("/api/auth/dashboard");

  const usageText = useMemo(() => {
    const used = usageData?.usage?.kb_files?.used;
    const safeUsed = Number.isFinite(used) ? used : 0;
    return `${safeUsed} of 1000 hours used`;
  }, [usageData]);

  return (
    <>
      <div className={`sidebar-overlay ${mobileOpen ? "is-open" : ""}`} onClick={onCloseMobile} />
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`} aria-label="Sidebar">
        <div className="sidebar-top">
          <div className="sidebar-mobile-close">
            <button type="button" className="sidebar-close-btn" onClick={onCloseMobile} aria-label="Close menu">
              ×
            </button>
          </div>
          <div className="sidebar-logo">Hintro</div>
          <div className="sidebar-user-switch" role="group" aria-label="User switch">
            <button
              type="button"
              className={`sidebar-user-pill ${userId === "u1" ? "is-active" : ""}`}
              onClick={() => {
                setUserId("u1");
                onCloseMobile?.();
              }}
            >
              u1
            </button>
            <button
              type="button"
              className={`sidebar-user-pill ${userId === "u2" ? "is-active" : ""}`}
              onClick={() => {
                setUserId("u2");
                onCloseMobile?.();
              }}
            >
              u2
            </button>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavItem to="/" label="Dashboard" icon="grid" onNavigate={onCloseMobile} />
          <NavItem to="/call-insights" label="Call Insights" icon="phone" onNavigate={onCloseMobile} />
          <NavItem to="/knowledge-base" label="Knowledge Base" icon="doc" showInfo onNavigate={onCloseMobile} />
          <NavItem to="/prompts" label="Prompts" icon="chat" showInfo onNavigate={onCloseMobile} />
          <NavItem to="/boxy-controls" label="Boxy Controls" icon="globe" showInfo onNavigate={onCloseMobile} />
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-bottom">
          <button type="button" className="sidebar-item sidebar-action" onClick={() => setHistoryOpen(true)}>
            <span className="sidebar-icon">
              <Icon name="inbox" active={false} />
            </span>
            <span className="sidebar-label">Feedback History</span>
          </button>

          <button type="button" className="sidebar-item sidebar-action" onClick={() => setFeedbackOpen(true)}>
            <span className="sidebar-icon">
              <Icon name="gift" active={false} />
            </span>
            <span className="sidebar-label">Feedback</span>
          </button>

          <div className="sidebar-usage">{usageText}</div>

          <button type="button" className="btn btn-muted sidebar-upgrade">
            Upgrade
          </button>

          <div className="sidebar-footer">© 2025 Hintro. Made in India 🇮🇳</div>
        </div>
      </aside>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <FeedbackHistoryModal open={historyOpen} onClose={() => setHistoryOpen(false)} />
    </>
  );
}
