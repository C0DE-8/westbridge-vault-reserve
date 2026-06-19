import { useEffect, useMemo, useState } from "react";
import { FiCopy, FiDollarSign, FiFilter, FiRefreshCw, FiSave, FiShield } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge, TransferSettingsSkeleton } from "../AdminPrimitives";
import styles from "../Admin.module.css";

const INITIAL_CODES = {
  imf_code: "",
  cot_code: "",
  tax_code: "",
};

const INITIAL_SETTINGS = {
  require_imf: true,
  require_cot: true,
  require_tax: true,
};

const PAGE_SIZE_OPTIONS = [10, 25, 50];

const codeFields = [
  { key: "imf_code", setting: "require_imf", label: "IMF Code" },
  { key: "cot_code", setting: "require_cot", label: "COT Code" },
  { key: "tax_code", setting: "require_tax", label: "TAX Code" },
];

const feeTypes = [
  { type: "local", label: "Local Transfer Fee" },
  { type: "wire", label: "Wire Transfer Fee" },
];

const formatFee = (value) => {
  const amount = Number(value || 0);
  return `$${amount.toFixed(2)}`;
};

export default function AdminTransfers() {
  const outletContext = useOutletContext() || {};
  const notify = outletContext.notify || (() => {});
  const [transfers, setTransfers] = useState([]);
  const [securityCodes, setSecurityCodes] = useState(INITIAL_CODES);
  const [securitySettings, setSecuritySettings] = useState(INITIAL_SETTINGS);
  const [fees, setFees] = useState({});
  const [feeDrafts, setFeeDrafts] = useState({});
  const [filters, setFilters] = useState({ search: "", type: "all", status: "all" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [savingCodes, setSavingCodes] = useState(false);
  const [savingFee, setSavingFee] = useState("");

  const loadTransfersPage = async () => {
    try {
      setLoading(true);
      const [transfersRes, settingsRes, feesRes, codesRes] = await Promise.allSettled([
        axiosInstance.get("/admin/all-transfers"),
        axiosInstance.get("/admin/security-codes/settings"),
        axiosInstance.get("/admin/transfer-fee"),
        axiosInstance.get("/admin/security-codes"),
      ]);

      if (transfersRes.status === "fulfilled") {
        setTransfers(transfersRes.value.data?.transfers || []);
      }

      if (settingsRes.status === "fulfilled") {
        setSecuritySettings(settingsRes.value.data?.settings || INITIAL_SETTINGS);
      }

      if (feesRes.status === "fulfilled") {
        const nextFees = feesRes.value.data?.fees || {};
        setFees(nextFees);
        setFeeDrafts({
          local: nextFees.local ?? "",
          wire: nextFees.wire ?? "",
        });
      }

      if (codesRes.status === "fulfilled") {
        const nextCodes = codesRes.value.data?.codes || {};
        setSecurityCodes({
          imf_code: nextCodes.imf_code || "",
          cot_code: nextCodes.cot_code || "",
          tax_code: nextCodes.tax_code || "",
        });
      }

      const failedRequests = [transfersRes, settingsRes, feesRes, codesRes].filter((item) => item.status === "rejected");
      if (transfersRes.status === "rejected") {
        notify(transfersRes.reason?.response?.data?.error || "Failed to load transfers", "error");
      } else if (failedRequests.length > 0) {
        notify("Some transfer controls could not be loaded.", "info");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfersPage();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  const filteredTransfers = useMemo(() => {
    const term = filters.search.trim().toLowerCase();

    return transfers.filter((item) => {
      const status = String(item.status || "").toLowerCase();
      const type = String(item.type || "").toLowerCase();
      const matchesType = filters.type === "all" || type === filters.type;
      const matchesStatus = filters.status === "all" || status === filters.status;
      const matchesSearch = !term || [
        item.full_name,
        item.email,
        item.account_name,
        item.account_number,
        item.bank_name,
        item.amount,
        item.fee,
        item.date,
      ].some((value) => String(value || "").toLowerCase().includes(term));

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [filters, transfers]);

  const totalPages = Math.max(1, Math.ceil(filteredTransfers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTransfers = filteredTransfers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const rangeStart = filteredTransfers.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(currentPage * pageSize, filteredTransfers.length);

  const updateTransferStatus = async (id, status) => {
    try {
      const res = await axiosInstance.put(`/admin/update-transfer-status/${id}`, { status });
      notify(res.data?.message || "Transfer updated", "success");
      loadTransfersPage();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update transfer", "error");
    }
  };

  const updateSecuritySetting = async (key, value) => {
    const next = { ...securitySettings, [key]: value };
    setSecuritySettings(next);

    try {
      await axiosInstance.post("/admin/security-codes/settings", next);
      notify("Security requirement updated", "success");
    } catch (error) {
      setSecuritySettings(securitySettings);
      notify(error?.response?.data?.error || "Failed to update security requirement", "error");
    }
  };

  const toggleAllRequirements = async (enabled) => {
    const next = {
      require_imf: enabled,
      require_cot: enabled,
      require_tax: enabled,
    };
    setSecuritySettings(next);

    try {
      await axiosInstance.post("/admin/security-codes/settings", { require_codes: enabled });
      notify(`All security codes ${enabled ? "enabled" : "disabled"}`, "success");
    } catch (error) {
      setSecuritySettings(securitySettings);
      notify(error?.response?.data?.error || "Failed to update security requirements", "error");
    }
  };

  const submitSecurityCodes = async (event) => {
    event.preventDefault();

    if (!securityCodes.imf_code || !securityCodes.cot_code || !securityCodes.tax_code) {
      notify("IMF, COT, and TAX codes are required.", "error");
      return;
    }

    try {
      setSavingCodes(true);
      const res = await axiosInstance.put("/admin/security-codes", securityCodes);
      notify(res.data?.message || "Security codes updated", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update security codes", "error");
    } finally {
      setSavingCodes(false);
    }
  };

  const updateFee = async (type) => {
    const feeAmount = feeDrafts[type];
    if (feeAmount === "" || Number.isNaN(Number(feeAmount)) || Number(feeAmount) < 0) {
      notify("Enter a valid transfer fee.", "error");
      return;
    }

    try {
      setSavingFee(type);
      const res = await axiosInstance.post("/admin/set-transfer-fee", { type, fee_amount: feeAmount });
      setFees((current) => ({ ...current, [type]: Number(feeAmount) }));
      notify(res.data?.message || "Transfer fee updated", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update transfer fee", "error");
    } finally {
      setSavingFee("");
    }
  };

  const copyCode = async (label, value) => {
    try {
      await navigator.clipboard?.writeText(value);
      notify(`${label} copied`, "success");
    } catch {
      notify(`Failed to copy ${label}`, "error");
    }
  };

  if (loading) return <TransferSettingsSkeleton />;

  return (
    <div className={styles.settingsStack}>
      <div className={styles.transferControlGrid}>
        <section className={styles.panel}>
          <div className={styles.settingsHeader}>
            <div>
              <span className={styles.settingsEyebrow}><FiShield /> Security Code Requirements</span>
              <h2>Required transfer codes</h2>
              <p>View the active IMF, COT, and TAX codes. Turn all requirements on or off, or manage each code separately.</p>
            </div>
          </div>

          <div className={styles.requirementActions}>
            <button className={styles.applyBtn} type="button" onClick={() => toggleAllRequirements(true)}>
              Enable all
            </button>
            <button className={styles.secondaryBtn} type="button" onClick={() => toggleAllRequirements(false)}>
              Disable all
            </button>
          </div>

          <form className={styles.settingsForm} onSubmit={submitSecurityCodes}>
            <div className={styles.codeControlList}>
              {codeFields.map((item) => (
                <div className={styles.codeControlCard} key={item.key}>
                  <label className={styles.codeToggleRow}>
                    <span>{item.label} required</span>
                    <input
                      type="checkbox"
                      checked={!!securitySettings?.[item.setting]}
                      onChange={(event) => updateSecuritySetting(item.setting, event.target.checked)}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Current {item.label}</span>
                    <div className={styles.copyField}>
                      <input
                        type="text"
                        value={securityCodes[item.key]}
                        onChange={(event) => setSecurityCodes((current) => ({ ...current, [item.key]: event.target.value }))}
                        required
                      />
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() => copyCode(item.label, securityCodes[item.key])}
                        disabled={!securityCodes[item.key]}
                      >
                        <FiCopy />
                        <span>Copy</span>
                      </button>
                    </div>
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.formActions}>
              <button className={styles.refreshBtn} type="submit" disabled={savingCodes}>
                <FiSave />
                <span>{savingCodes ? "Saving..." : "Save security codes"}</span>
              </button>
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.settingsHeader}>
            <div>
              <span className={styles.settingsEyebrow}><FiDollarSign /> Transfer Fee Management</span>
              <h2>Local and wire fees</h2>
              <p>See each current fee and update the amount charged when customers submit a transfer.</p>
            </div>
          </div>

          <div className={styles.feeCardGrid}>
            {feeTypes.map((item) => (
              <article className={styles.feeManageCard} key={item.type}>
                <div>
                  <h3>{item.label}</h3>
                  <span>Current Fee</span>
                  <strong>{formatFee(fees[item.type])}</strong>
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
      </div>

      <section className={styles.panel}>
        <div className={styles.settingsHeader}>
          <div>
            <span className={styles.settingsEyebrow}><FiFilter /> All Transfers</span>
            <h2>Transfer history</h2>
            <p>Filter transfers by customer, beneficiary, account number, type, status, amount, or date.</p>
          </div>
          <button className={styles.secondaryBtn} type="button" onClick={loadTransfersPage}>
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>

        <div className={styles.transferFilters}>
          <label className={styles.field}>
            <span>Search</span>
            <input
              type="search"
              placeholder="Customer, email, account, bank..."
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            />
          </label>
          <label className={styles.field}>
            <span>Transfer type</span>
            <select value={filters.type} onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}>
              <option value="all">All types</option>
              <option value="local">Local</option>
              <option value="wire">Wire</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>Status</span>
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="all">All statuses</option>
              <option value="processing">Processing</option>
              <option value="pending_admin">Pending admin</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>Rows per page</span>
            <select value={pageSize} onChange={(event) => setPageSize(Number(event.target.value))}>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option value={size} key={size}>{size}</option>
              ))}
            </select>
          </label>
        </div>

        {paginatedTransfers.length ? (
          <>
            <DataTable headers={["Customer", "Type", "Beneficiary", "Amount", "Fee", "Status", "Action"]}>
              {paginatedTransfers.map((item) => (
                <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "1.25fr 0.7fr 1.2fr 0.75fr 0.75fr 0.85fr 1fr" }}>
                  <span>
                    <strong>{item.full_name || "Unknown customer"}</strong>
                    <small>{item.email}</small>
                  </span>
                  <span>{item.type}</span>
                  <span>
                    <strong>{item.account_name || "N/A"}</strong>
                    <small>{item.bank_name || "No bank"} {item.account_number ? `- ${item.account_number}` : ""}</small>
                  </span>
                  <span>{item.amount}</span>
                  <span>{item.fee}</span>
                  <span><StatusBadge status={item.status} /></span>
                  <span className={styles.inlineActions}>
                    <button onClick={() => updateTransferStatus(item.id, "completed")}>Complete</button>
                    <button onClick={() => updateTransferStatus(item.id, "failed")}>Fail</button>
                  </span>
                </div>
              ))}
            </DataTable>

            <div className={styles.paginationBar}>
              <span>Showing {rangeStart}-{rangeEnd} of {filteredTransfers.length}</span>
              <div className={styles.paginationActions}>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage(1)} disabled={currentPage === 1}>
                  First
                </button>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>
                  Previous
                </button>
                <strong>Page {currentPage} of {totalPages}</strong>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage === totalPages}>
                  Next
                </button>
                <button className={styles.secondaryBtn} type="button" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages}>
                  Last
                </button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState>No transfers found for the selected filters.</EmptyState>
        )}
      </section>
    </div>
  );
}
