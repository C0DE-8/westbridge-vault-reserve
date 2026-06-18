import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiClock,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiSettings,
} from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import styles from "./FinancePages.module.css";

const requestTypes = [
  { key: "savings", label: "Savings card" },
  { key: "current", label: "Current card" },
];

const statusLabel = {
  approved: "Approved",
  pending: "Pending review",
  rejected: "Rejected",
};

export default function CardsPage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismissToast } = useGlassToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [profile, setProfile] = useState(userUser);
  const [bankName, setBankName] = useState("Stercxa Bank");
  const [loading, setLoading] = useState(true);
  const [submittingType, setSubmittingType] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  const displayName = profile?.full_name || profile?.username || "User";
  const currencySign = profile?.currency_sign || "$";

  const loadPage = async () => {
    try {
      setLoading(true);
      const [profileRes, cardRes, bankRes] = await Promise.allSettled([
        axiosInstance.get("/user/profile"),
        axiosInstance.get("/user/atm-card-info"),
        axiosInstance.get("/user/settings/bank-name"),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data?.user || userUser);
      if (cardRes.status === "fulfilled") setCards(cardRes.value.data?.cards || []);
      if (bankRes.status === "fulfilled") setBankName(bankRes.value.data?.bank_name || "Stercxa Bank");
    } catch {
      notify("Unable to load your cards right now.", "error", "Cards unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, []);

  const requestCard = async (accountType) => {
    try {
      setSubmittingType(accountType);
      const res = await axiosInstance.post("/user/request-atm-card", {
        account_type: accountType,
      });
      notify(res.data?.message || "Card request submitted.", "success", "Request sent");
      await loadPage();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to request card.", "error", "Request failed");
    } finally {
      setSubmittingType("");
    }
  };

  const cardsByType = useMemo(() => {
    const grouped = { savings: [], current: [] };
    cards.forEach((card) => {
      if (grouped[card.account_type]) grouped[card.account_type].push(card);
    });
    return grouped;
  }, [cards]);

  const requestAvailability = requestTypes;

  const primaryCards = useMemo(() => {
    return requestTypes
      .map((item) => {
        const matching = cardsByType[item.key] || [];
        const approved = matching.find((card) => card.status === "approved");
        return approved || matching[0] || null;
      })
      .filter(Boolean);
  }, [cardsByType]);

  const formatCardNumber = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  };

  const maskCardNumber = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    if (!digits) return "•••• •••• •••• ••••";
    const masked = `${"•".repeat(Math.max(0, digits.length - 4))}${digits.slice(-4)}`;
    return masked.replace(/(.{4})(?=.)/g, "$1 ").trim();
  };

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  const deleteCard = async () => {
    if (!deleteTarget?.id) return;
    try {
      setDeleting(true);
      const res = await axiosInstance.delete(`/user/atm-card-info/${deleteTarget.id}`);
      notify(res.data?.message || "Card deleted successfully.", "success", "Card deleted");
      setDeleteTarget(null);
      await loadPage();
      setActiveIndex((current) => Math.max(0, Math.min(current, Math.max(primaryCards.length - 2, 0))));
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to delete card.", "error", "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const nextCard = () => setActiveIndex((current) => Math.min(current + 1, Math.max(primaryCards.length - 1, 0)));
  const prevCard = () => setActiveIndex((current) => Math.max(current - 1, 0));
  const onSwipeEnd = (endX) => {
    if (touchStartX === null) return;
    const delta = touchStartX - endX;
    if (Math.abs(delta) < 40) {
      setTouchStartX(null);
      return;
    }
    if (delta > 0) nextCard();
    if (delta < 0) prevCard();
    setTouchStartX(null);
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
            <FiArrowLeft />
          </button>
          <div>
            <span><FiCreditCard /></span>
            <h1>Cards</h1>
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
            <span className={styles.eyebrow}>Card centre</span>
            <h2>Manage your debit cards</h2>
            <p>Request ATM cards for your Savings or Current account and manage the cards already on your profile.</p>
          </div>
        </section>

        {loading ? (
          <div className={styles.preloaderBlock}>
            <span />
            <strong>Loading cards...</strong>
          </div>
        ) : (
          <>
            <section className={styles.cardDeck}>
              {primaryCards.length ? (
                <>
                  <div className={styles.cardSliderControls}>
                    <button type="button" onClick={prevCard} disabled={activeIndex === 0} aria-label="Previous card">
                      <FiChevronLeft />
                    </button>
                    <div className={styles.cardSliderDots}>
                      {primaryCards.map((card, index) => (
                        <button
                          type="button"
                          key={`${card.account_type}-${index}`}
                          className={index === activeIndex ? styles.cardSliderDotActive : ""}
                          onClick={() => setActiveIndex(index)}
                          aria-label={`Go to card ${index + 1}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={nextCard}
                      disabled={activeIndex === primaryCards.length - 1}
                      aria-label="Next card"
                    >
                      <FiChevronRight />
                    </button>
                  </div>

                  <div className={styles.cardViewport}>
                    <div
                      className={styles.cardTrack}
                      style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                      onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
                      onTouchEnd={(event) => onSwipeEnd(event.changedTouches[0].clientX)}
                    >
                      {primaryCards.map((card) => (
                        <article className={styles.bankCard} key={`${card.account_type}-${card.card_number}`}>
                          <div className={styles.creditCardWrap}>
                            <div className={styles.cardWorldMap} />
                            <div className={styles.cardInner}>
                              <header className={styles.bankCardHeader}>
                                <div className={styles.bankBrand}>
                                  <div className={styles.bankLogoMark}>
                                    <span>{bankName.slice(0, 2).toUpperCase()}</span>
                                  </div>
                                  <div>
                                    <strong>{bankName}</strong>
                                    <small>{card.account_type === "savings" ? "Savings Debit" : "Current Debit"}</small>
                                  </div>
                                </div>
                                <span className={`${styles.cardStatus} ${styles[`cardStatus${card.status}`] || ""}`}>
                                  {statusLabel[card.status] || card.status}
                                </span>
                              </header>

                              <div className={styles.cardChip} />
                              <div className={styles.cardNumberMeta}>
                                <div className={styles.cardNumber} data-text={card.card_number?.slice(0, 4) || "4716"}>
                                  {card.status === "approved" ? formatCardNumber(card.card_number) : maskCardNumber(card.card_number)}
                                </div>
                              </div>

                              <footer className={styles.bankCardFooter}>
                                <div className={styles.bankCardFooterLeft}>
                                  <div className={styles.cardDateBlock}>
                                    <span>Expires End</span>
                                    <strong>{card.expiry_date || "--/--"}</strong>
                                  </div>
                                  <div className={styles.cardHolderName}>
                                    {card.card_holder_name || displayName}
                                  </div>
                                </div>
                                <div className={styles.cardBrandMark}>
                                  <span />
                                  <span />
                                </div>
                              </footer>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <article className={styles.cardPlaceholder}>
                  <FiCreditCard />
                  <strong>No card issued yet</strong>
                  <p>Request a card below and it will appear here once it is created.</p>
                </article>
              )}
            </section>

            <section className={styles.gridTwo}>
              {requestAvailability.map((item) => (
                <article className={styles.actionGlassCard} key={item.key}>
                  <div>
                    <span className={styles.eyebrow}>{item.label}</span>
                    <strong>{item.key === "savings" ? "Linked to your savings balance" : "Linked to your daily spending account"}</strong>
                    <small>Card request fee is deducted immediately from the selected account.</small>
                  </div>
                  <button
                    type="button"
                    disabled={submittingType === item.key}
                    onClick={() => requestCard(item.key)}
                  >
                    {submittingType === item.key ? "Submitting..." : "Request ATM card"}
                  </button>
                </article>
              ))}
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Card activity</h2>
                  <p>Every request, approved card, and processing item on your account.</p>
                </div>
              </div>

              {cards.length === 0 ? (
                <p className={styles.empty}>No card activity yet.</p>
              ) : (
                <div className={styles.listStack}>
                  {cards.map((card) => (
                    <article className={styles.statementRow} key={`${card.account_type}-${card.card_number}-${card.requested_at}`}>
                      <span className={styles.statementIcon}>
                        {card.status === "approved" ? <FiCheckCircle /> : <FiClock />}
                      </span>
                      <div>
                        <strong>{card.account_type === "savings" ? "Savings Debit Card" : "Current Debit Card"}</strong>
                        <small>{maskCardNumber(card.card_number)} • Requested {card.requested_at || "Recently"}</small>
                      </div>
                      <div className={styles.rowRight}>
                        <b>{currencySign}{Number(card.fee || 0).toFixed(2)}</b>
                        <small>{statusLabel[card.status] || card.status}</small>
                      </div>
                      <button
                        type="button"
                        className={styles.rowDeleteButton}
                        onClick={() => setDeleteTarget(card)}
                        aria-label="Delete card"
                      >
                        <FiTrash2 />
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <MobileFooterNav />
      <GlassToast toasts={toasts} onDismiss={dismissToast} />
      {deleteTarget ? (
        <div className={styles.confirmOverlay} onClick={() => !deleting && setDeleteTarget(null)}>
          <div className={styles.confirmCard} onClick={(event) => event.stopPropagation()}>
            <h3>Delete this card?</h3>
            <p>
              This will remove the selected {deleteTarget.account_type} card from your profile.
              Make sure you want to continue.
            </p>
            <div className={styles.confirmActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancel
              </button>
              <button type="button" className={styles.dangerButton} onClick={deleteCard} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
