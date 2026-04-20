import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminDetail from "./pages/AdminDetail";
import { Theme, applyTheme, loadSavedTheme } from "./themes";

export interface ThemeContext {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export default function App() {
  const { isLoading } = useAuth0();
  const [theme, setThemeState] = useState<Theme>(() => loadSavedTheme());

  function setTheme(t: Theme) {
    applyTheme(t);
    setThemeState(t);
  }

  if (isLoading) {
    return (
      <div className="center-screen">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  const themeCtx: ThemeContext = { theme, setTheme };

  return (
    <Routes>
      <Route path="/" element={<Landing themeCtx={themeCtx} />} />
      <Route path="/dashboard" element={<Dashboard themeCtx={themeCtx} />} />
      <Route path="/admin" element={<Admin themeCtx={themeCtx} />} />
      <Route path="/admin/:id" element={<AdminDetail themeCtx={themeCtx} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
