import { useEffect, useMemo, useState } from "react";
import { FiActivity, FiEdit2, FiRefreshCw, FiSave, FiShuffle, FiTrash2 } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge, TableSkeleton } from "../AdminPrimitives";
import styles from "../Admin.module.css";

const today = new Date().toISOString().slice(0, 10);

const INITIAL_FORM = {
  user_id: "",
  transfer_type: "local",
  direction: "credit",
  amount: "1000",
  from_account: "current",
  start_date: today,
  end_date: today,
  mode: "single",
  count: "5",
  apply_to_balance: false,
  bank_name: "",
  account_name: "",
  account_number: "",
  reason: "",
  bank_country: "",
  routine_number: "",
  imf_code: "",
  cot_code: "",
  tax_code: "",
};

const INITIAL_REFRESH = {
  scope: "day",
  nameset: "mix",
  update_reason: false,
  fill_wire_extras: true,
  preserve_existing: true,
  min_bank_count: "1",
  dry_run: false,
};

const HISTORY_PAGE_SIZE_OPTIONS = [10, 25, 50];

const parseMoney = (value) => String(value || "").replace(/[^\d.-]/g, "");

const toDatetimeLocal = (value) => {
  if (!value) return "";
  return String(value).replace(" ", "T").slice(0, 16);
};

const toSqlDatetime = (value) => {
  if (!value) return "";
  const normalized = String(value).replace("T", " ");
  return normalized.length === 16 ? `${normalized}:00` : normalized;
};

const transferToEditForm = (item) => ({
  id: item.id,
  transfer_type: item.type || "local",
  from_account: item.from_account || "current",
  bank_name: item.bank_name || "",
  account_name: item.account_name || "",
  account_number: item.account_number || "",
  bank_country: item.bank_country || "",
  routine_number: item.routine_number || "",
  reason: item.reason || "",
  amount: parseMoney(item.amount),
  fee: parseMoney(item.fee),
  status: item.status || "completed",
  date: toDatetimeLocal(item.date),
});

export default function AdminSimulateTransactions() {
  const outletContext = useOutletContext() || {};
  const notify = outletContext.notify || (() => {});
  const [users, setUsers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [refreshForm, setRefreshForm] = useState(INITIAL_REFRESH);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [transferHistory, setTransferHistory] = useState([]);
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [savingTransferId, setSavingTransferId] = useState("");
  const [result, setResult] = useState(null);
  const [refreshResult, setRefreshResult] = useState(null);

  const selectedUser = useMemo(
    () => users.find((user) => String(user.id) === String(form.user_id)),
    [form.user_id, users]
  );

  const filteredUsers = useMemo(() => {
    const term = customerSearch.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) => [
      user.id,
      user.full_name,
      user.username,
      user.email,
      user.account_number,
      user.c_account_number,
      user.s_account_number,
    ].some((value) => String(value || "").toLowerCase().includes(term)));
  }, [customerSearch, users]);

  const visibleHistory = useMemo(() => {
    if (historyFilter === "all") return transferHistory;
    return transferHistory.filter((item) => String(item.type || "").toLowerCase() === historyFilter);
  }, [historyFilter, transferHistory]);

  const historyTotalPages = Math.max(1, Math.ceil(visibleHistory.length / historyPageSize));
  const historyCurrentPage = Math.min(historyPage, historyTotalPages);
  const paginatedHistory = visibleHistory.slice((historyCurrentPage - 1) * historyPageSize, historyCurrentPage * historyPageSize);
  const historyRangeStart = visibleHistory.length ? (historyCurrentPage - 1) * historyPageSize + 1 : 0;
  const historyRangeEnd = Math.min(historyCurrentPage * historyPageSize, visibleHistory.length);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/users?pageSize=200");
      const nextUsers = res.data?.users || [];
      setUsers(nextUsers);
      if (!form.user_id && nextUsers.length) {
        setForm((current) => ({ ...current, user_id: String(nextUsers[0].id) }));
      }
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadTransferHistory = async (userId = form.user_id) => {
    if (!userId) {
      setTransferHistory([]);
      return;
    }

    try {
      setHistoryLoading(true);
      const [localRes, wireRes] = await Promise.allSettled([
        axiosInstance.get(`/admin/users/${userId}/history/local`),
        axiosInstance.get(`/admin/users/${userId}/history/wire`),
      ]);

      const localHistory = localRes.status === "fulfilled" ? localRes.value.data?.history || [] : [];
      const wireHistory = wireRes.status === "fulfilled" ? wireRes.value.data?.wire_history || [] : [];
      const merged = [...localHistory, ...wireHistory].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
      setTransferHistory(merged);

      if (localRes.status === "rejected" || wireRes.status === "rejected") {
        notify("Some transfer history could not be loaded.", "info");
      }
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load transfer history", "error");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadTransferHistory(form.user_id);
  }, [form.user_id]);

  useEffect(() => {
    setHistoryPage(1);
  }, [historyFilter, historyPageSize, form.user_id]);

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateRefreshField = (key, value) => {
    setRefreshForm((current) => ({ ...current, [key]: value }));
  };

  const updateEditingTransfer = (key, value) => {
    setEditingTransfer((current) => ({ ...current, [key]: value }));
  };

  const submitTransferEdit = async (event) => {
    event.preventDefault();
    if (!editingTransfer?.id) return;

    try {
      setSavingTransferId(String(editingTransfer.id));
      const payload = {
        transfer_type: editingTransfer.transfer_type,
        from_account: editingTransfer.from_account,
        bank_name: editingTransfer.bank_name,
        account_name: editingTransfer.account_name,
        account_number: editingTransfer.account_number,
        bank_country: editingTransfer.bank_country,
        routine_number: editingTransfer.routine_number,
        reason: editingTransfer.reason,
        amount: editingTransfer.amount,
        fee: editingTransfer.fee,
        status: editingTransfer.status,
        date: toSqlDatetime(editingTransfer.date),
      };

      const res = await axiosInstance.put(`/admin/transfers/${editingTransfer.id}`, payload);
      notify(res.data?.message || "Transfer updated", "success");
      setEditingTransfer(null);
      loadTransferHistory(form.user_id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update transfer", "error");
    } finally {
      setSavingTransferId("");
    }
  };

  const deleteTransfer = async (item) => {
    if (!window.confirm(`Delete transfer #${item.id}?`)) return;

    try {
      setSavingTransferId(String(item.id));
      const res = await axiosInstance.delete(`/admin/transfers/${item.id}`);
      notify(res.data?.message || "Transfer deleted", "success");
      if (editingTransfer?.id === item.id) setEditingTransfer(null);
      loadTransferHistory(form.user_id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to delete transfer", "error");
    } finally {
      setSavingTransferId("");
    }
  };

  const submitSimulation = async (event) => {
    event.preventDefault();

    if (!form.user_id) {
      notify("Choose a customer before creating simulated transactions.", "error");
      return;
    }

    const payload = {
      transfer_type: form.transfer_type,
      direction: form.direction,
      amount: Number(form.amount),
      from_account: form.from_account,
      start_date: form.start_date,
      end_date: form.end_date || form.start_date,
      mode: form.mode,
      count: Number(form.count) || 1,
      apply_to_balance: !!form.apply_to_balance,
    };

    [
      "bank_name",
      "account_name",
      "account_number",
      "reason",
      "bank_country",
      "routine_number",
      "imf_code",
      "cot_code",
      "tax_code",
    ].forEach((key) => {
      if (form[key]) payload[key] = form[key];
    });

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/admin/users/${form.user_id}/simulate/transactions`, payload);
      setResult(res.data || null);
      notify("Simulated transactions created", "success");
      loadTransferHistory(form.user_id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to simulate transactions", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const submitRefresh = async (event) => {
    event.preventDefault();

    if (!form.user_id) {
      notify("Choose a customer before refreshing simulated transactions.", "error");
      return;
    }

    try {
      setRefreshing(true);
      const res = await axiosInstance.post(`/admin/users/${form.user_id}/transactions/sim-refresh`, {
        scope: refreshForm.scope,
        nameset: refreshForm.nameset,
        update_reason: !!refreshForm.update_reason,
        fill_wire_extras: !!refreshForm.fill_wire_extras,
        preserve_existing: !!refreshForm.preserve_existing,
        min_bank_count: Number(refreshForm.min_bank_count) || 1,
        dry_run: !!refreshForm.dry_run,
      });
      setRefreshResult(res.data || null);
      notify(refreshForm.dry_run ? "Simulation refresh preview ready" : "Simulated transactions refreshed", "success");
      if (!refreshForm.dry_run) loadTransferHistory(form.user_id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to refresh simulated transactions", "error");
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) return <TableSkeleton title="Loading simulation tools" columns={4} rows={5} />;

  return (
    <div className={styles.settingsStack}>
      <section className={styles.panel}>
        <div className={styles.settingsHeader}>
          <div>
            <span className={styles.settingsEyebrow}><FiShuffle /> Simulate Transactions</span>
            <h2>Create transfer history</h2>
            <p>Create local or wire transfer rows for a customer. Use this for account history setup and controlled demo data.</p>
          </div>
          <button className={styles.secondaryBtn} type="button" onClick={loadUsers}>
            <FiRefreshCw />
            <span>Reload users</span>
          </button>
        </div>

        {users.length ? (
          <form className={styles.settingsForm} onSubmit={submitSimulation}>
            <div className={styles.simGrid}>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>Search customer</span>
                <input
                  type="search"
                  value={customerSearch}
                  onChange={(event) => setCustomerSearch(event.target.value)}
                  placeholder="Name, username, email, user ID, or account number"
                />
              </label>

              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span>Customer</span>
                <select
                  value={filteredUsers.some((user) => String(user.id) === String(form.user_id)) ? form.user_id : ""}
                  onChange={(event) => updateField("user_id", event.target.value)}
                  required
                >
                  {!filteredUsers.some((user) => String(user.id) === String(form.user_id)) && (
                    <option value="">Select a matching customer</option>
                  )}
                  {filteredUsers.map((user) => (
                    <option value={user.id} key={user.id}>
                      {user.full_name || user.username || `User #${user.id}`} - {user.email || "No email"} - #{user.id}
                    </option>
                  ))}
                </select>
                {!filteredUsers.length && <small>No customers match this search.</small>}
              </label>

              {selectedUser && (
                <div className={`${styles.adminStatsGrid} ${styles.fieldFull}`}>
                  <article className={styles.adminStatCard}>
                    <span>Current Balance</span>
                    <strong>{selectedUser.currency_sign || "$"}{Number(selectedUser.current_balance || 0).toFixed(2)}</strong>
                  </article>
                  <article className={styles.adminStatCard}>
                    <span>Savings Balance</span>
                    <strong>{selectedUser.currency_sign || "$"}{Number(selectedUser.savings_balance || 0).toFixed(2)}</strong>
                  </article>
                  <article className={styles.adminStatCard}>
                    <span>Status</span>
                    <strong>{selectedUser.acct_status || "unknown"}</strong>
                  </article>
                  <article className={styles.adminStatCard}>
                    <span>User ID</span>
                    <strong>#{selectedUser.id}</strong>
                  </article>
                </div>
              )}

              <label className={styles.field}>
                <span>Transfer type</span>
                <select value={form.transfer_type} onChange={(event) => updateField("transfer_type", event.target.value)}>
                  <option value="local">Local</option>
                  <option value="wire">Wire</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Direction</span>
                <select value={form.direction} onChange={(event) => updateField("direction", event.target.value)}>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Account</span>
                <select value={form.from_account} onChange={(event) => updateField("from_account", event.target.value)}>
                  <option value="current">Current</option>
                  <option value="savings">Savings</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Total amount</span>
                <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => updateField("amount", event.target.value)} required />
              </label>
              <label className={styles.field}>
                <span>Mode</span>
                <select value={form.mode} onChange={(event) => updateField("mode", event.target.value)}>
                  <option value="single">Single entry</option>
                  <option value="daily">Daily entries</option>
                  <option value="count">Split by count</option>
                </select>
              </label>
              <label className={styles.field}>
                <span>Entry count</span>
                <input type="number" min="1" max="365" value={form.count} onChange={(event) => updateField("count", event.target.value)} disabled={form.mode !== "count"} />
              </label>
              <label className={styles.field}>
                <span>Start date</span>
                <input type="date" value={form.start_date} onChange={(event) => updateField("start_date", event.target.value)} required />
              </label>
              <label className={styles.field}>
                <span>End date</span>
                <input type="date" value={form.end_date} onChange={(event) => updateField("end_date", event.target.value)} disabled={form.mode === "single"} />
              </label>
              <label className={styles.toggleRow}>
                <span>Apply net impact to balance</span>
                <input type="checkbox" checked={form.apply_to_balance} onChange={(event) => updateField("apply_to_balance", event.target.checked)} />
              </label>
            </div>

            <div className={styles.simGrid}>
              <label className={styles.field}>
                <span>Bank name</span>
                <input value={form.bank_name} onChange={(event) => updateField("bank_name", event.target.value)} placeholder="Auto generated if blank" />
              </label>
              <label className={styles.field}>
                <span>Account name</span>
                <input value={form.account_name} onChange={(event) => updateField("account_name", event.target.value)} placeholder="Auto generated if blank" />
              </label>
              <label className={styles.field}>
                <span>Account number</span>
                <input value={form.account_number} onChange={(event) => updateField("account_number", event.target.value)} placeholder="Auto generated if blank" />
              </label>
              <label className={styles.field}>
                <span>Reason</span>
                <input value={form.reason} onChange={(event) => updateField("reason", event.target.value)} placeholder="Auto generated if blank" />
              </label>
              {form.transfer_type === "wire" && (
                <>
                  <label className={styles.field}>
                    <span>Bank country</span>
                    <input value={form.bank_country} onChange={(event) => updateField("bank_country", event.target.value)} placeholder="United States" />
                  </label>
                  <label className={styles.field}>
                    <span>Routing number</span>
                    <input value={form.routine_number} onChange={(event) => updateField("routine_number", event.target.value)} placeholder="Auto generated if blank" />
                  </label>
                  <label className={styles.field}>
                    <span>IMF code</span>
                    <input value={form.imf_code} onChange={(event) => updateField("imf_code", event.target.value)} placeholder="Auto generated if blank" />
                  </label>
                  <label className={styles.field}>
                    <span>COT code</span>
                    <input value={form.cot_code} onChange={(event) => updateField("cot_code", event.target.value)} placeholder="Auto generated if blank" />
                  </label>
                  <label className={styles.field}>
                    <span>TAX code</span>
                    <input value={form.tax_code} onChange={(event) => updateField("tax_code", event.target.value)} placeholder="Auto generated if blank" />
                  </label>
                </>
              )}
            </div>

            <div className={styles.formActions}>
              <button className={styles.refreshBtn} type="submit" disabled={submitting}>
                <FiSave />
                <span>{submitting ? "Creating..." : "Create simulated transactions"}</span>
              </button>
            </div>
          </form>
        ) : (
          <EmptyState>No users found. Create a user before simulating transactions.</EmptyState>
        )}
      </section>

      {result && (
        <section className={styles.panel}>
          <div className={styles.settingsHeader}>
            <div>
              <span className={styles.settingsEyebrow}><FiActivity /> Last Simulation</span>
              <h2>Batch {result.sim_batch_id}</h2>
              <p>{result.total_entries} entries created for user #{result.user_id}.</p>
            </div>
          </div>
          <div className={styles.adminStatsGrid}>
            <article className={styles.adminStatCard}><span>Total amount</span><strong>{Number(result.total_amount || 0).toFixed(2)}</strong></article>
            <article className={styles.adminStatCard}><span>Per-entry fee</span><strong>{Number(result.per_entry_fee || 0).toFixed(2)}</strong></article>
            <article className={styles.adminStatCard}><span>Type</span><strong>{result.transfer_type}</strong></article>
            <article className={styles.adminStatCard}><span>Balance updated</span><strong>{result.applied_to_balance ? "Yes" : "No"}</strong></article>
          </div>
        </section>
      )}

      <section className={styles.panel}>
        <div className={styles.settingsHeader}>
          <div>
            <span className={styles.settingsEyebrow}><FiActivity /> Customer Transfer History</span>
            <h2>{selectedUser ? selectedUser.full_name || selectedUser.username || `User #${selectedUser.id}` : "Selected customer"}</h2>
            <p>Review recent local and wire transfers for this customer before or after creating simulated history.</p>
          </div>
          <div className={styles.headerActions}>
            <label className={styles.field}>
              <span>Type</span>
              <select value={historyFilter} onChange={(event) => setHistoryFilter(event.target.value)}>
                <option value="all">All transfers</option>
                <option value="local">Local only</option>
                <option value="wire">Wire only</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Rows</span>
              <select value={historyPageSize} onChange={(event) => setHistoryPageSize(Number(event.target.value))}>
                {HISTORY_PAGE_SIZE_OPTIONS.map((size) => (
                  <option value={size} key={size}>{size}</option>
                ))}
              </select>
            </label>
            <button className={styles.secondaryBtn} type="button" onClick={() => loadTransferHistory()} disabled={historyLoading || !form.user_id}>
              <FiRefreshCw />
              <span>{historyLoading ? "Loading..." : "Refresh history"}</span>
            </button>
          </div>
        </div>

        {historyLoading ? (
          <TableSkeleton title="Loading transfer history" columns={7} rows={5} />
        ) : visibleHistory.length ? (
          <>
            {editingTransfer && (
              <form className={styles.settingsForm} onSubmit={submitTransferEdit}>
                <div className={styles.settingsHeader}>
                  <div>
                    <span className={styles.settingsEyebrow}><FiEdit2 /> Edit Transfer</span>
                    <h2>Transfer #{editingTransfer.id}</h2>
                    <p>Update the selected transfer record for this customer.</p>
                  </div>
                  <button className={styles.secondaryBtn} type="button" onClick={() => setEditingTransfer(null)}>
                    Cancel
                  </button>
                </div>

                <div className={styles.simGrid}>
                  <label className={styles.field}>
                    <span>Type</span>
                    <select value={editingTransfer.transfer_type} onChange={(event) => updateEditingTransfer("transfer_type", event.target.value)}>
                      <option value="local">Local</option>
                      <option value="wire">Wire</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Account</span>
                    <select value={editingTransfer.from_account} onChange={(event) => updateEditingTransfer("from_account", event.target.value)}>
                      <option value="current">Current</option>
                      <option value="savings">Savings</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Status</span>
                    <select value={editingTransfer.status} onChange={(event) => updateEditingTransfer("status", event.target.value)}>
                      <option value="pending_admin">Pending admin</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </label>
                  <label className={styles.field}>
                    <span>Date</span>
                    <input type="datetime-local" value={editingTransfer.date} onChange={(event) => updateEditingTransfer("date", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Amount</span>
                    <input type="number" min="0" step="0.01" value={editingTransfer.amount} onChange={(event) => updateEditingTransfer("amount", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Fee</span>
                    <input type="number" min="0" step="0.01" value={editingTransfer.fee} onChange={(event) => updateEditingTransfer("fee", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Bank name</span>
                    <input value={editingTransfer.bank_name} onChange={(event) => updateEditingTransfer("bank_name", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Beneficiary</span>
                    <input value={editingTransfer.account_name} onChange={(event) => updateEditingTransfer("account_name", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Account number</span>
                    <input value={editingTransfer.account_number} onChange={(event) => updateEditingTransfer("account_number", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Bank country</span>
                    <input value={editingTransfer.bank_country} onChange={(event) => updateEditingTransfer("bank_country", event.target.value)} />
                  </label>
                  <label className={styles.field}>
                    <span>Routing number</span>
                    <input value={editingTransfer.routine_number} onChange={(event) => updateEditingTransfer("routine_number", event.target.value)} />
                  </label>
                  <label className={`${styles.field} ${styles.fieldFull}`}>
                    <span>Reason</span>
                    <input value={editingTransfer.reason} onChange={(event) => updateEditingTransfer("reason", event.target.value)} />
                  </label>
                </div>

                <div className={styles.formActions}>
                  <button className={styles.refreshBtn} type="submit" disabled={savingTransferId === String(editingTransfer.id)}>
                    <FiSave />
                    <span>{savingTransferId === String(editingTransfer.id) ? "Saving..." : "Save transfer"}</span>
                  </button>
                </div>
              </form>
            )}

            <DataTable headers={["Date", "Type", "Account", "Beneficiary", "Bank", "Amount", "Status", "Action"]}>
              {paginatedHistory.map((item) => (
                <div className={styles.tableRow} key={`${item.type}-${item.id}`} style={{ gridTemplateColumns: "1fr 0.6fr 0.75fr 1fr 1fr 0.75fr 0.75fr 1fr" }}>
                  <span>{item.date || "No date"}</span>
                  <span>{item.type}</span>
                  <span>{item.from_account || "N/A"}</span>
                  <span>
                    <strong>{item.account_name || "N/A"}</strong>
                    <small>{item.account_number || "No account number"}</small>
                  </span>
                  <span>
                    <strong>{item.bank_name || "No bank"}</strong>
                    {item.reason && <small>{item.reason}</small>}
                  </span>
                  <span>
                    <strong>{item.amount}</strong>
                    <small>Fee {item.fee}</small>
                  </span>
                  <span><StatusBadge status={item.status} /></span>
                  <span className={styles.inlineActions}>
                    <button className={styles.editActionBtn} type="button" onClick={() => setEditingTransfer(transferToEditForm(item))}>
                      <FiEdit2 />
                      <span>Edit</span>
                    </button>
                    <button className={styles.deleteActionBtn} type="button" onClick={() => deleteTransfer(item)} disabled={savingTransferId === String(item.id)}>
                      <FiTrash2 />
                      <span>Delete</span>
                    </button>
                  </span>
                </div>
              ))}
            </DataTable>

            <div className={styles.paginationBar}>
              <span>Showing {historyRangeStart}-{historyRangeEnd} of {visibleHistory.length}</span>
              <div className={styles.paginationActions}>
                <button className={styles.secondaryBtn} type="button" onClick={() => setHistoryPage(1)} disabled={historyCurrentPage === 1}>First</button>
                <button className={styles.secondaryBtn} type="button" onClick={() => setHistoryPage((value) => Math.max(1, value - 1))} disabled={historyCurrentPage === 1}>Previous</button>
                <strong>Page {historyCurrentPage} of {historyTotalPages}</strong>
                <button className={styles.secondaryBtn} type="button" onClick={() => setHistoryPage((value) => Math.min(historyTotalPages, value + 1))} disabled={historyCurrentPage === historyTotalPages}>Next</button>
                <button className={styles.secondaryBtn} type="button" onClick={() => setHistoryPage(historyTotalPages)} disabled={historyCurrentPage === historyTotalPages}>Last</button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState>No transfer history found for this customer.</EmptyState>
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.settingsHeader}>
          <div>
            <span className={styles.settingsEyebrow}><FiRefreshCw /> Refresh Simulated Data</span>
            <h2>Regenerate names and numbers</h2>
            <p>Refresh existing simulated transfers for the selected customer without creating new rows.</p>
          </div>
        </div>

        <form className={styles.settingsForm} onSubmit={submitRefresh}>
          <div className={styles.simGrid}>
            <label className={styles.field}>
              <span>Scope</span>
              <select value={refreshForm.scope} onChange={(event) => updateRefreshField("scope", event.target.value)}>
                <option value="day">Group by day</option>
                <option value="exact">Group by exact timestamp</option>
                <option value="row">Every row unique</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Name set</span>
              <select value={refreshForm.nameset} onChange={(event) => updateRefreshField("nameset", event.target.value)}>
                <option value="mix">People and companies</option>
                <option value="person">People only</option>
                <option value="company">Companies only</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Minimum bank rows</span>
              <input type="number" min="1" value={refreshForm.min_bank_count} onChange={(event) => updateRefreshField("min_bank_count", event.target.value)} />
            </label>
            {[
              ["update_reason", "Update empty reasons"],
              ["fill_wire_extras", "Fill wire extras"],
              ["preserve_existing", "Preserve existing values"],
              ["dry_run", "Dry run only"],
            ].map(([key, label]) => (
              <label className={styles.toggleRow} key={key}>
                <span>{label}</span>
                <input type="checkbox" checked={!!refreshForm[key]} onChange={(event) => updateRefreshField(key, event.target.checked)} />
              </label>
            ))}
          </div>

          <div className={styles.formActions}>
            <button className={styles.applyBtn} type="submit" disabled={refreshing}>
              <FiRefreshCw />
              <span>{refreshing ? "Refreshing..." : "Refresh simulated rows"}</span>
            </button>
          </div>
        </form>

        {refreshResult && (
          <div className={styles.paginationBar}>
            <span>Rows updated: {refreshResult.rows_updated ?? 0}</span>
            <span>Banks processed: {refreshResult.total_banks ?? 0}</span>
            <span>{refreshResult.dry_run ? "Dry run" : "Applied"}</span>
          </div>
        )}
      </section>
    </div>
  );
}
