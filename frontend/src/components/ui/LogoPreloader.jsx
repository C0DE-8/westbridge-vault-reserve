import styles from "./LogoPreloader.module.css";

const DEFAULT_LOGO = "/westbridge-assets/images/favicon-wg.png";

export default function LogoPreloader({ label = "Loading", compact = false }) {
  return (
    <div className={`${styles.preloader} ${compact ? styles.compact : ""}`} role="status" aria-live="polite">
      <img src={DEFAULT_LOGO} alt="" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
