# Hintro Dashboard (Frontend Assignment)

Dashboard UI for Hintro — an AI-powered call assistant. Built to match the provided Figma screenshots as closely as possible.

## Preview

- Screenshot: (add after running locally)
- Live demo: (optional)

## Tech Stack

| Category | Tech |
| --- | --- |
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| Styling | Plain CSS + CSS custom properties |
| Data | Fetch API |

## Getting Started

```bash
npm install
npm run dev
```

## API

Base URL: `https://mock-backend-hintro.vercel.app`

Endpoints used:

- `GET /api/auth/profile`
- `GET /api/auth/dashboard`
- `GET /api/call-sessions/stats`
- `GET /api/call-sessions?limit=10`

All requests include header: `x-user-id: u1 | u2`.

## Key Notes / Assumptions

- User switching is handled via a small `u1 / u2` toggle in the header (since there is no real authentication).
- Log out resets the app back to `u1` state.
- Sidebar navigation (except Dashboard) is a non-functional UI shell for the assignment.
- Feedback is stored in `localStorage` under `hintro_feedback` and displayed via “Feedback History”.
- “Start New Call” is a UI button with no action attached.

## Folder Structure

```txt
src/
  components/
    Sidebar/
    Header/
    StatCard/
    RecentCalls/
    EmptyState/
    LogoutModal/
    FeedbackModal/
    SkeletonLoader/
  context/
    UserContext.jsx
  hooks/
    useApi.js
  pages/
    Dashboard/
  styles/
    variables.css
    reset.css
    global.css
  utils/
    formatters.js
    storage.js
```
