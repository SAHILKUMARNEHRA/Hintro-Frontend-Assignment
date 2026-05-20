import { Navigate, Route, Routes } from "react-router-dom";
import { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Header from "./components/Header/Header.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";

function Placeholder({ title }) {
  return (
    <div className="page">
      <div className="card placeholder-card">
        <div className="placeholder-title">{title}</div>
        <div className="placeholder-sub">This page is a non-functional UI shell for the assignment.</div>
      </div>
    </div>
  );
}

export default function App() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const headerConfig = useMemo(
    () => ({
      onOpenMobileNav: () => setMobileNavOpen(true),
      isMobileNavOpen: mobileNavOpen,
    }),
    [mobileNavOpen],
  );

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />
      <div className="app-main">
        <Header {...headerConfig} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/call-insights" element={<Placeholder title="Call Insights" />} />
          <Route path="/knowledge-base" element={<Placeholder title="Knowledge Base" />} />
          <Route path="/prompts" element={<Placeholder title="Prompts" />} />
          <Route path="/boxy-controls" element={<Placeholder title="Boxy Controls" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
