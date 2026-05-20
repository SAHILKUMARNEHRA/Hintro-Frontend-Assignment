export function formatDuration(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;

  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}sec`;
}

export function formatRelativeDate(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();

  if (!Number.isFinite(diffMs)) return "-";
  if (diffMs < 45 * 1000) return "Just now";

  const minutes = Math.floor(diffMs / (60 * 1000));
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function ordinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const mod10 = n % 10;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
}

export function formatDateGroupHeader(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const day = ordinal(date.getDate());
  return `${month} ${day}`;
}

export function formatTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .toLowerCase();
}

