import { useEffect, useMemo, useState } from "react";
import { FiCreditCard, FiEdit2, FiRefreshCw, FiSave, FiTrash2 } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge, TableSkeleton } from "../AdminPrimitives";
import styles from "../Admin.module.css";

const ACCOUNT_TYPES = [
  { type: "current", label: "Current Account Card Fee" },
  { type: "savings", label: "Savings Account Card Fee" },
];

const PAGE_SIZE = 10;

const normalizeCardForEdit = (card) => ({
  id: card.id,
  account_type: card.account_type || "current",
  card_number: String(card.card_number || "").replace(/\s+/g, ""),
  card_holder_name: card.card_holder_name || "",
  expiry_date: card.expiry_date || "",
  cvv: card.cvv || "",
  fee: card.fee_amount ?? String(card.fee || "").replace(/[^\d.]/g, ""),
  status: card.status || "pending",
});

export default function AdminAtmCards() {
  const outletContext = useOutletContext() || {};
  const notify = outletContext.notify || (() => {});
  const [cards, setCards] = useState([]);
  const [fees, setFees] = useState({});
  const [feeDrafts, setFeeDrafts] = useState({});
  const [filters, setFilters] = useState({ search: "", status: "all", account_type: "all" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [savingFee, setSavingFee] = useState("");
  const [savingCardId, setSavingCardId] = useState("");
  const [editForm, setEditForm] = useState(null);

  const loadAtmPage = async () => {
    try {
      setLoading(true);
      const [cardsRes, feesRes] = await Promise.allSettled([
        axiosInstance.get("/admin/atm-cards"),
        axiosInstance.get("/admin/card-fee"),
      ]);

      if (cardsRes.status === "fulfilled") {
        setCards(cardsRes.value.data?.atm_cards || []);
      } else {
        notify(cardsRes.reason?.response?.data?.error || "Failed to load ATM card requests", "error");
      }

      if (feesRes.status === "fulfilled") {
        const nextFees = feesRes.value.data?.fees || {};
        setFees(nextFees);
        setFeeDrafts({
          current: nextFees.current ?? "",
          savings: nextFees.savings ?? "",
        });
      } else {
        notify("ATM card fees could not be loaded.", "info");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAtmPage();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const filteredCards = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return cards.filter((card) => {
      const status = String(card.status || "").toLowerCase();
      const accountType = String(card.account_type || "").toLowerCase();
      const matchesStatus = filters.status === "all" || status === filters.status;
      const matchesAccountType = filters.account_type === "all" || accountType === filters.account_type;
      const matchesSearch = !term || [
        card.full_name,
        card.email,
        card.card_holder_name,
        card.card_number,
        card.account_type,
        card.fee,
        card.created_at,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesStatus && matchesAccountType && matchesSearch;
    });
  }, [cards, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleCards = filteredCards.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filteredCards.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredCards.length);

  const updateFee = async (type) => {
    const fee = feeDrafts[type];
    if (fee === "" || Number.isNaN(Number(fee)) || Number(fee) < 0) {
      notify("Enter a valid ATM card fee.", "error");
      return;
    }

    try {
      setSavingFee(type);
      const res = await axiosInstance.post("/admin/set-card-fee", { account_type: type, fee });
      setFees((current) => ({ ...current, [type]: Number(fee) }));
      notify(res.data?.message || "ATM card fee updated", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update ATM card fee", "error");
    } finally {
      setSavingFee("");
    }
  };

  const approveCard = async (card) => {
    try {
      setSavingCardId(String(card.id));
      const res = await axiosInstance.put(`/admin/atm-cards/${card.id}/approve`);
      notify(res.data?.message || "ATM card approved", "success");
      loadAtmPage();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to approve ATM card", "error");
    } finally {
      setSavingCardId("");
    }
  };

  const updateCard = async (id, payload, successMessage = "ATM card updated") => {
    try {
      setSavingCardId(String(id));
      const res = await axiosInstance.put(`/admin/atm-cards/${id}`, payload);
      notify(res.data?.message || successMessage, "success");
      setEditForm(null);
      loadAtmPage();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update ATM card", "error");
    } finally {
      setSavingCardId("");
    }
  };

  const deleteCard = async (card) => {
    if (!window.confirm(`Delete ATM card request for ${card.card_holder_name || card.full_name}?`)) return;

    try {
      setSavingCardId(String(card.id));
      const res = await axiosInstance.delete(`/admin/atm-cards/${card.id}`);
      notify(res.data?.message || "ATM card deleted", "success");
      if (editForm?.id === card.id) setEditForm(null);
      loadAtmPage();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to delete ATM card", "error");
    } finally {
      setSavingCardId("");
    }
  };

  const submitEdit = (event) => {
    event.preventDefault();
    if (!editForm) return;

    updateCard(editForm.id, {
      account_type: editForm.account_type,
      card_number: editForm.card_number,
      card_holder_name: editForm.card_holder_name,
      expiry_date: editForm.expiry_date,
      cvv: editForm.cvv,
      fee: editForm.fee,
      status: editForm.status,
    });
  };

  if (loading) return <TableSkeleton title="Loading ATM cards" columns={8} rows={7} />;

  return (
    <div className={styles.settingsStack}>
      <section className={styles.panel}>
        <div className={styles.settingsHeader}>
          <div>
            <span className={styles.settingsEyebrow}><FiCreditCard /> ATM Card Fee Management</span>
            <h2>Card request fees</h2>
            <p>View and update the fee charged when customers request a current or savings ATM card.</p>
          </div>
        </div>

        <div className={styles.atmFeeGrid}>
          {ACCOUNT_TYPES.map((item) => (
            <article className={styles.feeManageCard} key={item.type}>
              <div>
                <h3>{item.label}</h3>
                <span>Current Fee</span>
                <strong>${Number(fees[item.type] || 0).toFixed(2)}</strong>
              </div>
              <label className={styles.field}>
                <span>New fee amount</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={feeDrafts[item.type] ?? ""}
                  onChange={(event) => setFeeDrafts((current) => ({ ...current, [item.type]: event.target.value }))}
                />
              </label>
              <button className={styles.applyBtn} type="button" onClick={() => updateFee(item.type)} disabled={savingFee === item.type}>
                <FiSave />
                <span>{savingFee === item.type ? "Saving..." : "Save fee"}</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      {editForm && (
        <section className={styles.panel}>
          <div className={styles.settingsHeader}>
            <div>
              <span className={styles.settingsEyebrow}><FiEdit2 /> Edit ATM Card</span>
              <h2>{editForm.card_holder_name || "Card request"}</h2>
              <p>Update card details, fee, account type, or request status.</p>
            </div>
            <button className={styles.secondaryBtn} type="button" onClick={() => setEditForm(null)}>
              Cancel
            </button>
          </div>

          <form className={styles.settingsForm} onSubmit={submitEdit}>
            <div className={styles.settingsFormGrid}>
              <label className={styles.field}>
                <span>Account type</span>
                <select value={editForm.account_type} onChange={(event) => setEditForm((current) => ({ ...current, account_type: event.target.value }))}>
                  <option value="current">Current</option>
                  <option value="savings">Savings</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Status</span>
                <select value={editForm.status} onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value }))}>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Card holder name</span>
                <input value={editForm.card_holder_name} onChange={(event) => setEditForm((current) => ({ ...current, card_holder_name: event.target.value }))} required />
              </label>
              <label className={styles.field}>
                <span>Card number</span>
                <input value={editForm.card_number} onChange={(event) => setEditForm((current) => ({ ...current, card_number: event.target.value }))} required />
              </label>
              <label className={styles.field}>
                <span>Expiry date</span>
                <input placeholder="MM/YY" value={editForm.expiry_date} onChange={(event) => setEditForm((current) => ({ ...current, expiry_date: event.target.value }))} required />
              </label>
              <label className={styles.field}>
                <span>CVV</span>
                <input value={editForm.cvv} onChange={(event) => setEditForm((current) => ({ ...current, cvv: event.target.value }))} required />
              </label>
              <label className={styles.field}>
                <span>Fee charged</span>
                <input type="number" min="0" step="0.01" value={editForm.fee} onChange={(event) => setEditForm((current) => ({ ...current, fee: event.target.value }))} required />
              </label>
            </div>
            <div className={styles.formActions}>
              <button className={styles.refreshBtn} type="submit" disabled={savingCardId === String(editForm.id)}>
                <FiSave />
                <span>{savingCardId === String(editForm.id) ? "Saving..." : "Save card"}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      <section className={styles.panel}>
        <div className={styles.settingsHeader}>
          <div>
            <span className={styles.settingsEyebrow}><FiCreditCard /> All ATM Card Requests</span>
            <h2>Card requests</h2>
            <p>Review, approve, reject, edit, or delete customer ATM card requests.</p>
          </div>
          <button className={styles.secondaryBtn} type="button" onClick={loadAtmPage}>
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>

        <div className={styles.transferFilters}>
          <label className={styles.field}>
            <span>Search</span>
            <input
              type="search"
              placeholder="Customer, card holder, email, card number..."
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Account type</span>
            <select value={filters.account_type} onChange={(event) => setFilters((current) => ({ ...current, account_type: event.target.value }))}>
              <option value="all">All accounts</option>
              <option value="current">Current</option>
              <option value="savings">Savings</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>Status</span>
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
        </div>

        {visibleCards.length ? (
          <>
            <DataTable headers={["Customer", "Account", "Card", "Holder", "Expiry/CVV", "Fee", "Status", "Action"]}>
              {visibleCards.map((card) => (
                <div className={styles.tableRow} key={card.id} style={{ gridTemplateColumns: "1.2fr 0.75fr 1.1fr 1fr 0.85fr 0.7fr 0.75fr 1.35fr" }}>
                  <span>
                    <strong>{card.full_name || "Unknown customer"}</strong>
                    <small>{card.email}</small>
                  </span>
                  <span>{card.account_type}</span>
                  <span>
                    <strong>{card.card_number}</strong>
                    <small>{card.created_at || "No request date"}</small>
                  </span>
                  <span>{card.card_holder_name}</span>
                  <span>
                    <strong>{card.expiry_date}</strong>
                    <small>CVV {card.cvv}</small>
                  </span>
                  <span>{card.fee}</span>
                  <span><StatusBadge status={card.status} /></span>
                  <span className={styles.inlineActions}>
                    {card.status !== "approved" && (
                      <button onClick={() => approveCard(card)} disabled={savingCardId === String(card.id)}>Approve</button>
                    )}
                    {card.status !== "rejected" && (
                      <button onClick={() => updateCard(card.id, { status: "rejected" }, "ATM card rejected")} disabled={savingCardId === String(card.id)}>Reject</button>
                    )}
                    <button className={styles.editActionBtn} onClick={() => setEditForm(normalizeCardForEdit(card))}>
                      <FiEdit2 />
                      <span>Edit</span>
                    </button>
                    <button className={styles.deleteActionBtn} onClick={() => deleteCard(card)} disabled={savingCardId === String(card.id)}>
                      <FiTrash2 />
                      <span>Delete</span>
                    </button>
                  </span>
                </div>
              ))}
            </DataTable>

            <div className={styles.paginationBar}>
              <span>Showing {rangeStart}-{rangeEnd} of {filteredCards.length}</span>
              <div className={styles.paginationActions}>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage(1)} disabled={currentPage === 1}>First</button>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>Previous</button>
                <strong>Page {currentPage} of {totalPages}</strong>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>Next</button>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>Last</button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState>No ATM card requests found for the selected filters.</EmptyState>
        )}
      </section>
    </div>
  );
}
