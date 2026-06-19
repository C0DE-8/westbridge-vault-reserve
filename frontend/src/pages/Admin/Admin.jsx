import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiDollarSign,
  FiFileText,
  FiGrid,
  FiLifeBuoy,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShield,
  FiUsers,
  FiX,
} from "react-icons/fi";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import styles from "./Admin.module.css";

const BRAND_LOGO = "/westbridge-assets/images/favicon-wg.png";

const sections = [
  { path: "/admin", label: "Overview", end: true, icon: FiGrid },
  { path: "/admin/onboarding", label: "Onboarding", icon: FiShield },
  { path: "/admin/users", label: "Users", icon: FiUsers },
  { path: "/admin/transfers", label: "Transfers", icon: FiDollarSign },
  { path: "/admin/deposits", label: "Deposits", icon: FiCreditCard },
  { path: "/admin/atm-cards", label: "ATM Cards", icon: FiCreditCard },
  { path: "/admin/loans", label: "Loans", icon: FiFileText },
  { path: "/admin/bill-payments", label: "Bill Payments", icon: FiCreditCard },
  { path: "/admin/tickets", label: "Tickets", icon: FiLifeBuoy },
  { path: "/admin/wallets", label: "Wallets", icon: FiFileText },
  { path: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function Admin() {
  const { adminUser, logout } = useAuth();
  const { toasts, notify, dismissToast } = useGlassToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection =
    sections.find((section) =>
      section.end ? location.pathname === section.path : location.pathname.startsWith(section.path)
    ) || sections[0];

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout("admin");
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.adminShell}>
      <GlassToast toasts={toasts} onDismiss={dismissToast} />

      <button
        className={styles.mobileMenuButton}
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open admin navigation"
      >
        <FiMenu />
      </button>

      {menuOpen && <button className={styles.mobileBackdrop} type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}

      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <img src={BRAND_LOGO} alt="West Bridge Vault Reserve" />
          </div>
          <div>
            <strong>West Bridge Admin</strong>
            <span>Operations Console</span>
          </div>
          <button
            className={styles.mobileCloseButton}
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close admin navigation"
          >
            <FiX />
          </button>
        </div>

        <nav className={styles.nav}>
          {sections.map((section) => (
            <NavLink
              key={section.path}
              to={section.path}
              end={section.end}
              className={({ isActive }) => (isActive ? styles.activeNav : "")}
            >
              <section.icon />
              <span>{section.label}</span>
            </NavLink>
          ))}
        </nav>

        <button className={styles.sidebarLogoutBtn} type="button" onClick={handleLogout}>
          <FiLogOut />
          <span>Logout</span>
        </button>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{activeSection.label}</h1>
            <p className={styles.subtitle}>Manage customers, approvals, money movement, support, and platform controls.</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.adminName}>{adminUser?.full_name || adminUser?.username || "Admin"}</div>
            <button className={styles.logoutBtn} type="button" onClick={handleLogout}>
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <Outlet context={{ notify }} />
      </main>
    </div>
  );
}
