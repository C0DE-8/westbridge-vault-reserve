import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { EmptyState } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminSettings() {
  const { notify } = useOutletContext();
  const [settings, setSettings] = useState(null);
  const [fees, setFees] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const [settingsRes, feeRes] = await Promise.allSettled([
          axiosInstance.get("/admin/security-codes/settings"),
          axiosInstance.get("/admin/transfer-fee"),
        ]);
        setSettings(settingsRes.value?.data?.settings || null);
        setFees(feeRes.value?.data?.fees || {});
      } catch (error) {
        notify(error?.response?.data?.error || "Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, [notify]);

  const updateSecuritySetting = async (key, value) => {
    const next = { ...(settings || {}), [key]: value };
    setSettings(next);

    try {
      await axiosInstance.post("/admin/security-codes/settings", next);
      notify("Security settings updated", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update security settings", "error");
    }
  };

  const updateFee = async (type, fee_amount) => {
    try {
      const res = await axiosInstance.post("/admin/set-transfer-fee", { type, fee_amount });
      notify(res.data?.message || "Transfer fee updated", "success");
      setFees((current) => ({ ...current, [type]: Number(fee_amount) }));
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update transfer fee", "error");
    }
  };

  if (loading) return <EmptyState>Loading settings...</EmptyState>;

  return (
    <section className={styles.panel}>
      <h2>Security and Fees</h2>
      <div className={styles.settingsGrid}>
        {["require_imf", "require_cot", "require_tax"].map((key) => (
          <label className={styles.toggleRow} key={key}>
            <span>{key.replace("require_", "").toUpperCase()} required</span>
            <input
              type="checkbox"
              checked={!!settings?.[key]}
              onChange={(e) => updateSecuritySetting(key, e.target.checked)}
            />
          </label>
        ))}

        {["local", "wire"].map((type) => (
          <label className={styles.feeRow} key={type}>
            <span>{type} transfer fee</span>
            <input
              type="number"
              defaultValue={fees?.[type] ?? ""}
              onBlur={(e) => e.target.value && updateFee(type, e.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
