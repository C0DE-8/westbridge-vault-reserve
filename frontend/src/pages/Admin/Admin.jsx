import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import styles from "./Admin.module.css";

const BRAND_LOGO = "/westbridge-assets/images/favicon-wg.png";

const sections = [
  { path: "/admin", label: "Overview", end: true },
  { path: "/admin/onboarding", label: "Onboarding" },
  { path: "/admin/users", label: "Users" },
  { path: "/admin/transfers", label: "Transfers" },
  { path: "/admin/deposits", label: "Deposits" },
  { path: "/admin/bill-payments", label: "Bill Payments" },
  { path: "/admin/tickets", label: "Tickets" },
  { path: "/admin/wallets", label: "Wallets" },
  { path: "/admin/settings", label: "Settings" },
];

export default function Admin() {
  const { adminUser, logout } = useAuth();
  const { toasts, notify, dismissToast } = useGlassToast();
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection =
    sections.find((section) =>
      section.end ? location.pathname === section.path : location.pathname.startsWith(section.path)
    ) || sections[0];

  const handleLogout = () => {
    logout("admin");
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.adminShell}>
      <GlassToast toasts={toasts} onDismiss={dismissToast} />

      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <img src={BRAND_LOGO} alt="West Bridge Vault Reserve" />
          </div>
          <div>
            <strong>West Bridge Admin</strong>
            <span>Operations Console</span>
          </div>
        </div>

        <nav className={styles.nav}>
          {sections.map((section) => (
            <NavLink
              key={section.path}
              to={section.path}
              end={section.end}
              className={({ isActive }) => (isActive ? styles.activeNav : "")}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>{activeSection.label}</h1>
            <p className={styles.subtitle}>Manage customers, approvals, money movement, support, and platform controls.</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.adminName}>{adminUser?.full_name || adminUser?.username || "Admin"}</div>
            <button className={styles.logoutBtn} type="button" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <Outlet context={{ notify }} />
      </main>
    </div>
  );
}
