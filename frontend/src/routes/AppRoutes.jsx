import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Admin from "../pages/Admin/Admin";
import AdminDeposits from "../pages/Admin/pages/AdminDeposits";
import AdminOnboarding from "../pages/Admin/pages/AdminOnboarding";
import AdminOverview from "../pages/Admin/pages/AdminOverview";
import AdminSettings from "../pages/Admin/pages/AdminSettings";
import AdminTickets from "../pages/Admin/pages/AdminTickets";
import AdminTransfers from "../pages/Admin/pages/AdminTransfers";
import AdminUsers from "../pages/Admin/pages/AdminUsers";
import AdminWallets from "../pages/Admin/pages/AdminWallets";
import VerifyLoginOTP from "../pages/VerifyLoginOTP/VerifyLoginOTP";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "../components/PublicRoute/PublicRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/verify-login-otp"
          element={
            <PublicRoute>
              <VerifyLoginOTP />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="onboarding" element={<AdminOnboarding />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="transfers" element={<AdminTransfers />} />
          <Route path="deposits" element={<AdminDeposits />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="wallets" element={<AdminWallets />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
