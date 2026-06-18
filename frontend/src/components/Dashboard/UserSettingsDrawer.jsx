import styles from "./UserSettingsDrawer.module.css";
import { useNavigate } from "react-router-dom";
import { Headphones, LogOut, ShieldCheck, UserRound, X } from "lucide-react";
import { resolveAsset } from "../../utils/assets";
import { ThemeToggle } from "../ui/theme-toggle";

export default function UserSettingsDrawer({
  open,
  user,
  displayName,
  theme,
  onClose,
  onToggleTheme,
  onLogout,
}) {
  const navigate = useNavigate();
  if (!open) return null;

  const navItems = [
    { title: "Profile", icon: <UserRound />, path: "/profile" },
    { title: "Security", icon: <ShieldCheck />, path: "/settings" },
    { title: "Support", icon: <Headphones />, path: "/support" },
  ];
  const profileImage = resolveAsset(user?.profile_image_url || "");

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.user}>
            <div className={styles.avatar}>
              {profileImage ? <img src={profileImage} alt={displayName} /> : displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{displayName}</strong>
              <span>{user?.email || "Personal banking"}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close settings">
            <X />
          </button>
        </div>

        <nav className={styles.nav} aria-label="Settings navigation">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.title}
              onClick={() => {
                onClose();
                navigate(item.path);
              }}
            >
              <span>{item.icon}</span>
              <strong>{item.title}</strong>
            </button>
          ))}

        </nav>

        <div className={styles.drawerActions}>
          <ThemeToggle isDark={theme === "dark"} onToggle={onToggleTheme} />

          <button type="button" className={styles.logoutButton} onClick={onLogout}>
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
