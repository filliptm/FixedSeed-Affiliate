import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import type { ThemeContext } from "../App";

export default function Landing({ themeCtx: _themeCtx }: { themeCtx: ThemeContext }) {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="center-screen">
      <div className="landing">
        <h1>Fixed Seed Affiliates</h1>
        <p>
          Partner with us to share Fixed Seed products. Sign in to apply to the
          affiliate program, get a referral link, and track your conversions.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => loginWithRedirect({ appState: { returnTo: "/dashboard" } })}
        >
          Sign in to continue
        </button>
      </div>
    </div>
  );
}
