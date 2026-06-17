import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminTransfers() {
  const { notify } = useOutletContext();
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/all-transfers");
      setTransfers(res.data?.transfers || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load transfers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const updateTransferStatus = async (id, status) => {
    try {
      const res = await axiosInstance.put(`/admin/update-transfer-status/${id}`, { status });
      notify(res.data?.message || "Transfer updated", "success");
      loadTransfers();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update transfer", "error");
    }
  };

  if (loading) return <EmptyState>Loading transfers...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Transfers</h2>
      <DataTable headers={["Customer", "Type", "Beneficiary", "Amount", "Status", "Action"]}>
        {transfers.map((item) => (
          <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
            <span>{item.full_name}</span>
            <span>{item.type}</span>
            <span>{item.account_name || item.bank_name || "N/A"}</span>
            <span>{item.amount}</span>
            <span><StatusBadge status={item.status} /></span>
            <span className={styles.inlineActions}>
              <button onClick={() => updateTransferStatus(item.id, "approved")}>Approve</button>
              <button onClick={() => updateTransferStatus(item.id, "rejected")}>Reject</button>
            </span>
          </div>
        ))}
      </DataTable>
    </section>
  );
}
