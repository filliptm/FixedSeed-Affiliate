import { Link } from "react-router-dom";

export default function PortalFooter() {
  return (
    <footer className="portal-footer">
      <div className="portal-footer-inner">
        <span className="portal-footer-copy">
          © {new Date().getFullYear()} Fixed Seed
        </span>
        <nav className="portal-footer-links">
          <Link to="/terms">Affiliate Terms</Link>
          <a href="mailto:machinedelusions@gmail.com">Contact</a>
        </nav>
      </div>

      <style>{`
        .portal-footer {
          border-top: 1px solid var(--border);
          padding: 24px 32px;
          margin-top: auto;
          background: color-mix(in srgb, var(--bg-primary) 92%, transparent);
        }
        .portal-footer-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .portal-footer-copy {
          font-family: var(--font-headline);
          font-size: 11px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
        }
        .portal-footer-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .portal-footer-links a {
          font-family: var(--font-headline);
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-muted);
          text-decoration: none;
          transition: color 0.15s;
        }
        .portal-footer-links a:hover {
          color: var(--primary);
        }
      `}</style>
    </footer>
  );
}
