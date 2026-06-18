import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowDownRight,
  FiArrowLeft,
  FiArrowUpRight,
  FiBarChart2,
  FiCreditCard,
  FiFileText,
  FiRefreshCcw,
  FiSettings,
} from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import styles from "./FinancePages.module.css";

const filters = [
  { key: "all", label: "All" },
  { key: "inflow", label: "Inflow" },
  { key: "outflow", label: "Outflow" },
  { key: "bills", label: "Bills" },
];
const ITEMS_PER_PAGE = 8;

export default function StatementsPage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(userUser);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const displayName = profile?.full_name || profile?.username || "User";
  const currencySign = profile?.currency_sign || "$";

  const formatMoney = (value) =>
    `${currencySign}${Math.abs(Number(value || 0)).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  useEffect(() => {
    let mounted = true;

    async function loadStatement() {
      try {
        setLoading(true);

        const requests = await Promise.allSettled([
          axiosInstance.get("/user/profile"),
          axiosInstance.get("/user/deposits"),
          axiosInstance.get("/user/bill-payments"),
          axiosInstance.get("/user/transfer/self/history"),
          axiosInstance.get("/user/transfer/history/local"),
          axiosInstance.get("/user/transfer/history/wire"),
        ]);

        if (!mounted) return;

        const [
          profileRes,
          depositsRes,
          billsRes,
          selfRes,
          localRes,
          wireRes,
        ] = requests;

        if (profileRes.status === "fulfilled") {
          setProfile(profileRes.value.data?.user || userUser);
        }

        const deposits = depositsRes.status === "fulfilled" ? depositsRes.value.data?.deposits || [] : [];
        const bills = billsRes.status === "fulfilled" ? billsRes.value.data?.payments || [] : [];
        const selfTransfers = selfRes.status === "fulfilled" ? selfRes.value.data?.history || [] : [];
        const localTransfers = localRes.status === "fulfilled" ? localRes.value.data?.history || [] : [];
        const wireTransfers = wireRes.status === "fulfilled" ? wireRes.value.data?.wire_history || [] : [];

        const normalized = [
          ...deposits.map((item) => ({
            id: `deposit-${item.id}`,
            title: item.deposit_type === "topup_account" ? "Account funding" : "Deposit review",
            subtitle: item.account_type ? `${item.account_type} account` : "Deposit",
            amount: Number(item.amount || 0),
            direction: "inflow",
            category: "deposit",
            date: item.created_at || "",
            status: item.status || "pending",
          })),
          ...bills.map((item) => ({
            id: `bill-${item.id}`,
            title: item.provider_name,
            subtitle: item.payment_kind === "airtime" ? "Airtime" : `Bill • ${item.bill_category}`,
            amount: -Math.abs(Number(item.amount || 0)),
            direction: "outflow",
            category: "bill",
            date: item.created_at || "",
            status: item.status || "pending",
          })),
          ...selfTransfers.map((item) => ({
            id: `self-${item.id}`,
            title: "Between my accounts",
            subtitle: `${item.from_account || "Account"} to ${item.to_account || "account"}`,
            amount: Number(item.amount || 0),
            direction: "internal",
            category: "self",
            date: item.date || item.created_at || "",
            status: item.status || "completed",
          })),
          ...localTransfers.map((item) => ({
            id: `local-${item.id}`,
            title: item.account_name || "Local transfer",
            subtitle: item.bank_name || item.reason || "Local transfer",
            amount: item.entry_type === "credit" ? Math.abs(Number(item.amount || 0)) : -Math.abs(Number(item.amount || 0)),
            direction: item.entry_type === "credit" ? "inflow" : "outflow",
            category: "local",
            date: item.date || item.created_at || "",
            status: item.status || "processing",
          })),
          ...wireTransfers.map((item) => ({
            id: `wire-${item.id}`,
            title: item.account_name || "Wire transfer",
            subtitle: item.bank_name || item.reason || "Wire transfer",
            amount: item.entry_type === "credit" ? Math.abs(Number(item.amount || 0)) : -Math.abs(Number(item.amount || 0)),
            direction: item.entry_type === "credit" ? "inflow" : "outflow",
            category: "wire",
            date: item.date || item.created_at || "",
            status: item.status || "processing",
          })),
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setEvents(normalized);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadStatement();
    return () => {
      mounted = false;
    };
  }, [userUser]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "inflow") return events.filter((item) => item.direction === "inflow");
    if (activeFilter === "outflow") return events.filter((item) => item.direction === "outflow");
    if (activeFilter === "bills") return events.filter((item) => item.category === "bill");
    return events;
  }, [activeFilter, events]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const summary = useMemo(() => {
    return events.reduce(
      (acc, item) => {
        if (item.direction === "inflow") acc.inflow += Math.abs(item.amount);
        if (item.direction === "outflow") acc.outflow += Math.abs(item.amount);
        if (item.direction === "internal") acc.internal += Math.abs(item.amount);
        if (item.category === "bill") acc.bills += Math.abs(item.amount);
        return acc;
      },
      { inflow: 0, outflow: 0, internal: 0, bills: 0 }
    );
  }, [events]);

  const bars = useMemo(() => {
    const groups = [
      { key: "Deposits", value: summary.inflow, tone: "blue" },
      { key: "Transfers out", value: summary.outflow, tone: "red" },
      { key: "Bills", value: summary.bills, tone: "violet" },
      { key: "Internal", value: summary.internal, tone: "teal" },
    ];
    const max = Math.max(...groups.map((item) => item.value), 1);
    return groups.map((item) => ({ ...item, width: `${(item.value / max) * 100}%` }));
  }, [summary]);

  const circleSegments = useMemo(() => {
    const groups = [
      { key: "Deposits", value: summary.inflow, tone: "var(--chart-blue)" },
      { key: "Transfers out", value: summary.outflow, tone: "var(--chart-red)" },
      { key: "Bills", value: summary.bills, tone: "var(--chart-violet)" },
      { key: "Internal", value: summary.internal, tone: "var(--chart-teal)" },
    ].filter((item) => item.value > 0);

    const total = groups.reduce((sum, item) => sum + item.value, 0);
    if (!total) {
      return {
        total,
        css: "conic-gradient(rgba(148, 163, 184, 0.18) 0deg 360deg)",
        legend: [],
      };
    }

    let start = 0;
    const legend = groups.map((item) => {
      const percent = (item.value / total) * 100;
      const degrees = (item.value / total) * 360;
      const segment = {
        ...item,
        percent,
        start,
        end: start + degrees,
      };
      start += degrees;
      return segment;
    });

    return {
      total,
      css: `conic-gradient(${legend
        .map((item) => `${item.tone} ${item.start}deg ${item.end}deg`)
        .join(", ")})`,
      legend,
    };
  }, [summary]);

  const monthly = useMemo(() => {
    const map = new Map();
    events.forEach((item) => {
      const date = new Date(item.date || Date.now());
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!map.has(key)) {
        map.set(key, {
          label: date.toLocaleString(undefined, { month: "short" }),
          inflow: 0,
          outflow: 0,
        });
      }
      const bucket = map.get(key);
      if (item.direction === "inflow") bucket.inflow += Math.abs(item.amount);
      if (item.direction === "outflow") bucket.outflow += Math.abs(item.amount);
    });

    const values = Array.from(map.values()).slice(0, 6).reverse();
    const max = Math.max(1, ...values.flatMap((item) => [item.inflow, item.outflow]));
    return values.map((item) => ({
      ...item,
      inflowHeight: `${(item.inflow / max) * 100}%`,
      outflowHeight: `${(item.outflow / max) * 100}%`,
    }));
  }, [events]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredEvents]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
            <FiArrowLeft />
          </button>
          <div>
            <span><FiFileText /></span>
            <h1>Statements</h1>
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

        <section className={styles.heroPanel}>
          <div>
            <span className={styles.eyebrow}>Account summary</span>
            <h2>Cash movement across your account</h2>
            <p>Review deposits, bills, self transfers, local transfers, and wire activity in one statement view.</p>
          </div>
          <div className={styles.heroMeta}>
            <FiBarChart2 />
            <span>{events.length} entries</span>
          </div>
        </section>

        {loading ? (
          <div className={styles.preloaderBlock}>
            <span />
            <strong>Loading statement...</strong>
          </div>
        ) : (
          <>
            <section className={styles.summaryGrid}>
              <article className={styles.summaryCard}>
                <span>Total inflow</span>
                <strong>{formatMoney(summary.inflow)}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Total outflow</span>
                <strong>{formatMoney(summary.outflow)}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Bills paid</span>
                <strong>{formatMoney(summary.bills)}</strong>
              </article>
              <article className={styles.summaryCard}>
                <span>Internal movement</span>
                <strong>{formatMoney(summary.internal)}</strong>
              </article>
            </section>

            <section className={styles.gridTwo}>
              <article className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2>Volume chart</h2>
                    <p>Monthly inflow versus outgoing volume.</p>
                  </div>
                </div>
                {monthly.length === 0 ? (
                  <p className={styles.empty}>No chart data yet.</p>
                ) : (
                  <div className={styles.chartBars}>
                    {monthly.map((item) => (
                      <div className={styles.chartMonth} key={item.label}>
                        <div className={styles.chartColumns}>
                          <span className={styles.chartInflow} style={{ height: item.inflowHeight }} />
                          <span className={styles.chartOutflow} style={{ height: item.outflowHeight }} />
                        </div>
                        <small>{item.label}</small>
                      </div>
                    ))}
                  </div>
                )}
              </article>

              <article className={styles.panel}>
                <div className={styles.panelHead}>
                  <div>
                    <h2>Category summary</h2>
                    <p>How activity is distributed across transaction types.</p>
                  </div>
                </div>
                <div className={styles.circleSummary}>
                  <div className={styles.circleChartWrap}>
                    <div
                      className={styles.circleChart}
                      style={{ "--circle-chart": circleSegments.css }}
                    >
                      <div className={styles.circleChartInner}>
                        <strong>{events.length}</strong>
                        <small>Entries</small>
                      </div>
                    </div>
                  </div>
                  <div className={styles.barList}>
                    {bars.map((item) => (
                      <div className={styles.barRow} key={item.key}>
                        <div className={styles.barCopy}>
                          <strong>{item.key}</strong>
                          <small>{formatMoney(item.value)}</small>
                        </div>
                        <div className={styles.barTrack}>
                          <span className={`${styles.barFill} ${styles[`barFill${item.tone}`]}`} style={{ width: item.width }} />
                        </div>
                      </div>
                    ))}
                    <div className={styles.circleLegend}>
                      {circleSegments.legend.map((item) => (
                        <div className={styles.circleLegendRow} key={item.key}>
                          <span className={styles.circleLegendDot} style={{ "--legend-color": item.tone }} />
                          <strong>{item.key}</strong>
                          <small>{item.percent.toFixed(0)}%</small>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Statement entries</h2>
                  <p>Every transfer, bill payment, and deposit on your account.</p>
                </div>
                <div className={styles.filterRow}>
                  {filters.map((filter) => (
                    <button
                      type="button"
                      key={filter.key}
                      className={activeFilter === filter.key ? styles.filterActive : ""}
                      onClick={() => setActiveFilter(filter.key)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <p className={styles.empty}>No entries in this view.</p>
              ) : (
                <>
                  <div className={styles.listStack}>
                    {paginatedEvents.map((item) => (
                      <article className={styles.statementRow} key={item.id}>
                        <span className={styles.statementIcon}>
                          {item.direction === "inflow" ? (
                            <FiArrowDownRight />
                          ) : item.direction === "internal" ? (
                            <FiRefreshCcw />
                          ) : item.category === "bill" ? (
                            <FiCreditCard />
                          ) : (
                            <FiArrowUpRight />
                          )}
                        </span>
                        <div>
                          <strong>{item.title}</strong>
                          <small>{item.subtitle} • {item.date}</small>
                        </div>
                        <div className={styles.rowRight}>
                          <b className={item.direction === "inflow" ? styles.amountPositive : item.direction === "outflow" ? styles.amountNegative : ""}>
                            {item.direction === "outflow" ? "-" : item.direction === "inflow" ? "+" : ""}{formatMoney(item.amount)}
                          </b>
                          <small>{item.status}</small>
                        </div>
                      </article>
                    ))}
                  </div>

                  {totalPages > 1 ? (
                    <div className={styles.pagination}>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <span>Page {currentPage} of {totalPages}</span>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </section>
          </>
        )}
      </section>

      <MobileFooterNav />
      <UserSettingsDrawer
        open={settingsOpen}
        user={profile}
        displayName={displayName}
        theme={theme}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </main>
  );
}
