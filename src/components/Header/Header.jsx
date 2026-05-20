import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Header.css";
import LogoutModal from "../LogoutModal/LogoutModal.jsx";
import { useApi } from "../../hooks/useApi.js";
import { resetUserToDefault, useUser } from "../../context/UserContext.jsx";

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l12-7-12-7Z" fill="var(--color-text-primary)" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 9l6 6 6-6"
        fill="none"
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" fill="none" stroke="var(--color-text-primary)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Header({ onOpenMobileNav }) {
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname === "/call-insights") return "Call Insights";
    if (location.pathname === "/knowledge-base") return "Knowledge Base";
    if (location.pathname === "/prompts") return "Prompts";
    if (location.pathname === "/boxy-controls") return "Boxy Controls";
    return "Dashboard";
  }, [location.pathname]);

  const { userId, setUserId } = useUser();
  const { data: profileData } = useApi("/api/auth/profile");

  const initial = useMemo(() => {
    const base = profileData?.firstName || profileData?.name || profileData?.email || "";
    const first = String(base).trim().slice(0, 1).toUpperCase();
    return first || "U";
  }, [profileData]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target)) return;
      setMenuOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, []);

  const onLogout = () => {
    resetUserToDefault();
    window.location.reload();
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button type="button" className="header-hamburger" onClick={onOpenMobileNav} aria-label="Open menu">
            <MenuIcon />
          </button>
          <div className="header-title">{title}</div>
        </div>

        <div className="header-right">
          <button type="button" className="btn btn-outline header-tutorial">
            <PlayIcon />
            Watch Tutorial
          </button>

          <div className="header-switch" role="group" aria-label="User switch">
            <button
              type="button"
              className={`header-pill ${userId === "u1" ? "is-active" : ""}`}
              onClick={() => setUserId("u1")}
            >
              u1
            </button>
            <button
              type="button"
              className={`header-pill ${userId === "u2" ? "is-active" : ""}`}
              onClick={() => setUserId("u2")}
            >
              u2
            </button>
          </div>

          <div className="header-avatar-wrap" ref={menuRef}>
            <button type="button" className="header-avatar-btn" onClick={() => setMenuOpen((v) => !v)}>
              <span className="header-avatar" aria-hidden="true">
                {initial}
              </span>
              <span className="header-chevron" aria-hidden="true">
                <ChevronDown />
              </span>
            </button>

            <div className={`header-menu ${menuOpen ? "is-open" : ""}`} role="menu">
              <button
                type="button"
                className="header-menu-item"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutOpen(true);
                }}
              >
                <span className="header-menu-arrow">→</span>
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onLogout={onLogout} />
    </>
  );
}
