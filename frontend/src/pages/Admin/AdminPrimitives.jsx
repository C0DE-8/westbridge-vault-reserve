import styles from "./Admin.module.css";
import { API_ORIGIN } from "../../api/axios";

export const resolveAsset = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_ORIGIN}${url}`;
};

export function StatusBadge({ status }) {
  return (
    <span className={`${styles.status} ${styles[String(status || "").toLowerCase()] || ""}`}>
      {status || "unknown"}
    </span>
  );
}

export function DataTable({ headers, children }) {
  return (
    <div className={styles.table}>
      <div
        className={styles.tableHead}
        style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
      >
        {headers.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ children = "No records found." }) {
  return <div className={styles.emptyState}>{children}</div>;
}
