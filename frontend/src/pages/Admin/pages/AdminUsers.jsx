import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { DataTable, EmptyState, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminUsers() {
  const { notify } = useOutletContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/users?pageSize=100");
        setUsers(res.data?.users || []);
      } catch (error) {
        notify(error?.response?.data?.error || "Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, [notify]);

  if (loading) return <EmptyState>Loading users...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Users</h2>
      <DataTable headers={["User", "Email", "Account", "Status", "Verified"]}>
        {users.map((item) => (
          <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))" }}>
            <span>{item.full_name || item.username}</span>
            <span>{item.email}</span>
            <span>{item.account_number || "Pending"}</span>
            <span><StatusBadge status={item.acct_status} /></span>
            <span>{item.email_verified ? "Yes" : "No"}</span>
          </div>
        ))}
      </DataTable>
    </section>
  );
}
