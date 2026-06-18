import styles from "./Dashboard.module.css";
import { useEffect, useRef, useState } from "react";
import {
  FiCreditCard,
  FiDownload,
  FiEye,
  FiEyeOff,
  FiFileText,
  FiPhone,
  FiPlus,
  FiRepeat,
  FiSend,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { resolveAsset } from "../../utils/assets";

const BRAND_LOGO = "/westbridge-assets/images/favicon-wg.png";
const DEFAULT_BANK_NAME = "West Bridge Vault Reserve";

export default function Dashboard() {
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(userUser);
  const [profileLoading, setProfileLoading] = useState(!userUser);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeAccountIndex, setActiveAccountIndex] = useState(0);
  const [accountSwapDirection, setAccountSwapDirection] = useState("next");
  const [touchStartX, setTouchStartX] = useState(null);
  const [bankName, setBankName] = useState(DEFAULT_BANK_NAME);
  const accountSwipeHandledRef = useRef(false);

  const displayName =
    profile?.full_name || profile?.name || profile?.username || "User";
  const currencySign = profile?.currency_sign || "$";
  const accountNumber = profile?.account_number || "Pending account";
  const savingsBalance = Number(profile?.savings_balance || 0);
  const currentBalance = Number(profile?.current_balance || 0);
  const totalBalance = savingsBalance + currentBalance;
  const profileImage = resolveAsset(profile?.profile_image_url || "");

  const formatMoney = (value) =>
    `${currencySign}${Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  const displayMoney = (value) => (balanceVisible ? formatMoney(value) : "******");
  const maskAccountNumber = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits ? `••••${digits.slice(-4)}` : "Pending";
  };
  const parseAmount = (value) => {
    if (typeof value === "number") return value;
    const amount = Number(String(value || "0").replace(/[^\d.-]/g, ""));
    return Number.isFinite(amount) ? amount : 0;
  };

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setProfileLoading(true);
        const res = await axiosInstance.get("/user/profile");
        if (active) setProfile(res.data?.user || userUser);
      } catch {
        if (active) setProfile(userUser);
      } finally {
        if (active) setProfileLoading(false);
      }
    }

    loadProfile();
    return () => {
      active = false;
    };
  }, [userUser]);

  useEffect(() => {
    let active = true;

    async function loadBankName() {
      try {
        const res = await axiosInstance.get("/user/settings/bank-name");
        if (active) setBankName(res.data?.bank_name || DEFAULT_BANK_NAME);
      } catch {
        if (active) setBankName(DEFAULT_BANK_NAME);
      }
    }

    loadBankName();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      try {
        setTransactionsLoading(true);
        const [localRes, wireRes, selfRes] = await Promise.allSettled([
          axiosInstance.get("/user/transfer/history/local"),
          axiosInstance.get("/user/transfer/history/wire"),
          axiosInstance.get("/user/transfer/self/history"),
        ]);

        if (!active) return;

        const localHistory =
          localRes.status === "fulfilled" ? localRes.value.data?.history || [] : [];
        const wireHistory =
          wireRes.status === "fulfilled" ? wireRes.value.data?.wire_history || [] : [];
        const selfHistory =
          selfRes.status === "fulfilled" ? selfRes.value.data?.history || [] : [];

        const normalized = [...localHistory, ...wireHistory, ...selfHistory]
          .map((item) => {
            const amount = parseAmount(item.amount);
            const isCredit = item.entry_type === "credit";
            const title =
              item.account_name ||
              item.bank_name ||
              (item.to_account ? "Self transfer" : "Transfer");
            const transferBank = item.bank_name || (item.to_account ? bankName : "");

            return {
              id: `${item.type || "self"}-${item.id}`,
              title,
              subtitle: transferBank || item.reason || item.from_account || "Banking transaction",
              bank_name: transferBank,
              date: item.date || item.created_at || "",
              value: isCredit ? Math.abs(amount) : -Math.abs(amount),
              status: item.status || "Completed",
            };
          })
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);

        setRecentTransactions(normalized);
      } catch {
        if (active) setRecentTransactions([]);
      } finally {
        if (active) setTransactionsLoading(false);
      }
    }

    loadTransactions();
    return () => {
      active = false;
    };
  }, [bankName]);

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
      value: -25000,
      status: "Completed",
    },
    {
      id: "TRX-00092324",
      title: "Salary Credit",
      subtitle: "Monthly salary",
      date: "24 Mar, 2026",
      value: 450000,
      status: "Completed",
    },
    {
      id: "TRX-00092325",
      title: "Airtime Purchase",
      subtitle: "MTN top-up",
      date: "23 Mar, 2026",
      value: -2000,
      status: "Pending",
    },
    {
      id: "TRX-00092326",
      title: "Netflix Subscription",
      subtitle: "Card payment",
      date: "22 Mar, 2026",
      value: -6500,
      status: "Completed",
    },
  ];
  const shownTransactions = recentTransactions.length ? recentTransactions : transactions;
  const mobileTransactions = recentTransactions.slice(0, 4);
  const accountCards = [
    {
      type: "Savings Account",
      label: "Savings balance",
      balance: savingsBalance,
      number: profile?.s_account_number || accountNumber,
      marker: "Save",
    },
    {
      type: "Current Account",
      label: "Daily spending",
      balance: currentBalance,
      number: profile?.c_account_number || accountNumber,
      marker: "Acct",
    },
  ];
  const activeAccount = accountCards[activeAccountIndex] || accountCards[0];
  const productItems = [
    { label: "Bills & Airtime", path: "/bills-airtime", icon: <FiPhone /> },
    { label: "Statements", path: "/statements", icon: <FiFileText /> },
    { label: "Cards", path: "/cards", icon: <FiCreditCard /> },
    { label: "Loans", path: "/loans", icon: <FiTrendingUp /> },
  ];
  const showNextAccount = () => {
    setAccountSwapDirection("next");
    setActiveAccountIndex((current) => (current === 0 ? 1 : 0));
  };
  const showAccount = (index) => {
    setAccountSwapDirection(index > activeAccountIndex ? "next" : "prev");
    setActiveAccountIndex(index);
  };
  const handleAccountTouchEnd = (event) => {
    if (touchStartX === null) return;
    const deltaX = touchStartX - event.changedTouches[0].clientX;
    if (Math.abs(deltaX) > 36) {
      accountSwipeHandledRef.current = true;
      setAccountSwapDirection(deltaX > 0 ? "next" : "prev");
      setActiveAccountIndex((current) => (current === 0 ? 1 : 0));
    }
    setTouchStartX(null);
  };
  const handleAccountClick = () => {
    if (accountSwipeHandledRef.current) {
      accountSwipeHandledRef.current = false;
      return;
    }
    showNextAccount();
  };

  return (
    <div className={styles.dashboardPage}>
      <aside className={styles.sidebar}>
        <div className={styles.brandBlock}>
          <div className={styles.brandLogo}>
            <img src={BRAND_LOGO} alt="West Bridge Vault Reserve" />
          </div>
          <div>
            <h2 className={styles.brandTitle}>West Bridge</h2>
            <p className={styles.brandSubtitle}>Banking Dashboard</p>
          </div>
        </div>

        <nav className={styles.nav}>
          <p className={styles.navLabel}>General</p>

          <button className={`${styles.navItem} ${styles.activeNavItem}`}>
            <span className={styles.navIcon}>Home</span>
            <span>Dashboard</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>Pay</span>
            <span>Payments</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>Card</span>
            <span>Cards</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>Bill</span>
            <span>Invoices</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>Data</span>
            <span>Insights</span>
          </button>

          <button className={styles.navItem}>
            <span className={styles.navIcon}>More</span>
            <span>More</span>
          </button>
        </nav>

        <div className={styles.sidebarBottom}>
          <button
            className={`${styles.bottomLink} ${styles.logoutLink}`}
            type="button"
            onClick={handleLogout}
          >
            <span className={styles.navIcon}>Exit</span>
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
        <section className={styles.mobileDashboard}>
          <header className={styles.mobileTopbar}>
            <button className={styles.mobileIdentity} type="button" onClick={() => navigate("/profile")}>
              <div className={styles.mobileAvatar}>
                {profileImage ? (
                  <img src={profileImage} alt={displayName} />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <span>{bankName}</span>
                <strong>{displayName}</strong>
              </div>
            </button>
            <button
              className={styles.mobileSettingsButton}
              type="button"
              onClick={() => setSettingsOpen(true)}
              aria-label="Open settings"
            >
              <FiSettings />
            </button>
          </header>

          <section className={styles.mobileBalanceCard}>
            <div className={styles.balanceLabelRow}>
              <span className={styles.balancePill}>Total Balance</span>
            </div>

            {profileLoading ? (
              <div className={`${styles.skeleton} ${styles.balanceSkeleton}`} />
            ) : (
              <div className={styles.mobileBalanceLine}>
                <h1 className={styles.mobileBalanceAmount}>
                  {displayMoney(totalBalance)}
                </h1>
                <button
                  className={styles.eyeButton}
                  type="button"
                  onClick={() => setBalanceVisible((current) => !current)}
                  aria-label={balanceVisible ? "Hide balance" : "Show balance"}
                >
                  {balanceVisible ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            )}
          </section>

          <section className={styles.mobileQuickActions} aria-label="Quick actions">
            {[
              [<FiPlus />, "Add Money"],
              [<FiSend />, "Send"],
              [<FiRepeat />, "Convert"],
            ].map(([icon, label]) => (
              <button
                className={styles.mobileQuickAction}
                type="button"
                key={label}
                onClick={() => {
                  if (label === "Add Money") navigate("/funding");
                  if (label === "Send") navigate("/transactions");
                  if (label === "Convert") navigate("/convert");
                }}
              >
                <span>{icon}</span>
                <strong>{label}</strong>
              </button>
            ))}
          </section>

          <section className={styles.mobileAccountsWrap}>
            {profileLoading ? (
              <div className={`${styles.mobileAccountCard} ${styles.mobileAccountSkeleton}`}>
                <div className={`${styles.skeleton} ${styles.lineSkeleton}`} />
                <div className={`${styles.skeleton} ${styles.amountSkeleton}`} />
                <div className={`${styles.skeleton} ${styles.lineSkeletonShort}`} />
              </div>
            ) : (
              <>
                <button
                  className={`${styles.mobileAccountCard} ${
                    accountSwapDirection === "next"
                      ? styles.accountSwapNext
                      : styles.accountSwapPrev
                  }`}
                  type="button"
                  key={activeAccount.type}
                  onClick={handleAccountClick}
                  onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
                  onTouchEnd={handleAccountTouchEnd}
                  aria-label={`Switch account. Showing ${activeAccount.type}`}
                >
                  <div className={styles.accountCardTop}>
                    <div>
                      <strong>{activeAccount.type}</strong>
                      <span>{activeAccount.label}</span>
                    </div>
                    <span className={styles.accountMarker}>{activeAccount.marker}</span>
                  </div>
                  <h2>{displayMoney(activeAccount.balance)}</h2>
                  <div className={styles.accountCardBottom}>
                    <span>{bankName}</span>
                    <strong>{maskAccountNumber(activeAccount.number)}</strong>
                  </div>
                </button>
                <div className={styles.accountSwitchDots} aria-hidden="true">
                  {accountCards.map((account, index) => (
                    <span
                      className={index === activeAccountIndex ? styles.activeAccountDot : ""}
                      key={account.type}
                    />
                  ))}
                </div>
              </>
            )}
          </section>

          <section className={styles.mobileSection}>
            <div className={styles.mobileSectionHead}>
              <h2>RECENT TRANSACTIONS</h2>
              <button type="button" onClick={() => navigate("/transaction-history")}>See all</button>
            </div>

            <div className={styles.mobileTransactionsCard}>
              {transactionsLoading ? (
                [0, 1, 2].map((item) => (
                  <div className={styles.mobileTransactionRow} key={item}>
                    <div className={`${styles.skeleton} ${styles.txnAvatarSkeleton}`} />
                    <div className={styles.mobileTxnMeta}>
                      <div className={`${styles.skeleton} ${styles.lineSkeleton}`} />
                      <div className={`${styles.skeleton} ${styles.lineSkeletonShort}`} />
                    </div>
                    <div className={`${styles.skeleton} ${styles.txnAmountSkeleton}`} />
                  </div>
                ))
              ) : mobileTransactions.length === 0 ? (
                <div className={styles.mobileEmptyState}>
                  No recent transactions yet.
                </div>
              ) : (
                mobileTransactions.map((item) => (
                  <div className={styles.mobileTransactionRow} key={item.id}>
                    <div className={styles.mobileTxnAvatar}>
                      {item.value < 0 ? <FiSend /> : <FiDownload />}
                    </div>
                    <div className={styles.mobileTxnMeta}>
                      <strong>{item.title}</strong>
                      <span>{item.bank_name || item.subtitle || item.date}</span>
                    </div>
                    <strong
                      className={
                        item.value < 0 ? styles.mobileAmountOut : styles.mobileAmountIn
                      }
                    >
                      {balanceVisible
                        ? item.value < 0
                          ? `-${formatMoney(Math.abs(item.value))}`
                          : `+${formatMoney(item.value)}`
                        : "******"}
                    </strong>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={styles.mobileSection}>
            <div className={styles.mobileSectionHead}>
              <h2>OTHER PRODUCTS</h2>
            </div>
            <div className={styles.mobileProducts}>
              {productItems.map((item) => (
                <button type="button" key={item.label} onClick={() => navigate(item.path)}>
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </section>
        </section>

        <div className={styles.desktopDashboard}>
        <header className={styles.topbar}>
          <div className={styles.topbarIdentity}>
            <button className={styles.profileAvatar} type="button" onClick={() => navigate("/profile")} aria-label="Open profile">
              {profileImage ? <img src={profileImage} alt={displayName} /> : displayName.charAt(0).toUpperCase()}
            </button>
            <div>
              <p className={styles.pageEyebrow}>Overview</p>
              <h1 className={styles.pageTitle}>Welcome back, {displayName}</h1>
            </div>
          </div>

          <div className={styles.topbarActions}>
            <button
              className={styles.iconAction}
              type="button"
              aria-label="Settings"
              title="Settings"
              onClick={() => setSettingsOpen(true)}
            >
              <FiSettings />
              <span>Settings</span>
            </button>
            <button
              className={styles.iconAction}
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === "dark" ? <FiEye /> : <FiEyeOff />}
              <span>Theme</span>
            </button>
            <button className={styles.topActionGhost}>Request</button>
            <button className={styles.topActionGhost}>Topup</button>
            <button className={styles.topActionPrimary}>Move Money</button>
          </div>
        </header>

        <section className={styles.heroGrid}>
          <div className={styles.balancePanel}>
            <div className={styles.desktopBalanceHeader}>
              <div>
                <p className={styles.panelLabel}>Total Balance</p>
                <h2 className={styles.balanceAmount}>
                  {displayMoney(totalBalance)}
                </h2>
              </div>
              <button
                className={styles.desktopEyeButton}
                type="button"
                onClick={() => setBalanceVisible((current) => !current)}
                aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              >
                {balanceVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <div className={styles.balanceActions}>
              <button className={styles.smallActionPrimary} onClick={() => navigate("/transactions")}>Send</button>
              <button className={styles.smallAction} onClick={() => navigate("/funding")}>Add Money</button>
              <button className={styles.smallAction} onClick={() => navigate("/convert")}>Convert</button>
            </div>
          </div>

          <div className={styles.quickPanel}>
            <div className={styles.panelHead}>
              <h3>Accounts</h3>
              <button className={styles.miniLink} onClick={showNextAccount} type="button">
                Switch
              </button>
            </div>

            <div className={styles.desktopAccountsGrid}>
              {accountCards.map((account, index) => (
                <button
                  className={`${styles.desktopAccountCard} ${
                    index === activeAccountIndex ? styles.activeDesktopAccount : ""
                  }`}
                  type="button"
                  onClick={() => showAccount(index)}
                  key={account.type}
                >
                  <span className={styles.desktopAccountIcon}>
                    <FiCreditCard />
                  </span>
                  <strong>{account.type}</strong>
                  <small>{bankName}</small>
                  <h4>{displayMoney(account.balance)}</h4>
                  <span>{maskAccountNumber(account.number)}</span>
                </button>
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
            <h2>{displayMoney(824521)}</h2>
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
            <h2>{displayMoney(117254)}</h2>
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

              {shownTransactions.map((item) => (
                <div className={styles.tableRow} key={item.id}>
                  <span className={styles.refText}>{item.id}</span>

                  <div className={styles.transactionMeta}>
                    <strong>{item.title}</strong>
                    <small>{item.subtitle}</small>
                  </div>

                  <span>{item.date}</span>

                  <span
                    className={
                      item.value < 0
                        ? styles.amountOut
                        : styles.amountIn
                    }
                  >
                    {balanceVisible
                      ? item.value < 0
                        ? `-${formatMoney(Math.abs(item.value))}`
                        : `+${formatMoney(item.value)}`
                      : "******"}
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
                <span>{bankName}</span>
                <span>VISA</span>
              </div>

              <div className={styles.cardHolderBlock}>
                <small>Card Holder</small>
                <strong>{displayName}</strong>
              </div>

              <div className={styles.cardDigits}>{accountNumber}</div>

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
                <h3>Other Products</h3>
              </div>

              <div className={styles.productList}>
                {productItems.map((item) => (
                  <button className={styles.productButton} type="button" key={item.label} onClick={() => navigate(item.path)}>
                    <span>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
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
                <span>Open</span>
              </div>

              <div className={styles.workflowCard}>
                <div>
                  <strong>Create order</strong>
                  <p>Looks OK</p>
                </div>
                <span>Open</span>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>

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
    </div>
  );
}
