import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AdminAffiliate,
  AdminListResponse,
  adminListAffiliates,
} from "../lib/api";
import { isAdmin } from "../lib/roles";
import PortalTopBar from "../components/PortalTopBar";
import type { ThemeContext } from "../App";

const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED", "ALL"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export default function Admin({ themeCtx }: { themeCtx: ThemeContext }) {
  const { isLoading, isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminListResponse | null>(null);
  const [status, setStatus] = useState<StatusTab>("PENDING");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const res = await adminListAffiliates(token, {
        status: status === "ALL" ? undefined : status,
        search: search.trim() || undefined,
        page,
      });
      setData(res);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently, status, search, page]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    if (!isLoading && isAuthenticated && !isAdmin(user)) {
      navigate("/dashboard", { replace: true });
      return;
    }
    if (isAuthenticated && isAdmin(user)) {
      load();
    }
  }, [isAuthenticated, isLoading, user, load, navigate]);

  if (isLoading) {
    return <div className="center-screen"><div className="loading">Loading…</div></div>;
  }

  function formatRate(a: AdminAffiliate): string {
    if (a.status !== "APPROVED" && a.status !== "SUSPENDED") return "—";
    if (a.commissionType === "PERCENT") return `${(a.commissionRate / 100).toFixed(2)}%`;
    return `$${(a.commissionRate / 100).toFixed(2)}`;
  }

  return (
    <div className="app-shell">
      <PortalTopBar
        subtitle="Affiliates · Admin"
        userEmail={user?.email}
        theme={themeCtx.theme}
        onThemeChange={themeCtx.setTheme}
        onSignOut={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        actions={
          <Link to="/dashboard" className="btn btn-sm">
            My dashboard
          </Link>
        }
      />

      <main className="container">
        {error && <div className="error-banner">{error}</div>}

        <div className="segmented">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              className={status === s ? "active" : ""}
              onClick={() => { setStatus(s); setPage(1); }}
            >
              {s}
            </button>
          ))}
        </div>

        <form
          style={{ display: "flex", gap: 8, marginBottom: 16 }}
          onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }}
        >
          <input
            type="search"
            placeholder="Search name, email, or code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn">Search</button>
        </form>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div className="empty">Loading…</div>
          ) : !data || data.affiliates.length === 0 ? (
            <div className="empty">No affiliates in this view</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name / Email</th>
                  <th>Code</th>
                  <th>Status</th>
                  <th>Rate</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {data.affiliates.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => navigate(`/admin/${a.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {a.name || "—"}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {a.email}
                      </div>
                    </td>
                    <td style={{ fontFamily: "SF Mono, Menlo, monospace", fontSize: 12, color: "var(--text-primary)" }}>
                      {a.code || "—"}
                    </td>
                    <td>
                      <span className={`status-badge status-${a.status.toLowerCase()}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{formatRate(a)}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: 12 }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="pagination">
            <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span className="pagination-info">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              className="btn btn-sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
