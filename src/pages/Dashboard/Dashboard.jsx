import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import { useApi } from "../../hooks/useApi.js";
import StatCard from "../../components/StatCard/StatCard.jsx";
import RecentCalls from "../../components/RecentCalls/RecentCalls.jsx";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader.jsx";
import { formatRelativeDate } from "../../utils/formatters.js";
import { useUser } from "../../context/UserContext.jsx";

function HowItWorks() {
  return (
    <section className="hiw">
      <div className="hiw-title">How it works</div>
      <div className="hiw-grid">
        <div className="hiw-card card">
          <div className="hiw-step">STEP 1</div>
          <div className="hiw-icon">⭳</div>
          <div className="hiw-name">Upload files</div>
          <div className="hiw-sub">Add files for meeting context</div>
          <button type="button" className="btn btn-outline hiw-btn">
            Upload
          </button>
        </div>
        <div className="hiw-card card">
          <div className="hiw-step">STEP 2</div>
          <div className="hiw-icon">☎</div>
          <div className="hiw-name">Start a Call</div>
          <div className="hiw-sub">Begin your AI-assisted call</div>
          <button type="button" className="btn btn-outline hiw-btn">
            Start a Call
          </button>
        </div>
        <div className="hiw-card card">
          <div className="hiw-step">STEP 3</div>
          <div className="hiw-icon">▦</div>
          <div className="hiw-name">View Insights</div>
          <div className="hiw-sub">Review notes and action items after the call</div>
          <button type="button" className="btn btn-outline hiw-btn">
            View Insights
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const { userId } = useUser();
  const { data: profileData, loading: profileLoading, error: profileError, refetch: refetchProfile } = useApi(
    "/api/auth/profile",
  );
  const { data: statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useApi(
    "/api/call-sessions/stats",
  );
  const {
    data: sessionsData,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useApi("/api/call-sessions?limit=10");

  const sessions = sessionsData?.callSessions || [];
  const hasCalls = Array.isArray(sessions) && sessions.length > 0;

  const firstName = useMemo(() => {
    const direct = profileData?.firstName || profileData?.name || "";
    if (direct) return String(direct).trim() || "Name";
    const fromEmail = profileData?.email ? String(profileData.email).split("@")[0] : "";
    return fromEmail || "Name";
  }, [profileData]);

  const lastSessionValue = useMemo(() => {
    const startedAt = statsData?.lastSession?.[0];
    return startedAt ? formatRelativeDate(startedAt) : "-";
  }, [statsData]);

  const [switchFade, setSwitchFade] = useState(false);
  useEffect(() => {
    setSwitchFade(true);
    const t = window.setTimeout(() => setSwitchFade(false), 200);
    return () => window.clearTimeout(t);
  }, [userId]);

  return (
    <div className={`page dash ${switchFade ? "is-fading" : ""}`}>
      <div className="dash-inner">
        <div className="dash-welcome">
          <div className="dash-welcome-left">
            <div className="dash-hello">
              Hi, {profileLoading ? "…" : firstName} 👋 Welcome to Hintro
            </div>
            <div className="dash-sub">Ready to make your next call smarter ?</div>
            <button type="button" className="btn btn-primary dash-start-mobile">
              Start Call
            </button>
          </div>
          <button type="button" className="btn btn-primary dash-start">
            Start New Call
          </button>
        </div>

        {profileError ? (
          <div className="dash-error card">
            <div className="dash-error-title">Couldn’t load profile.</div>
            <div className="dash-error-sub">{profileError.message}</div>
            <button type="button" className="btn btn-outline" onClick={refetchProfile}>
              Retry
            </button>
          </div>
        ) : null}

        <div className="dash-stats">
          {statsLoading ? (
            <>
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="dash-stat-skel card">
                  <SkeletonLoader className="dash-stat-skel-icon" />
                  <div className="dash-stat-skel-meta">
                    <SkeletonLoader className="dash-stat-skel-line sm" />
                    <SkeletonLoader className="dash-stat-skel-line lg" />
                  </div>
                </div>
              ))}
            </>
          ) : statsError ? (
            <div className="dash-error card">
              <div className="dash-error-title">Couldn’t load stats.</div>
              <div className="dash-error-sub">{statsError.message}</div>
              <button type="button" className="btn btn-outline" onClick={refetchStats}>
                Retry
              </button>
            </div>
          ) : (
            <>
              <StatCard
                label="Total Sessions"
                value={Number(statsData?.totalSessions) || 0}
                iconKind="sessions"
                iconBg="bg-red"
                delayMs={0}
              />
              <StatCard
                label="Average Duration"
                value={Number(statsData?.averageDuration) || 0}
                iconKind="duration"
                iconBg="bg-teal"
                delayMs={100}
              />
              <StatCard
                label="AI Used"
                value={Number(statsData?.totalAIInteractions) || 0}
                iconKind="ai"
                iconBg="bg-green"
                delayMs={200}
              />
              <StatCard label="Last Session" value={lastSessionValue} iconKind="calendar" iconBg="bg-purple" delayMs={300} />
            </>
          )}
        </div>

        {!hasCalls && !sessionsLoading && !sessionsError ? <HowItWorks /> : null}

        <RecentCalls sessions={sessions} loading={sessionsLoading} error={sessionsError} onRetry={refetchSessions} />
      </div>
    </div>
  );
}
