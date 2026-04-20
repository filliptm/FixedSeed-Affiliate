import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminDetail from "./pages/AdminDetail";

export default function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="center-screen">
        <div className="loading">Loading…</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/:id" element={<AdminDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
