import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AdminAffiliate,
  AdminListResponse,
  adminListAffiliates,
} from "../lib/api";
import { isAdmin } from "../lib/roles";

const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED", "ALL"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export default function Admin() {
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
      <header className="topbar">
        <div className="topbar-title">Fixed Seed Affiliates · Admin</div>
        <div className="topbar-right">
          <Link to="/dashboard" className="btn">My dashboard</Link>
          <span>{user?.email}</span>
          <button
            className="btn"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="container">
        {error && <div className="error-banner">{error}</div>}

        <div className="admin-tabs">
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              className={`admin-tab ${status === s ? "admin-tab-active" : ""}`}
              onClick={() => { setStatus(s); setPage(1); }}
            >
              {s}
            </button>
          ))}
        </div>

        <form
          className="admin-search"
          onSubmit={(e) => { e.preventDefault(); setPage(1); load(); }}
        >
          <input
            className="admin-search-input"
            placeholder="Search name, email, or code…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn">Search</button>
        </form>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {loading ? (
            <div className="empty">Loading…</div>
          ) : !data || data.affiliates.length === 0 ? (
            <div className="empty">No affiliates in this view.</div>
          ) : (
            <table className="table admin-table">
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
                      <div style={{ fontWeight: 600 }}>{a.name || "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--fg-dim)" }}>{a.email}</div>
                    </td>
                    <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.code || "—"}</td>
                    <td>
                      <span className={`status-badge status-${a.status.toLowerCase()}`}>
                        {a.status}
                      </span>
                    </td>
                    <td>{formatRate(a)}</td>
                    <td style={{ color: "var(--fg-dim)", fontSize: 12 }}>
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            <button className="btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span style={{ padding: "8px 12px", color: "var(--fg-dim)" }}>
              Page {data.page} of {data.totalPages}
            </span>
            <button className="btn" disabled={page >= data.totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        )}
      </main>

      <style>{`
        .admin-tabs { display: flex; gap: 4px; margin-bottom: 12px; flex-wrap: wrap; }
        .admin-tab {
          padding: 8px 14px; border: 1px solid var(--border); background: transparent;
          color: var(--fg-dim); border-radius: 8px; cursor: pointer;
          font: inherit; font-size: 12px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .admin-tab:hover { color: var(--fg); }
        .admin-tab-active { background: var(--bg-card); color: var(--fg); }
        .admin-search { display: flex; gap: 8px; margin-bottom: 16px; }
        .admin-search-input {
          flex: 1; padding: 10px 12px;
          background: var(--bg); color: var(--fg);
          border: 1px solid var(--border); border-radius: 8px; font: inherit;
        }
        .admin-table th, .admin-table td { padding: 12px 16px; }
        .admin-table tr:hover td { background: rgba(255, 255, 255, 0.02); }
      `}</style>
    </div>
  );
}
