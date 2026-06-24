import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCopy, FiSettings, FiUploadCloud, FiUser, FiXCircle } from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { resolveAsset } from "../../utils/assets";
import styles from "./UserPage.module.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { userUser, logout, updateSessionUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismissToast } = useGlassToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    axiosInstance
      .get("/user/profile")
      .then((res) => {
        if (!active) return;
        const nextProfile = res.data?.user || null;
        setProfile(nextProfile);
      })
      .catch(() => {
        if (active) {
          notify("Unable to load your profile right now.", "error", "Profile unavailable");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [notify]);

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  const imageUrl = resolveAsset(profile?.profile_image_url || "");
  const displayName = profile?.full_name || profile?.username || "User";
  const verificationLabel =
    profile?.acct_status === "active" || profile?.email_verified
      ? "Verified"
      : profile?.acct_status === "rejected"
        ? "Rejected"
        : "Pending review";

  const uploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append("image", file);
      const res = await axiosInstance.post("/user/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const image_url = res.data?.image_url || "";
      const nextProfile = { ...profile, profile_image_url: image_url };
      setProfile(nextProfile);
      updateSessionUser("user", { profile_image_url: image_url });
      notify(res.data?.message || "Profile image updated.", "success", "Image updated");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to upload image.", "error", "Image upload failed");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  const deleteAccount = async () => {
    try {
      setDeleting(true);
      const res = await axiosInstance.delete("/user/delete");
      notify(res.data?.message || "Account deleted successfully.", "success", "Account removed");
      logout("user");
      navigate("/", { replace: true });
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to delete your account.", "error", "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const copyValue = async (label, value) => {
    if (!value) {
      notify(`${label} is not available yet.`, "info", "Not assigned");
      return;
    }

    try {
      await navigator.clipboard.writeText(String(value));
      notify(`${label} copied.`, "success", "Copied");
    } catch {
      notify(`Unable to copy ${label.toLowerCase()}.`, "error", "Copy failed");
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
            <span><FiUser /></span>
            <h1>Profile</h1>
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

        {loading ? (
          <div className={styles.preloaderBlock}>
            <span />
            <strong>Loading profile...</strong>
          </div>
        ) : (
          <>
            <section className={styles.panel}>
              <div className={styles.profileHero}>
                <div className={styles.profileImage}>
                  {imageUrl ? <img src={imageUrl} alt={displayName} /> : displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2>{displayName}</h2>
                  <p>{profile?.email || "No email available"}</p>
                </div>
              </div>

              <div className={styles.profileActions}>
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                  <FiUploadCloud />
                  <span>{uploadingImage ? "Uploading..." : "Update photo"}</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={uploadImage} />
              </div>

              <div className={styles.profileGrid}>
                <div><span>Savings account</span><strong>{profile?.s_account_number || "Pending"}</strong></div>
                <div><span>Current account</span><strong>{profile?.c_account_number || "Pending"}</strong></div>
                <div><span>Currency</span><strong>{profile?.currency_sign || "$"}</strong></div>
                <div><span>Account status</span><strong>{profile?.acct_status || "Unknown"}</strong></div>
                <div><span>Verification</span><strong>{verificationLabel}</strong></div>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Account Details</h2>
                  <p>Registered account details are locked after onboarding approval. Contact bank support for any authorized changes.</p>
                </div>
              </div>
              <div className={styles.profileGrid}>
                <div><span>Account title</span><strong>{profile?.full_name || "Not set"}</strong></div>
                <div><span>Username</span><strong>{profile?.username || "Not set"}</strong></div>
                <div><span>Email</span><strong>{profile?.email || "Not set"}</strong></div>
                <div><span>Support route</span><strong>Contact West Bridge support for authorized changes</strong></div>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Bank Routing Details</h2>
                  <p>Use these details when a bank or payment provider asks for your routing information.</p>
                </div>
              </div>

              <div className={styles.copyGrid}>
                <button type="button" onClick={() => copyValue("Account title", profile?.full_name)}>
                  <span>Account title</span>
                  <strong>{profile?.full_name || "Not set"}</strong>
                  <FiCopy />
                </button>
                <button type="button" onClick={() => copyValue("Current account number", profile?.c_account_number)}>
                  <span>Current account</span>
                  <strong>{profile?.c_account_number || "Pending"}</strong>
                  <FiCopy />
                </button>
                <button type="button" onClick={() => copyValue("Savings account number", profile?.s_account_number)}>
                  <span>Savings account</span>
                  <strong>{profile?.s_account_number || "Pending"}</strong>
                  <FiCopy />
                </button>
                <button type="button" onClick={() => copyValue("Routing name", profile?.routing_name)}>
                  <span>Routing name</span>
                  <strong>{profile?.routing_name || "Not assigned"}</strong>
                  <FiCopy />
                </button>
                <button type="button" onClick={() => copyValue("Routing number", profile?.routing_number)}>
                  <span>{profile?.routing_type || "Routing"} number</span>
                  <strong>{profile?.routing_number || "Not assigned"}</strong>
                  <FiCopy />
                </button>
                <button type="button" onClick={() => copyValue("Routing type", profile?.routing_type)}>
                  <span>Routing type</span>
                  <strong>{profile?.routing_type || "Not assigned"}</strong>
                  <FiCopy />
                </button>
              </div>
            </section>

            <section className={styles.panel}>
              <div className={styles.panelHead}>
                <div>
                  <h2>Danger Zone</h2>
                  <p>Delete this online banking account permanently from the backend.</p>
                </div>
              </div>

              {!deleteConfirmOpen ? (
                <button type="button" className={styles.dangerButtonWide} onClick={() => setDeleteConfirmOpen(true)}>
                  <FiXCircle />
                  <span>Delete Account</span>
                </button>
              ) : (
                <div className={styles.dangerCard}>
                  <strong>Are you sure you want to delete this account?</strong>
                  <small>This action removes your user record and cannot be undone.</small>
                  <div className={styles.formActions}>
                    <button type="button" className={styles.secondaryAction} onClick={() => setDeleteConfirmOpen(false)}>
                      Keep Account
                    </button>
                    <button type="button" className={styles.dangerButtonWide} onClick={deleteAccount} disabled={deleting}>
                      {deleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </section>

      <MobileFooterNav />
      <UserSettingsDrawer
        open={settingsOpen}
        user={profile || userUser}
        displayName={displayName}
        theme={theme}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
    </main>
  );
}
