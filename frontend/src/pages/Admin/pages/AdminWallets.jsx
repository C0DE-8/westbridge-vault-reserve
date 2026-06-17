import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { EmptyState } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminWallets() {
  const { notify } = useOutletContext();
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallets() {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/admin/wallets");
        setWallets(res.data?.wallets || []);
      } catch (error) {
        notify(error?.response?.data?.error || "Failed to load wallets", "error");
      } finally {
        setLoading(false);
      }
    }

    loadWallets();
  }, [notify]);

  if (loading) return <EmptyState>Loading wallets...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Wallets</h2>
      {wallets.length === 0 ? (
        <EmptyState>No wallets found.</EmptyState>
      ) : (
        <div className={styles.walletGrid}>
          {wallets.map((wallet) => (
            <article className={styles.walletCard} key={wallet.id}>
              {wallet.qrcode_url && <img src={wallet.qrcode_url} alt={wallet.wallet_name} />}
              <strong>{wallet.wallet_name}</strong>
              <p>{wallet.wallet_address}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
