import styles from "./Admin.module.css";
import { API_ORIGIN } from "../../api/axios";
import LogoPreloader from "../../components/ui/LogoPreloader";

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

export function OverviewSkeleton() {
  return (
    <>
      <div className={styles.cards}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className={`${styles.card} ${styles.skeletonSurface}`} key={index}>
            <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonValue}`} />
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <section className={`${styles.panel} ${styles.skeletonSurface}`}>
          <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
          <div className={styles.skeletonStack}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className={styles.compactRow} key={index}>
                <div className={`${styles.skeletonLine} ${styles.skeletonRow}`} />
                <div className={`${styles.skeletonBadge} ${styles.skeletonLine}`} />
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.skeletonSurface}`}>
          <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonValue}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
        </section>
      </div>
    </>
  );
}

export function TableSkeleton({ title = "Loading...", columns = 5, rows = 6 }) {
  return (
    <section className={`${styles.panel} ${styles.skeletonSurface}`}>
      <LogoPreloader label={title} compact />
      <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
      <div className={styles.table}>
        <div className={styles.tableHead} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <span className={`${styles.skeletonLine} ${styles.skeletonHeadCell}`} key={index} />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div className={styles.tableRow} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} key={rowIndex}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <span className={`${styles.skeletonLine} ${styles.skeletonCell}`} key={colIndex} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function TransferSettingsSkeleton() {
  return (
    <div className={styles.settingsStack}>
      <LogoPreloader label="Loading transfer controls" />

      <div className={styles.transferControlGrid}>
        <section className={`${styles.panel} ${styles.skeletonSurface}`}>
          <div className={styles.settingsHeader}>
            <div className={styles.skeletonStack}>
              <div className={`${styles.skeletonBadgeWide} ${styles.skeletonLine}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
            </div>
          </div>

          <div className={styles.requirementActions}>
            <div className={`${styles.skeletonButtonWide} ${styles.skeletonLine}`} />
            <div className={`${styles.skeletonButtonWide} ${styles.skeletonLine}`} />
          </div>

          <div className={styles.codeControlList}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div className={styles.codeControlCard} key={index}>
                <div className={styles.compactRow}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonRow}`} />
                  <div className={`${styles.skeletonToggle} ${styles.skeletonLine}`} />
                </div>
                <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.panel} ${styles.skeletonSurface}`}>
          <div className={styles.settingsHeader}>
            <div className={styles.skeletonStack}>
              <div className={`${styles.skeletonBadgeWide} ${styles.skeletonLine}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
            </div>
          </div>

          <div className={styles.feeCardGrid}>
            {Array.from({ length: 2 }).map((_, index) => (
              <div className={styles.feeManageCard} key={index}>
                <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
                <div className={`${styles.skeletonLine} ${styles.skeletonValue}`} />
                <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
                <div className={`${styles.skeletonButtonWide} ${styles.skeletonLine}`} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <TableSkeleton title="Loading transfers" columns={7} rows={6} />
    </div>
  );
}

export function ApplicationListSkeleton({ items = 3 }) {
  return (
    <section className={`${styles.panel} ${styles.skeletonSurface}`}>
      <div className={styles.sectionHeader}>
        <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
        <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
      </div>
      <div className={styles.applicationList}>
        {Array.from({ length: items }).map((_, index) => (
          <article className={`${styles.application} ${styles.skeletonSurface}`} key={index}>
            <div className={styles.applicationMain}>
              <div className={styles.skeletonStack}>
                <div className={styles.nameLine}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonRow}`} />
                  <div className={`${styles.skeletonBadge} ${styles.skeletonLine}`} />
                </div>
                <div className={styles.metaGrid}>
                  {Array.from({ length: 8 }).map((__, metaIndex) => (
                    <div className={`${styles.skeletonLine} ${styles.skeletonCell}`} key={metaIndex} />
                  ))}
                </div>
              </div>
              <div className={styles.actions}>
                <div className={`${styles.skeletonButton} ${styles.skeletonLine}`} />
                <div className={`${styles.skeletonButton} ${styles.skeletonLine}`} />
              </div>
            </div>
            <div className={styles.documents}>
              {Array.from({ length: 3 }).map((__, docIndex) => (
                <div className={styles.skeletonDocument} key={docIndex}>
                  <div className={`${styles.skeletonThumb} ${styles.skeletonLine}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function WalletSkeleton({ items = 4 }) {
  return (
    <section className={`${styles.panel} ${styles.skeletonSurface}`}>
      <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
      <div className={styles.walletGrid}>
        {Array.from({ length: items }).map((_, index) => (
          <article className={`${styles.walletCard} ${styles.skeletonSurface}`} key={index}>
            <div className={`${styles.skeletonThumb} ${styles.skeletonLine}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonRow}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
          </article>
        ))}
      </div>
    </section>
  );
}

export function SettingsSkeleton() {
  return (
    <div className={styles.settingsStack}>
      <LogoPreloader label="Loading admin settings" />
      {Array.from({ length: 4 }).map((_, index) => (
        <section className={`${styles.panel} ${styles.skeletonSurface}`} key={index}>
          <div className={styles.settingsHeader}>
            <div className={styles.skeletonStack}>
              <div className={`${styles.skeletonBadgeWide} ${styles.skeletonLine}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonHeading}`} />
              <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
            </div>
          </div>
          {index === 0 ? (
            <div className={styles.profileCard}>
              <div className={styles.profileMedia}>
                <div className={`${styles.profileFallback} ${styles.skeletonLine}`} />
                <div className={styles.profileMeta}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonRow}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonMeta}`} />
                </div>
              </div>
              <div className={styles.settingsForm}>
                <div className={styles.settingsFormGrid}>
                  {Array.from({ length: 4 }).map((__, fieldIndex) => (
                    <div className={styles.field} key={fieldIndex}>
                      <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
                      <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
                    </div>
                  ))}
                </div>
                <div className={styles.formActions}>
                  <div className={`${styles.skeletonButtonWide} ${styles.skeletonLine}`} />
                </div>
              </div>
            </div>
          ) : index === 2 ? (
            <div className={styles.operationalGrid}>
              {Array.from({ length: 5 }).map((__, fieldIndex) => (
                <div className={fieldIndex < 3 ? styles.requirementCard : styles.feeManageCard} key={fieldIndex}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonValue}`} />
                  {fieldIndex < 3 ? (
                    <div className={`${styles.skeletonToggle} ${styles.skeletonLine}`} />
                  ) : (
                    <>
                      <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
                      <div className={`${styles.skeletonButtonWide} ${styles.skeletonLine}`} />
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : index === 3 ? (
            <div className={styles.codeCardsGrid}>
              {Array.from({ length: 3 }).map((__, fieldIndex) => (
                <div className={styles.codeValueCard} key={fieldIndex}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonValue}`} />
                  <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.settingsForm}>
              <div className={styles.settingsFormGrid}>
                {Array.from({ length: 4 }).map((__, fieldIndex) => (
                  <div className={styles.field} key={fieldIndex}>
                    <div className={`${styles.skeletonLine} ${styles.skeletonLabel}`} />
                    <div className={`${styles.skeletonField} ${styles.skeletonLine}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
