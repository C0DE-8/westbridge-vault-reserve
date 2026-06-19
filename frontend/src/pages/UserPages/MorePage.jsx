import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiChevronRight,
  FiFileText,
  FiHeadphones,
  FiLock,
  FiMoreHorizontal,
  FiPhone,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import styles from "./UserPage.module.css";

export default function MorePage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismissToast } = useGlassToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(userUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get("/user/profile")
      .then((res) => {
        if (active) setProfile(res.data?.user || userUser);
      })
      .catch(() => {
        if (active) {
          setProfile(userUser);
          notify("Unable to load account shortcuts right now.", "error", "More unavailable");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [notify, userUser]);

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  const displayName = profile?.full_name || profile?.username || "User";
  const verificationLabel = useMemo(() => {
    if (profile?.acct_status === "active" || profile?.email_verified) return "Verified";
    if (profile?.acct_status === "pending") return "Pending review";
    if (profile?.acct_status === "rejected") return "Rejected";
    return "In review";
  }, [profile?.acct_status, profile?.email_verified]);

  const accountItems = [
    {
      title: "Profile",
      subtitle: "Update account title, username, image, and account details.",
      icon: <FiUser />,
      path: "/profile",
    },
    {
      title: "Account Verification",
      subtitle: verificationLabel,
      icon: <FiCheckCircle />,
      path: "/profile",
      status: verificationLabel,
    },
    {
      title: "Security",
      subtitle: "Change password and manage your transaction PIN.",
      icon: <FiLock />,
      path: "/settings",
    },
  ];

  const serviceItems = [
    {
      title: "Statements",
      subtitle: "View charts, account activity, and transaction summaries.",
      icon: <FiFileText />,
      path: "/statements",
    },
    {
      title: "Loans",
      subtitle: "Submit loan applications and monitor approval updates.",
      icon: <FiCheckCircle />,
      path: "/loans",
    },
    {
      title: "Top-Up",
      subtitle: "Submit utility, mortgage, tax, and airtime funding requests.",
      icon: <FiPhone />,
      path: "/bills-airtime",
    },
    {
      title: "Support",
      subtitle: "Open tickets and reply to ongoing support conversations.",
      icon: <FiHeadphones />,
      path: "/support",
    },
  ];

  return (
    <main className={styles.page}>
      <GlassToast toasts={toasts} onDismiss={dismissToast} />

      <section className={styles.shell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
            <FiArrowLeft />
          </button>
          <div>
            <span><FiMoreHorizontal /></span>
            <h1>More</h1>
          </div>
          <button
            className={styles.mobileSettingsButton}
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            <FiSettings />
          </button>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Account</h2>
              <p>Open the pages you need for profile, verification, and security.</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.preloaderBlock}>
              <span />
              <strong>Loading account menu...</strong>
            </div>
          ) : (
            <div className={styles.moreList}>
              {accountItems.map((item) => (
                <button
                  type="button"
                  className={styles.moreItem}
                  key={item.title}
                  onClick={() => navigate(item.path)}
                >
                  <div className={styles.moreItemIcon}>{item.icon}</div>
                  <div className={styles.moreItemBody}>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </div>
                  {item.status ? <span className={styles.moreStatus}>{item.status}</span> : <FiChevronRight />}
                </button>
              ))}
            </div>
          )}
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Banking Tools</h2>
              <p>Quick access to the other pages already available on your account.</p>
            </div>
          </div>

          <div className={styles.moreList}>
            {serviceItems.map((item) => (
              <button
                type="button"
                className={styles.moreItem}
                key={item.title}
                onClick={() => navigate(item.path)}
              >
                <div className={styles.moreItemIcon}>{item.icon}</div>
                <div className={styles.moreItemBody}>
                  <strong>{item.title}</strong>
                  <small>{item.subtitle}</small>
                </div>
                <FiChevronRight />
              </button>
            ))}
          </div>
        </section>
      </section>

      <MobileFooterNav />
      <UserSettingsDrawer
        open={settingsOpen}
        user={profile || userUser}
        displayName={displayName}
        theme={theme}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </main>
  );
}
