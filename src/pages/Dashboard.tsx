import { useCallback, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AffiliateMe,
  Conversion,
  NotFoundError,
  applyToBeAffiliate,
  getConversions,
  getMe,
} from "../lib/api";
import { isAdmin } from "../lib/roles";
import PortalTopBar from "../components/PortalTopBar";
import type { ThemeContext } from "../App";

const WEBSITE_URL = "https://fixedseed.com";

export default function Dashboard({ themeCtx }: { themeCtx: ThemeContext }) {
  const { isAuthenticated, isLoading, user, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [me, setMe] = useState<AffiliateMe | null>(null);
  const [needsApply, setNeedsApply] = useState(false);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      try {
        const meData = await getMe(token);
        setMe(meData);
        setNeedsApply(false);
        if (meData.status === "APPROVED") {
          const page = await getConversions(token, 1);
          setConversions(page.conversions);
        }
      } catch (err) {
        if (err instanceof NotFoundError) {
          setNeedsApply(true);
          setMe(null);
        } else {
          throw err;
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    if (isAuthenticated) {
      loadAll();
    }
  }, [isAuthenticated, isLoading, loadAll, navigate]);

  if (isLoading || loading) {
    return (
      <div className="center-screen">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <PortalTopBar
        userEmail={user?.email}
        theme={themeCtx.theme}
        onThemeChange={themeCtx.setTheme}
        onSignOut={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        actions={
          isAdmin(user) ? (
            <Link to="/admin" className="btn btn-sm btn-primary">
              Admin
            </Link>
          ) : undefined
        }
      />

      <main className="container">
        {error && <div className="error-banner">{error}</div>}

        {needsApply && <ApplyView onApplied={loadAll} />}

        {me?.status === "PENDING" && <PendingView />}
        {me?.status === "REJECTED" && <RejectedView reason={me.rejectedReason} />}
        {me?.status === "SUSPENDED" && <SuspendedView />}
        {me?.status === "APPROVED" && (
          <ApprovedView me={me} conversions={conversions} />
        )}
      </main>
    </div>
  );
}

function ApplyView({ onApplied }: { onApplied: () => void }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState(user?.name || "");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErr(null);
    try {
      const token = await getAccessTokenSilently();
      await applyToBeAffiliate(token, { name: name.trim(), applicationNote: note.trim() });
      onApplied();
    } catch (e: any) {
      setErr(e.message || "Failed to submit");
      setSubmitting(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>Apply to become an affiliate</h2>
      <p className="card-desc">
        Tell us a little about yourself and how you plan to promote Fixed Seed
        products. Applications are reviewed manually; you'll see your status on
        this dashboard once you're approved.
      </p>

      {err && <div className="error-banner">{err}</div>}

      <div className="form-row">
        <label>Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name or handle"
        />
      </div>

      <div className="form-row">
        <label>How will you promote Fixed Seed?</label>
        <textarea
          required
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Audience, channels, approximate reach, anything else we should know."
        />
      </div>

      <button className="btn btn-primary" type="submit" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit application"}
      </button>
    </form>
  );
}

function PendingView() {
  return (
    <div className="card">
      <h2>Application under review</h2>
      <p className="card-desc">
        Thanks for applying. We review every application manually and will notify
        you by email once a decision is made. Check back here or watch your inbox.
      </p>
      <span className="status-badge status-pending">Pending</span>
    </div>
  );
}

function RejectedView({ reason }: { reason: string | null }) {
  return (
    <div className="card">
      <h2>Application not approved</h2>
      <p className="card-desc">
        Unfortunately your application wasn't approved at this time.
        {reason ? <> Reason: {reason}</> : null}
      </p>
      <span className="status-badge status-rejected">Rejected</span>
    </div>
  );
}

function SuspendedView() {
  return (
    <div className="card">
      <h2>Account suspended</h2>
      <p className="card-desc">
        Your affiliate account is currently suspended. Contact us if you think
        this is a mistake.
      </p>
      <span className="status-badge status-suspended">Suspended</span>
    </div>
  );
}

function ApprovedView({
  me,
  conversions,
}: {
  me: AffiliateMe;
  conversions: Conversion[];
}) {
  const referralUrl = `${WEBSITE_URL}/?ref=${me.code}`;
  const rateDisplay = formatRate(me.commissionType, me.commissionRate);

  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <div className="card">
        <h2>Your referral link</h2>
        <p className="card-desc">
          Share this link. Anyone who visits gets a 30-day attribution cookie — if
          they purchase within that window, the sale is credited to you.
        </p>
        <div className="code-block">
          <span>{referralUrl}</span>
          <button className="copy-btn" onClick={copy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="card-desc" style={{ marginTop: 16, marginBottom: 0 }}>
          Commission: <strong style={{ color: "var(--text-primary)" }}>{rateDisplay}</strong>
          {" "}per sale.
        </p>
      </div>

      <div className="stats-grid">
        <StatBox label="Total clicks" value={me.stats.totalClicks.toLocaleString()} />
        <StatBox label="Conversions" value={me.stats.totalConversions.toLocaleString()} />
        <StatBox
          label="Conversion rate"
          value={`${(me.stats.conversionRate * 100).toFixed(1)}%`}
        />
        <StatBox
          label="Earned (USD)"
          value={`$${(me.stats.totalCommission / 100).toFixed(2)}`}
        />
      </div>

      <div className="card">
        <h2>Recent conversions</h2>
        {conversions.length === 0 ? (
          <div className="empty">No conversions yet — share your link to get started.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Sale</th>
                <th>Your commission</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {conversions.map((c) => (
                <tr key={c.id}>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{c.productSlug}</td>
                  <td>${(c.amountPaid / 100).toFixed(2)}</td>
                  <td>${(c.commissionAmount / 100).toFixed(2)}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        c.paidOut ? "status-approved" : "status-pending"
                      }`}
                    >
                      {c.paidOut ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
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

function formatRate(type: "PERCENT" | "FLAT", rate: number): string {
  if (type === "PERCENT") return `${(rate / 100).toFixed(2)}%`;
  return `$${(rate / 100).toFixed(2)}`;
}
