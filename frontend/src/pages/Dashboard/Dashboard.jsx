import styles from "./Dashboard.module.css";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const displayName =
    userUser?.full_name || userUser?.name || userUser?.username || "User";

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  const quickTransfers = [
    { name: "John", short: "J", account: "65318" },
    { name: "Sarah", short: "S", account: "48741" },
    { name: "Daniel", short: "D", account: "27400" },
    { name: "Amara", short: "A", account: "53518" },
  ];

  const transactions = [
    {
      id: "TRX-00092323",
      title: "Transfer to John",
      subtitle: "Bank transfer",
      date: "25 Mar, 2026",
      amount: "-₦25,000",
      status: "Completed",
    },
    {
      id: "TRX-00092324",
      title: "Salary Credit",
      subtitle: "Monthly salary",
      date: "24 Mar, 2026",
      amount: "+₦450,000",
      status: "Completed",
    },
    {
      id: "TRX-00092325",
      title: "Airtime Purchase",
      subtitle: "MTN top-up",
      date: "23 Mar, 2026",
      amount: "-₦2,000",
      status: "Pending",
    },
    {
      id: "TRX-00092326",
      title: "Netflix Subscription",
      subtitle: "Card payment",
      date: "22 Mar, 2026",
      amount: "-₦6,500",
      status: "Completed",
    },
  ];

  return (
    <div className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandLogo}>S</div>
          <div>
            <h2 className={styles.brandTitle}>Stercxa</h2>
            <p className={styles.brandSubtitle}>Banking Dashboard</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>General</p>

          <button className={`${styles.navItem} ${styles.activeNavItem}`}>
            <span className={styles.navIcon}>▦</span>
            <span>Dashboard</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>⇄</span>
            <span>Payments</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>💳</span>
            <span>Cards</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>🧾</span>
            <span>Invoices</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>📈</span>
            <span>Insights</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>🎁</span>
            <span>Rewards</span>
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            className={`${styles.bottomLink} ${styles.logoutLink}`}
            type="button"
            onClick={handleLogout}
          >
            <span className={styles.navIcon}>↩</span>
            <span>Logout</span>
          </button>

          <div className={styles.themeSwitch}>
            <button
              className={`${styles.themeBtn} ${
                theme === "light" ? styles.activeThemeBtn : ""
              }`}
              onClick={theme === "dark" ? toggleTheme : undefined}
              type="button"
            >
              Light
            </button>

            <button
              className={`${styles.themeBtn} ${
                theme === "dark" ? styles.activeThemeBtn : ""
              }`}
              onClick={theme === "light" ? toggleTheme : undefined}
              type="button"
            >
              Dark
            </button>
          </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarIdentity}>
            <div className={styles.profileAvatar}>
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className={styles.pageEyebrow}>Overview</p>
              <h1 className={styles.pageTitle}>Welcome back, {displayName}</h1>
            </div>
          </div>

          <div className={styles.topbarActions}>
            <button className={styles.iconAction} type="button" aria-label="Settings" title="Settings">
              ⚙
            </button>
            <button
              className={styles.iconAction}
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? "☼" : "◐"}
            </button>
            <button className={styles.topActionGhost}>Request</button>
            <button className={styles.topActionGhost}>Topup</button>
            <button className={styles.topActionPrimary}>Move Money</button>
          </div>
        </header>

        <section className={styles.heroGrid}>
          <div className={styles.balancePanel}>
            <p className={styles.panelLabel}>Total Balance</p>
            <h2 className={styles.balanceAmount}>₦450,000</h2>

            <div className={styles.balanceActions}>
              <button className={styles.smallActionPrimary}>Send</button>
              <button className={styles.smallAction}>Request</button>
              <button className={styles.smallAction}>Topup</button>
            </div>
          </div>

          <div className={styles.quickPanel}>
            <div className={styles.panelHead}>
              <h3>Quick Transfer</h3>
              <button className={styles.miniLink}>View all</button>
            </div>

            <div className={styles.quickUsers}>
              <button className={styles.addTransferCard}>
                <span className={styles.addCircle}>＋</span>
                <span>Add</span>
              </button>

              {quickTransfers.map((person) => (
                <div className={styles.quickUserCard} key={person.account}>
                  <div className={styles.quickUserAvatar}>{person.short}</div>
                  <strong>{person.name}</strong>
                  <span>{person.account}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHead}>
              <h3>Total Income</h3>
              <span className={styles.statTag}>+23%</span>
            </div>
            <h2>₦824,521</h2>
            <div className={styles.chartBars}>
              <span style={{ height: "32%" }}></span>
              <span style={{ height: "54%" }}></span>
              <span style={{ height: "78%" }}></span>
              <span style={{ height: "45%" }}></span>
              <span style={{ height: "62%" }}></span>
              <span style={{ height: "28%" }}></span>
              <span style={{ height: "86%" }}></span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHead}>
              <h3>Total Spent</h3>
              <span className={styles.statTagMuted}>-8%</span>
            </div>
            <h2>₦117,254</h2>
            <div className={styles.chartBars}>
              <span style={{ height: "24%" }}></span>
              <span style={{ height: "48%" }}></span>
              <span style={{ height: "66%" }}></span>
              <span style={{ height: "38%" }}></span>
              <span style={{ height: "56%" }}></span>
              <span style={{ height: "44%" }}></span>
              <span style={{ height: "72%" }}></span>
            </div>
          </div>
        </section>

        <section className={styles.contentGrid}>
          <div className={styles.transactionsPanel}>
            <div className={styles.panelHead}>
              <h3>Transaction History</h3>
              <div className={styles.tableFilters}>
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search transaction"
                />
                <button className={styles.filterBtn}>Last 30 days</button>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <div className={styles.tableHeader}>
                <span>Reference</span>
                <span>Transaction</span>
                <span>Date</span>
                <span>Amount</span>
                <span>Status</span>
              </div>

              {transactions.map((item) => (
                <div className={styles.tableRow} key={item.id}>
                  <span className={styles.refText}>{item.id}</span>

                  <div className={styles.transactionMeta}>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </div>

                  <span>{item.date}</span>

                  <span
                    className={
                      item.amount.startsWith("-")
                        ? styles.amountOut
                        : styles.amountIn
                    }
                  >
                    {item.amount}
                  </span>

                  <span
                    className={
                      item.status === "Completed"
                        ? styles.statusSuccess
                        : styles.statusPending
                    }
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.rightPanel}>
            <div className={styles.bankCardBox}>
              <div className={styles.cardTopRow}>
                <span>Stercxa</span>
                <span>VISA</span>
              </div>

              <div className={styles.cardHolderBlock}>
                <small>Card Holder</small>
                <strong>{displayName}</strong>
              </div>

              <div className={styles.cardDigits}>1253 5432 3521 3090</div>

              <div className={styles.cardBottomRow}>
                <div>
                  <small>EXP</small>
                  <strong>09/24</strong>
                </div>

                <div>
                  <small>CVV</small>
                  <strong>341</strong>
                </div>
              </div>
            </div>

            <div className={styles.sideWidget}>
              <div className={styles.panelHead}>
                <h3>Conversion Rate</h3>
              </div>

              <div className={styles.convertBox}>
                <label>Amount</label>
                <div className={styles.convertInputRow}>
                  <input type="text" value="238" readOnly />
                  <select defaultValue="USD">
                    <option>USD</option>
                    <option>NGN</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>

                <div className={styles.convertInputRow}>
                  <input type="text" value="222.13" readOnly />
                  <select defaultValue="EUR">
                    <option>EUR</option>
                    <option>USD</option>
                    <option>NGN</option>
                    <option>GBP</option>
                  </select>
                </div>

                <button className={styles.convertBtn}>Convert →</button>
              </div>
            </div>

            <div className={styles.sideWidget}>
              <div className={styles.panelHead}>
                <h3>Workflows</h3>
              </div>

              <div className={styles.workflowCardPrimary}>
                <div>
                  <strong>Transactions</strong>
                  <p>Auto Block</p>
                </div>
                <span>›</span>
              </div>

              <div className={styles.workflowCard}>
                <div>
                  <strong>Create order</strong>
                  <p>Looks OK</p>
                </div>
                <span>›</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <nav className={styles.mobileGlassNav} aria-label="Mobile dashboard navigation">
        <button type="button" className={styles.mobileNavActive}>
          <span>▦</span>
          <strong>Home</strong>
        </button>
        <button type="button">
          <span>⇄</span>
          <strong>Pay</strong>
        </button>
        <button type="button">
          <span>💳</span>
          <strong>Cards</strong>
        </button>
        <button type="button">
          <span>⚙</span>
          <strong>Settings</strong>
        </button>
        <button type="button" onClick={handleLogout}>
          <span>↩</span>
          <strong>Logout</strong>
        </button>
      </nav>
    </div>
  );
}
