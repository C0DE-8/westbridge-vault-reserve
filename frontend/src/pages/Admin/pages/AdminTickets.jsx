import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminTickets() {
  const { notify } = useOutletContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/tickets");
      setTickets(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const closeTicket = async (id) => {
    try {
      const res = await axiosInstance.put(`/admin/tickets/${id}/close`);
      notify(res.data?.message || "Ticket closed", "success");
      loadTickets();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to close ticket", "error");
    }
  };

  if (loading) return <EmptyState>Loading tickets...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Support Tickets</h2>
      <DataTable headers={["User", "Subject", "Status", "Created", "Action"]}>
        {tickets.map((item) => (
          <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            <span>{item.user_username || item.user_id}</span>
            <span>{item.subject}</span>
            <span><StatusBadge status={item.status} /></span>
            <span>{item.created_at ? new Date(item.created_at).toLocaleString() : "N/A"}</span>
            <span className={styles.inlineActions}>
              <button onClick={() => closeTicket(item.id)}>Close</button>
            </span>
          </div>
        ))}
      </DataTable>
    </section>
  );
}
