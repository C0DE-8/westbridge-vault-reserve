import { Moon, Sun } from "lucide-react";
import styles from "./theme-toggle.module.css";

export function ThemeToggle({ className = "", isDark = false, onToggle }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle?.();
    }
  };

  return (
    <div
      className={`${styles.toggle} ${isDark ? styles.dark : styles.light} ${className}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={isDark}
      tabIndex={0}
    >
      <div className={styles.track}>
        <div className={styles.knob}>
          {isDark ? <Moon strokeWidth={1.5} /> : <Sun strokeWidth={1.5} />}
        </div>
        <div className={styles.ghostIcon}>
          {isDark ? <Sun strokeWidth={1.5} /> : <Moon strokeWidth={1.5} />}
        </div>
      </div>
    </div>
  );
}
