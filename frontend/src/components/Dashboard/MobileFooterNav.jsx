import styles from "./MobileFooterNav.module.css";
import { NavLink, useLocation } from "react-router-dom";
import { FiCreditCard, FiFileText, FiHome, FiMoreHorizontal } from "react-icons/fi";

export default function MobileFooterNav() {
  const location = useLocation();
  const items = [
    { to: "/dashboard", label: "Home", icon: <FiHome /> },
    { to: "/cards", label: "Cards", icon: <FiCreditCard /> },
    {
      to: "/transactions",
      label: "Transactions",
      icon: <FiFileText />,
      matches: ["/transactions", "/transaction-history", "/transfer"],
    },
    { to: "/more", label: "More", icon: <FiMoreHorizontal /> },
  ];
  const isItemActive = (item) =>
    item.matches
      ? item.matches.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))
      : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => isItemActive(item))
  );

  return (
    <nav
      className={styles.footer}
      aria-label="Mobile dashboard navigation"
      style={{
        "--active-index": activeIndex,
        "--active-offset": `${activeIndex * 100}%`,
        "--active-gap-offset": `${activeIndex * 6}px`,
      }}
    >
      <span className={styles.activeFill} aria-hidden="true" />
      {items.map((item) => {
        return (
          <NavLink
            className={() => `${styles.navItem} ${isItemActive(item) ? styles.active : ""}`}
            to={item.to}
            key={item.to}
          >
            <span className={styles.iconShell}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
