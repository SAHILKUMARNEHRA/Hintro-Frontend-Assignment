import "./EmptyState.css";

function CalendarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="3" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      <path d="M8 2v4" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 2v4" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" />
      <path d="M3 10h18" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
    </svg>
  );
}

export default function EmptyState() {
  return (
    <div className="empty card">
      <div className="empty-icon">
        <CalendarIcon />
      </div>
      <div className="empty-title">No Recent Calls</div>
      <div className="empty-sub">
        Connect your Google Calendar to see upcoming meetings, get reminders, and join calls directly from Hintro.
      </div>
      <button type="button" className="btn btn-outline empty-btn">
        Start a Call
      </button>
    </div>
  );
}

