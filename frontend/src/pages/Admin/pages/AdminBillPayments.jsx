import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminBillPayments() {
  const { notify } = useOutletContext();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/bill-payments");
      setPayments(res.data?.payments || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load bill payments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const updatePayment = async (id, action) => {
    try {
      const res = await axiosInstance.put(`/admin/bill-payments/${id}/${action}`);
      notify(res.data?.message || "Bill payment updated", "success");
      loadPayments();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update bill payment", "error");
    }
  };

  if (loading) return <EmptyState>Loading bill payments...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Bill Payments</h2>
      <DataTable headers={["User", "Kind", "Category", "Provider", "Reference", "Account", "Amount", "Status", "Action"]}>
        {payments.map((item) => (
          <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
            <span>
              <strong>{item.username}</strong>
              {item.email && <small>{item.email}</small>}
            </span>
            <span>{item.payment_kind}</span>
            <span>{item.bill_category}</span>
            <span>
              <strong>{item.provider_name}</strong>
              {item.note ? <small>{item.note}</small> : null}
            </span>
            <span>{item.customer_reference}</span>
            <span>{item.from_account}</span>
            <span>{item.amount}</span>
            <span><StatusBadge status={item.status} /></span>
            <span className={styles.inlineActions}>
              {item.status === "pending" ? (
                <>
                  <button onClick={() => updatePayment(item.id, "confirm")}>Confirm</button>
                  <button onClick={() => updatePayment(item.id, "reject")}>Reject</button>
                </>
              ) : (
                <small>{item.reviewed_at || "Reviewed"}</small>
              )}
            </span>
          </div>
        ))}
      </DataTable>
    </section>
  );
}
