import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminDeposits() {
  const { notify } = useOutletContext();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/deposits");
      setDeposits(res.data?.deposits || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load deposits", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const updateDeposit = async (id, action) => {
    try {
      const res = await axiosInstance.put(`/admin/deposit/${id}/${action}`);
      notify(res.data?.message || "Deposit updated", "success");
      loadDeposits();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update deposit", "error");
    }
  };

  if (loading) return <EmptyState>Loading deposits...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Deposits</h2>
      <DataTable headers={["User", "Wallet", "Amount", "Status", "Proof", "Action"]}>
        {deposits.map((item) => (
          <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
            <span>{item.username}</span>
            <span>{item.wallet_name}</span>
            <span>{item.amount}</span>
            <span><StatusBadge status={item.status} /></span>
            <a href={item.proof_url} target="_blank" rel="noreferrer">View</a>
            <span className={styles.inlineActions}>
              <button onClick={() => updateDeposit(item.id, "confirm")}>Confirm</button>
              <button onClick={() => updateDeposit(item.id, "reject")}>Reject</button>
            </span>
          </div>
        ))}
      </DataTable>
    </section>
  );
}
