import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../../api/axios";
import { EmptyState, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminOverview() {
  const [data, setData] = useState({
    applications: [],
    users: [],
    transfers: [],
    deposits: [],
    tickets: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const [onboardingRes, usersRes, transfersRes, depositsRes, ticketsRes] = await Promise.allSettled([
        axiosInstance.get("/admin/onboarding?status=all"),
        axiosInstance.get("/admin/users?pageSize=100"),
        axiosInstance.get("/admin/all-transfers"),
        axiosInstance.get("/admin/deposits"),
        axiosInstance.get("/admin/tickets"),
      ]);

      if (!active) return;

      setData({
        applications: onboardingRes.value?.data?.applications || [],
        users: usersRes.value?.data?.users || [],
        transfers: transfersRes.value?.data?.transfers || [],
        deposits: depositsRes.value?.data?.deposits || [],
        tickets: Array.isArray(ticketsRes.value?.data) ? ticketsRes.value.data : [],
      });
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const pendingApplications = data.applications.filter((item) => item.status === "pending").length;
    const pendingDeposits = data.deposits.filter((item) => item.status === "pending").length;
    const openTickets = data.tickets.filter((item) => String(item.status).toLowerCase() !== "closed").length;
    const transferVolume = data.transfers.reduce((sum, transfer) => {
      const amount = Number(String(transfer.amount || "0").replace(/[^\d.-]/g, ""));
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return {
      users: data.users.length,
      pendingApplications,
      pendingDeposits,
      openTickets,
      transferVolume,
    };
  }, [data]);

  if (loading) return <EmptyState>Loading admin overview...</EmptyState>;

  return (
    <>
      <div className={styles.cards}>
        <div className={styles.card}><h3>Total Users</h3><p>{stats.users}</p></div>
        <div className={styles.card}><h3>Pending Onboarding</h3><p>{stats.pendingApplications}</p></div>
        <div className={styles.card}><h3>Pending Deposits</h3><p>{stats.pendingDeposits}</p></div>
        <div className={styles.card}><h3>Open Tickets</h3><p>{stats.openTickets}</p></div>
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.panel}>
          <h2>Recent Onboarding</h2>
          {data.applications.slice(0, 5).length ? (
            data.applications.slice(0, 5).map((item) => (
              <div className={styles.compactRow} key={item.id}>
                <strong>{item.full_name}</strong>
                <StatusBadge status={item.status} />
              </div>
            ))
          ) : (
            <EmptyState>No onboarding records yet.</EmptyState>
          )}
        </section>

        <section className={styles.panel}>
          <h2>Transfer Volume</h2>
          <p className={styles.bigNumber}>${stats.transferVolume.toLocaleString()}</p>
          <span className={styles.muted}>{data.transfers.length} transfers loaded</span>
        </section>
      </div>
    </>
  );
}
