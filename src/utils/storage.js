const KEY = "hintro_feedback";

export function getFeedbackList() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addFeedbackEntry(entry) {
  const list = getFeedbackList();
  const next = [entry, ...list];
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

