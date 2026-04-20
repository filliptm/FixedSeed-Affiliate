import { ReactNode } from "react";
import { Theme } from "../themes";
import ThemeSelector from "./ThemeSelector";

interface PortalTopBarProps {
  subtitle?: string;
  userEmail?: string | null;
  onSignOut?: () => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  /** Extra actions rendered before the user email on the right side. */
  actions?: ReactNode;
}

export default function PortalTopBar({
  subtitle,
  userEmail,
  onSignOut,
  theme,
  onThemeChange,
  actions,
}: PortalTopBarProps) {
  return (
    <header className="portal-topbar">
      <div className="portal-topbar-left">
        <span className="portal-title">
          Fixed Seed
          <span className="portal-title-sub">
            {" · "}{subtitle || "Affiliates"}
          </span>
        </span>
      </div>
      <div className="portal-topbar-right">
        {actions}
        {userEmail && <span className="portal-user">{userEmail}</span>}
        <ThemeSelector currentTheme={theme} onThemeChange={onThemeChange} />
        {onSignOut && (
          <button className="btn btn-sm" onClick={onSignOut}>
            Sign out
          </button>
        )}
      </div>
    </header>
  );
}
