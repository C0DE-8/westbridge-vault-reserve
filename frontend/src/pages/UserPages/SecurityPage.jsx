import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLock, FiSettings } from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import styles from "./UserPage.module.css";

const INITIAL_PASSWORD_FORM = {
  current_password: "",
  new_password: "",
  confirm_password: "",
};

const INITIAL_PIN_FORM = {
  current_pin: "",
  new_pin: "",
  confirm_pin: "",
  first_pin: "",
  confirm_first_pin: "",
};

export default function SecurityPage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismissToast } = useGlassToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState(INITIAL_PASSWORD_FORM);
  const [pinForm, setPinForm] = useState(INITIAL_PIN_FORM);
  const [pinStatus, setPinStatus] = useState({ loading: true, has_pin: false, pin_mask: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingPin, setSavingPin] = useState(false);

  const displayName = userUser?.full_name || userUser?.username || "User";

  useEffect(() => {
    let active = true;
    axiosInstance
      .get("/user/pin")
      .then((res) => {
        if (!active) return;
        setPinStatus({
          loading: false,
          has_pin: !!res.data?.has_pin,
          pin_mask: res.data?.pin_mask || "",
        });
      })
      .catch(() => {
        if (active) {
          setPinStatus({ loading: false, has_pin: false, pin_mask: "" });
          notify("Unable to load PIN status right now.", "error", "Security unavailable");
        }
      });

    return () => {
      active = false;
    };
  }, [notify]);

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  const pinMode = useMemo(() => (pinStatus.has_pin ? "update" : "create"), [pinStatus.has_pin]);

  const submitPassword = async (event) => {
    event.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      notify("New password and confirmation must match.", "error", "Password mismatch");
      return;
    }

    try {
      setSavingPassword(true);
      const res = await axiosInstance.put("/user/change-password", {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      notify(res.data?.message || "Password updated successfully.", "success", "Password updated");
      setPasswordForm(INITIAL_PASSWORD_FORM);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update password.", "error", "Password update failed");
    } finally {
      setSavingPassword(false);
    }
  };

  const submitPin = async (event) => {
    event.preventDefault();

    if (pinMode === "create") {
      if (pinForm.first_pin !== pinForm.confirm_first_pin) {
        notify("PIN confirmation does not match.", "error", "PIN mismatch");
        return;
      }
    } else if (pinForm.new_pin !== pinForm.confirm_pin) {
      notify("New PIN and confirmation must match.", "error", "PIN mismatch");
      return;
    }

    try {
      setSavingPin(true);
      const payload =
        pinMode === "create"
          ? { transaction_pin: pinForm.first_pin }
          : { old_pin: pinForm.current_pin, new_pin: pinForm.new_pin };

      const res = await axiosInstance.post("/user/set-pin", payload);
      notify(res.data?.message || "PIN updated successfully.", "success", pinMode === "create" ? "PIN created" : "PIN updated");
      setPinForm(INITIAL_PIN_FORM);

      const pinRes = await axiosInstance.get("/user/pin");
      setPinStatus({
        loading: false,
        has_pin: !!pinRes.data?.has_pin,
        pin_mask: pinRes.data?.pin_mask || "",
      });
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update PIN.", "error", "PIN update failed");
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <main className={styles.page}>
      <GlassToast toasts={toasts} onDismiss={dismissToast} />

      <section className={styles.shell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate("/more")} aria-label="Back to more">
            <FiArrowLeft />
          </button>
          <div>
            <span><FiLock /></span>
            <h1>Security</h1>
          </div>
          <button
            className={styles.mobileSettingsButton}
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label="Open settings"
          >
            <FiSettings />
          </button>
        </header>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Change Password</h2>
              <p>Update the password you use for signing in to online banking.</p>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={submitPassword}>
            <label>
              Current password
              <input
                type="password"
                value={passwordForm.current_password}
                onChange={(event) => setPasswordForm((current) => ({ ...current, current_password: event.target.value }))}
                required
              />
            </label>
            <label>
              New password
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(event) => setPasswordForm((current) => ({ ...current, new_password: event.target.value }))}
                minLength={6}
                required
              />
            </label>
            <label>
              Confirm new password
              <input
                type="password"
                value={passwordForm.confirm_password}
                onChange={(event) => setPasswordForm((current) => ({ ...current, confirm_password: event.target.value }))}
                minLength={6}
                required
              />
            </label>
            <button type="submit" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Transaction PIN</h2>
              <p>Use your transaction PIN for transfers, bills, and account actions.</p>
            </div>
          </div>

          {pinStatus.loading ? (
            <div className={styles.preloaderBlock}>
              <span />
              <strong>Loading PIN status...</strong>
            </div>
          ) : (
            <>
              <div className={styles.notice}>
                {pinStatus.has_pin ? `Current PIN: ${pinStatus.pin_mask}` : "No transaction PIN has been set yet."}
              </div>

              <form className={`${styles.formGrid} ${styles.pinModule}`} onSubmit={submitPin}>
                {pinMode === "create" ? (
                  <>
                    <label>
                      New 6-digit PIN
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pinForm.first_pin}
                        onChange={(event) => setPinForm((current) => ({ ...current, first_pin: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Confirm new PIN
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pinForm.confirm_first_pin}
                        onChange={(event) => setPinForm((current) => ({ ...current, confirm_first_pin: event.target.value }))}
                        required
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <label>
                      Current PIN
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pinForm.current_pin}
                        onChange={(event) => setPinForm((current) => ({ ...current, current_pin: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      New PIN
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pinForm.new_pin}
                        onChange={(event) => setPinForm((current) => ({ ...current, new_pin: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Confirm new PIN
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pinForm.confirm_pin}
                        onChange={(event) => setPinForm((current) => ({ ...current, confirm_pin: event.target.value }))}
                        required
                      />
                    </label>
                  </>
                )}
                <button type="submit" disabled={savingPin}>
                  {savingPin ? "Saving..." : pinMode === "create" ? "Create PIN" : "Update PIN"}
                </button>
              </form>
            </>
          )}
        </section>
      </section>

      <MobileFooterNav />
      <UserSettingsDrawer
        open={settingsOpen}
        user={userUser}
        displayName={displayName}
        theme={theme}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </main>
  );
}
