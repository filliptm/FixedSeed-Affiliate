import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AdminAffiliateDetail,
  CommissionType,
  adminApprove,
  adminGetAffiliate,
  adminReject,
  adminUpdate,
} from "../lib/api";
import { isAdmin } from "../lib/roles";
import PortalTopBar from "../components/PortalTopBar";
import type { ThemeContext } from "../App";

export default function AdminDetail({ themeCtx }: { themeCtx: ThemeContext }) {
  const { isLoading, isAuthenticated, user, logout, getAccessTokenSilently } = useAuth0();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AdminAffiliateDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [commissionType, setCommissionType] = useState<CommissionType>("PERCENT");
  const [rateInput, setRateInput] = useState("25");
  const [customCode, setCustomCode] = useState("");

  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const d = await adminGetAffiliate(token, id);
      setDetail(d);
      setCommissionType(d.commissionType);
      setRateInput(
        d.commissionType === "PERCENT"
          ? (d.commissionRate / 100).toString()
          : (d.commissionRate / 100).toFixed(2)
      );
    } catch (e: any) {
      setError(e.message);
    }
  }, [getAccessTokenSilently, id]);

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

  function rateToInt(): number {
    const raw = parseFloat(rateInput);
    if (Number.isNaN(raw)) return 0;
    return Math.round(raw * 100);
  }

  async function handleApprove() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      await adminApprove(token, id, {
        commissionType,
        commissionRate: rateToInt(),
        code: customCode.trim() || undefined,
      });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleReject() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      await adminReject(token, id, rejectReason.trim());
      setShowReject(false);
      setRejectReason("");
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveRate() {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      await adminUpdate(token, id, { commissionType, commissionRate: rateToInt() });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSuspend(suspended: boolean) {
    if (!id) return;
    setBusy(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      await adminUpdate(token, id, { suspended });
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!detail) {
    return (
      <div className="app-shell">
        <PortalTopBar
          subtitle="Affiliates · Admin"
          userEmail={user?.email}
          theme={themeCtx.theme}
          onThemeChange={themeCtx.setTheme}
          onSignOut={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        />
        <main className="container">
          <button className="btn btn-sm" onClick={() => navigate("/admin")}>← Back</button>
          <div style={{ marginTop: 16 }}>
            {error ? <div className="error-banner">{error}</div> : <div className="loading">Loading…</div>}
          </div>
        </main>
      </div>
    );
  }

  const formattedRate =
    detail.commissionType === "PERCENT"
      ? `${(detail.commissionRate / 100).toFixed(2)}%`
      : `$${(detail.commissionRate / 100).toFixed(2)}`;

  return (
    <div className="app-shell">
      <PortalTopBar
        subtitle="Affiliates · Admin"
        userEmail={user?.email}
        theme={themeCtx.theme}
        onThemeChange={themeCtx.setTheme}
        onSignOut={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      />

      <main className="container">
        <button className="btn btn-sm" onClick={() => navigate("/admin")} style={{ marginBottom: 16 }}>
          ← Back
        </button>

        {error && <div className="error-banner">{error}</div>}

        <div
          className="card"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}
        >
          <div>
            <h2 style={{ marginBottom: 4 }}>{detail.name || detail.email}</h2>
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{detail.email}</div>
          </div>
          <span className={`status-badge status-${detail.status.toLowerCase()}`}>
            {detail.status}
          </span>
        </div>

        <div className="card">
          <h2>Application</h2>
          <div className="detail-row">
            <span>Applied</span>
            <span>{new Date(detail.createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span>Auth0 sub</span>
            <span style={{ fontFamily: "SF Mono, Menlo, monospace", fontSize: 12 }}>{detail.auth0Sub}</span>
          </div>
          {detail.applicationNote && (
            <div style={{ marginTop: 16 }}>
              <div className="field-label">Application note</div>
              <div className="note-body">{detail.applicationNote}</div>
            </div>
          )}
        </div>

        {detail.status === "PENDING" && (
          <div className="card">
            <h2>Approve</h2>
            <p className="card-desc">
              Sets the affiliate's initial commission. Approved affiliates can share their link immediately.
            </p>
            <div className="detail-row">
              <span>Commission type</span>
              <select
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value as CommissionType)}
                style={{ width: "auto" }}
              >
                <option value="PERCENT">Percentage of sale</option>
                <option value="FLAT">Flat amount per sale</option>
              </select>
            </div>
            <div className="detail-row">
              <span>{commissionType === "PERCENT" ? "Rate (%)" : "Amount per sale (USD)"}</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                style={{ width: 140 }}
              />
            </div>
            <div className="detail-row">
              <span>Custom code (optional)</span>
              <input
                type="text"
                placeholder="Auto-generated if blank"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                style={{ width: 220 }}
              />
            </div>
            <div className="actions-row">
              <button className="btn btn-primary" disabled={busy} onClick={handleApprove}>
                {busy ? "Approving…" : "Approve"}
              </button>
              {!showReject ? (
                <button className="btn btn-danger" onClick={() => setShowReject(true)}>Reject</button>
              ) : (
                <>
                  <input
                    placeholder="Reason shown to applicant"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    style={{ flex: 1, minWidth: 200 }}
                  />
                  <button
                    className="btn btn-danger"
                    disabled={busy || !rejectReason.trim()}
                    onClick={handleReject}
                  >
                    Confirm reject
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {(detail.status === "APPROVED" || detail.status === "SUSPENDED") && (
          <>
            <div className="card">
              <h2>Referral info</h2>
              <div className="detail-row">
                <span>Code</span>
                <span style={{ fontFamily: "SF Mono, Menlo, monospace", fontWeight: 700 }}>
                  {detail.code}
                </span>
              </div>
              <div className="detail-row">
                <span>Current commission</span>
                <span>{formattedRate}</span>
              </div>
              <div className="detail-row">
                <span>Approved at</span>
                <span>{detail.approvedAt ? new Date(detail.approvedAt).toLocaleString() : "—"}</span>
              </div>
            </div>

            <div className="card">
              <h2>Performance</h2>
              <div className="stats-grid">
                <StatBox label="Clicks" value={detail.stats.totalClicks.toLocaleString()} />
                <StatBox label="Conversions" value={detail.stats.totalConversions.toLocaleString()} />
                <StatBox label="Total sales" value={`$${(detail.stats.totalSales / 100).toFixed(2)}`} />
                <StatBox label="Owed (USD)" value={`$${(detail.stats.totalCommission / 100).toFixed(2)}`} />
              </div>
            </div>

            <div className="card">
              <h2>Adjust commission</h2>
              <p className="card-desc">
                New rate applies to future conversions only. Existing conversions keep their
                snapshot of the rate at sale time.
              </p>
              <div className="detail-row">
                <span>Commission type</span>
                <select
                  value={commissionType}
                  onChange={(e) => setCommissionType(e.target.value as CommissionType)}
                  style={{ width: "auto" }}
                >
                  <option value="PERCENT">Percentage of sale</option>
                  <option value="FLAT">Flat amount per sale</option>
                </select>
              </div>
              <div className="detail-row">
                <span>{commissionType === "PERCENT" ? "Rate (%)" : "Amount per sale (USD)"}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={rateInput}
                  onChange={(e) => setRateInput(e.target.value)}
                  style={{ width: 140 }}
                />
              </div>
              <div className="actions-row">
                <button className="btn btn-primary" disabled={busy} onClick={handleSaveRate}>
                  {busy ? "Saving…" : "Save rate"}
                </button>
                {detail.status === "APPROVED" ? (
                  <button className="btn btn-danger" disabled={busy} onClick={() => handleSuspend(true)}>
                    Suspend
                  </button>
                ) : (
                  <button className="btn" disabled={busy} onClick={() => handleSuspend(false)}>
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {detail.status === "REJECTED" && (
          <div className="card">
            <h2>Rejection</h2>
            <div className="detail-row">
              <span>Rejected at</span>
              <span>{detail.rejectedAt ? new Date(detail.rejectedAt).toLocaleString() : "—"}</span>
            </div>
            {detail.rejectedReason && (
              <div style={{ marginTop: 16 }}>
                <div className="field-label">Reason shown to applicant</div>
                <div className="note-body">{detail.rejectedReason}</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-box">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
