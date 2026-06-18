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
import AdminBillPayments from "../pages/Admin/pages/AdminBillPayments";
import VerifyLoginOTP from "../pages/VerifyLoginOTP/VerifyLoginOTP";
import TransactionsPage from "../pages/UserPages/TransactionsPage";
import TransactionHistoryPage from "../pages/UserPages/TransactionHistoryPage";
import ConvertPage from "../pages/UserPages/ConvertPage";
import MorePage from "../pages/UserPages/MorePage";
import ProfilePage from "../pages/UserPages/ProfilePage";
import SecurityPage from "../pages/UserPages/SecurityPage";
import TransferDetailPage from "../pages/UserPages/TransferDetailPage";
import FundingPage from "../pages/UserPages/FundingPage";
import BillsAirtimePage from "../pages/UserPages/BillsAirtimePage";
import CardsPage from "../pages/UserPages/CardsPage";
import StatementsPage from "../pages/UserPages/StatementsPage";
import SupportPage from "../pages/UserPages/SupportPage";
import {
  WestBridgeAboutPage,
  WestBridgeContactPage,
  WestBridgeHomePage,
  WestBridgeProjectsPage,
  WestBridgeServicesPage,
} from "../pages/Marketing/WestBridgeSite";
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
              <WestBridgeHomePage />
            </PublicRoute>
          }
        />

        <Route
          path="/about"
          element={
            <PublicRoute>
              <WestBridgeAboutPage />
            </PublicRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <PublicRoute>
              <WestBridgeProjectsPage />
            </PublicRoute>
          }
        />

        <Route
          path="/services"
          element={
            <PublicRoute>
              <WestBridgeServicesPage />
            </PublicRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicRoute>
              <WestBridgeContactPage />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/auth"
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
          path="/cards"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <CardsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TransactionsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transaction-history"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TransactionHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfer/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <TransferDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/convert"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ConvertPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/funding"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <FundingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <SecurityPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/more"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <MorePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <SupportPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills-airtime"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <BillsAirtimePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statements"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <StatementsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/loans"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserPage type="more" title="Loans" description="Review loan options and account lending information." />
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
          <Route path="bill-payments" element={<AdminBillPayments />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="wallets" element={<AdminWallets />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
