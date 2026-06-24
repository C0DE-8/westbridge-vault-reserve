import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  FiEdit2,
  FiEye,
  FiImage,
  FiLogIn,
  FiPlus,
  FiRefreshCw,
  FiSave,
  FiSearch,
  FiShield,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";
import axiosInstance from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import { DataTable, EmptyState, resolveAsset, StatusBadge, TableSkeleton } from "../AdminPrimitives";
import styles from "../Admin.module.css";

const INITIAL_EDIT = {
  full_name: "",
  username: "",
  email: "",
  acct_status: "active",
  email_verified: true,
  currency_sign: "$",
  current_balance: "0",
  savings_balance: "0",
  loan_balance: "0",
  c_account_number: "",
  s_account_number: "",
  routing_name: "",
  routing_number: "",
  routing_type: "ABA",
  generate_routing: false,
};

const INITIAL_CREATE = {
  full_name: "",
  username: "",
  email: "",
  password: "",
  acct_status: "active",
  email_verified: true,
  currency_sign: "$",
  current_balance: "0",
  savings_balance: "0",
  loan_balance: "0",
  send_welcome: true,
};

const ACCOUNT_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
  { value: "hold", label: "Hold" },
  { value: "blocked", label: "Blocked" },
  { value: "suspended", label: "Suspended" },
  { value: "not_available_in_your_region", label: "Not available in your region" },
];

export default function AdminUsers() {
  const { notify } = useOutletContext();
  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [editForm, setEditForm] = useState(INITIAL_EDIT);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(INITIAL_CREATE);
  const [editImageFile, setEditImageFile] = useState(null);
  const [createImageFile, setCreateImageFile] = useState(null);
  const [savingId, setSavingId] = useState("");
  const [impersonatingId, setImpersonatingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletingId, setDeletingId] = useState("");
  const editFileRef = useRef(null);
  const createFileRef = useRef(null);
  const viewFileRef = useRef(null);

  const loadUsers = async (next = {}) => {
    const nextQuery = next.query ?? query;
    const nextStatus = next.status ?? statusFilter;

    try {
      setLoading(true);
      const params = new URLSearchParams({ pageSize: "100" });
      if (nextQuery.trim()) params.set("q", nextQuery.trim());
      if (nextStatus !== "all") params.set("status", nextStatus);

      const res = await axiosInstance.get(`/admin/users?${params.toString()}`);
      setUsers(res.data?.users || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers({ query: "", status: "all" });
  }, []);

  const stats = useMemo(() => {
    const active = users.filter((item) => String(item.acct_status).toLowerCase() === "active").length;
    const pending = users.filter((item) => String(item.acct_status).toLowerCase() === "pending").length;
    const verified = users.filter((item) => !!item.email_verified).length;
    const hold = users.filter((item) => String(item.acct_status).toLowerCase() === "hold").length;
    return { total: users.length, active, pending, verified, hold };
  }, [users]);

  const openEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      full_name: user.full_name || "",
      username: user.username || "",
      email: user.email || "",
      acct_status: user.acct_status || "active",
      email_verified: !!user.email_verified,
      currency_sign: user.currency_sign || "$",
      current_balance: String(user.current_balance ?? "0"),
      savings_balance: String(user.savings_balance ?? "0"),
      loan_balance: String(user.loan_balance ?? "0"),
      c_account_number: user.c_account_number || "",
      s_account_number: user.s_account_number || "",
      routing_name: user.routing_name || "",
      routing_number: user.routing_number || "",
      routing_type: user.routing_type || "ABA",
      generate_routing: false,
    });
    setEditImageFile(null);
  };

  const closeEdit = () => {
    setEditingUser(null);
    setEditForm(INITIAL_EDIT);
    setEditImageFile(null);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setCreateForm(INITIAL_CREATE);
    setCreateImageFile(null);
  };

  const updateUserRow = (userId, updates) => {
    setUsers((current) => current.map((item) => (item.id === userId ? { ...item, ...updates } : item)));
    setViewingUser((current) => (current && current.id === userId ? { ...current, ...updates } : current));
    setEditingUser((current) => (current && current.id === userId ? { ...current, ...updates } : current));
  };

  const uploadUserImage = async (userId, file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.post(`/admin/users/${userId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.image_url || "";
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    if (!editingUser) return;

    try {
      setSavingId(`edit-${editingUser.id}`);
      const res = await axiosInstance.patch(`/admin/users/${editingUser.id}`, editForm);
      const updated = res.data?.user;
      let nextImageUrl = updated?.profile_image_url || "";

      if (editImageFile) {
        nextImageUrl = await uploadUserImage(editingUser.id, editImageFile);
      }

      if (updated) {
        updateUserRow(editingUser.id, { ...updated, ...(nextImageUrl ? { profile_image_url: nextImageUrl } : {}) });
      }
      notify("User account updated", "success");
      closeEdit();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update user", "error");
    } finally {
      setSavingId("");
    }
  };

  const submitCreate = async (event) => {
    event.preventDefault();

    try {
      setSavingId("create-user");
      const res = await axiosInstance.post("/admin/create/users", createForm);
      const created = res.data?.user;
      if (created) {
        let nextUser = created;
        if (createImageFile && created.id) {
          const image_url = await uploadUserImage(created.id, createImageFile);
          nextUser = { ...created, profile_image_url: image_url };
        }
        setUsers((current) => [nextUser, ...current]);
      }
      notify(res.data?.message || "User created successfully", "success");
      closeCreate();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to create user", "error");
    } finally {
      setSavingId("");
    }
  };

  const handleImpersonate = async (user) => {
    try {
      setImpersonatingId(String(user.id));
      const res = await axiosInstance.post(`/admin/users/${user.id}/impersonate`, {
        reason: "admin_console_access",
      });

      if (res.data?.token && res.data?.user) {
        saveSession(res.data.token, res.data.user);
        notify(`User session ready for ${user.username}`, "success");
        const popup = window.open("/dashboard", "_blank");
        if (!popup) {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to sign in as user", "error");
    } finally {
      setImpersonatingId("");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingId(String(deleteTarget.id));
      const res = await axiosInstance.delete(`/admin/users/${deleteTarget.id}`);
      setUsers((current) => current.filter((item) => item.id !== deleteTarget.id));
      notify(res.data?.message || "User deleted successfully", "success");
      setDeleteTarget(null);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to delete user", "error");
    } finally {
      setDeletingId("");
    }
  };

  const handleResetPin = async (user) => {
    try {
      const res = await axiosInstance.post(`/admin/users/${user.id}/reset-pin`);
      notify(res.data?.message || "User PIN reset to default", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to reset user PIN", "error");
    }
  };

  const handleResetPassword = async (user) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${user.id}/reset-password`);
      const tempPassword = res.data?.temporary_password;
      notify(
        tempPassword ? `Password reset. Temporary password: ${tempPassword}` : (res.data?.message || "User password reset"),
        "success"
      );
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to reset user password", "error");
    }
  };

  const handleToggleLoginOtp = async (user) => {
    const nextEnabled = !user.login_otp_enabled;
    try {
      const res = await axiosInstance.put("/admin/user/login-otp-toggle", {
        userId: user.id,
        enabled: nextEnabled,
      });
      updateUserRow(user.id, { login_otp_enabled: nextEnabled ? 1 : 0 });
      notify(res.data?.message || "Login OTP updated", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to update login OTP", "error");
    }
  };

  const handleViewImageUpload = async (user, file) => {
    try {
      const image_url = await uploadUserImage(user.id, file);
      updateUserRow(user.id, { profile_image_url: image_url });
      notify("User image updated", "success");
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to upload user image", "error");
    }
  };

  const submitFilters = (event) => {
    event.preventDefault();
    loadUsers();
  };

  if (loading) return <TableSkeleton columns={6} rows={8} />;

  return (
    <>
      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Users</h2>
            <p className={styles.subtitle}>Manage account details, access, balances, and user session support.</p>
          </div>
          <button className={styles.refreshBtn} type="button" onClick={() => loadUsers()}>
            <FiRefreshCw />
            <span>Refresh</span>
          </button>
        </div>

        <form className={styles.adminFilterBar} onSubmit={submitFilters}>
          <label className={styles.adminSearchField}>
            <FiSearch />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, username, email, or account number"
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => {
              const next = event.target.value;
              setStatusFilter(next);
              loadUsers({ status: next });
            }}
          >
            <option value="all">All statuses</option>
            {ACCOUNT_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button className={styles.applyBtn} type="submit">
            <FiSearch />
            <span>Apply</span>
          </button>

          <button className={styles.createBtn} type="button" onClick={() => setCreateOpen(true)}>
            <FiPlus />
            <span>Create user</span>
          </button>
        </form>

        <div className={styles.adminStatsGrid}>
          <article className={styles.adminStatCard}>
            <span>Total users</span>
            <strong>{stats.total}</strong>
          </article>
          <article className={styles.adminStatCard}>
            <span>Active</span>
            <strong>{stats.active}</strong>
          </article>
          <article className={styles.adminStatCard}>
            <span>Pending</span>
            <strong>{stats.pending}</strong>
          </article>
          <article className={styles.adminStatCard}>
            <span>Verified</span>
            <strong>{stats.verified}</strong>
          </article>
        </div>
      </section>

      <section className={styles.panel}>
        {users.length === 0 ? (
          <EmptyState>No users found for the selected filters.</EmptyState>
        ) : (
          <>
            <div className={styles.adminUsersDesktopTable}>
              <DataTable headers={["User", "Accounts", "Balances", "Status", "Security", "Actions"]}>
                {users.map((item) => {
                  const avatar = resolveAsset(item.profile_image_url);
                  return (
                    <div className={styles.tableRow} key={item.id} style={{ gridTemplateColumns: "1.35fr 1fr 1fr 0.8fr 0.8fr 1.15fr" }}>
                      <div className={styles.adminUserCell}>
                        {avatar ? (
                          <img className={styles.adminAvatar} src={avatar} alt={item.full_name || item.username} />
                        ) : (
                          <div className={styles.adminAvatarFallback}>
                            {(item.full_name || item.username || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <strong>{item.full_name || item.username}</strong>
                          <small>@{item.username}</small>
                          <small>{item.email}</small>
                        </div>
                      </div>

                      <span>
                        <strong>{item.account_number || "Pending"}</strong>
                        <small>Current: {item.c_account_number || "N/A"}</small>
                        <small>Savings: {item.s_account_number || "N/A"}</small>
                        <small>Routing: {item.routing_number || "Not assigned"}</small>
                      </span>

                      <span>
                        <strong>{item.currency_sign}{Number(item.current_balance || 0).toLocaleString()}</strong>
                        <small>Savings: {item.currency_sign}{Number(item.savings_balance || 0).toLocaleString()}</small>
                        <small>Loan: {item.currency_sign}{Number(item.loan_balance || 0).toLocaleString()}</small>
                      </span>

                      <span><StatusBadge status={item.acct_status} /></span>

                      <span>
                        <strong>{item.email_verified ? "Verified" : "Not verified"}</strong>
                        <small>Currency: {item.currency_sign || "$"}</small>
                        <small>Login OTP: {item.login_otp_enabled ? "On" : "Off"}</small>
                      </span>

                      <span className={styles.adminActionGroup}>
                        <button type="button" className={styles.secondaryBtn} onClick={() => setViewingUser(item)}>
                          <FiEye />
                          <span>View</span>
                        </button>
                        <button type="button" className={styles.editBtn} onClick={() => openEdit(item)}>
                          <FiEdit2 />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className={styles.loginBtn}
                          onClick={() => handleImpersonate(item)}
                          disabled={impersonatingId === String(item.id)}
                        >
                          <FiLogIn />
                          <span>{impersonatingId === String(item.id) ? "Opening..." : "Login"}</span>
                        </button>
                        <button type="button" className={styles.logoutBtn} onClick={() => setDeleteTarget(item)}>
                          <FiTrash2 />
                          <span>Delete</span>
                        </button>
                      </span>
                    </div>
                  );
                })}
              </DataTable>
            </div>

            <div className={styles.adminUsersMobileList}>
              {users.map((item) => {
                const avatar = resolveAsset(item.profile_image_url);
                return (
                  <article className={styles.adminUserMobileCard} key={`mobile-${item.id}`}>
                    <div className={styles.adminUserCell}>
                      {avatar ? (
                        <img className={styles.adminAvatar} src={avatar} alt={item.full_name || item.username} />
                      ) : (
                        <div className={styles.adminAvatarFallback}>
                          {(item.full_name || item.username || "U").charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <strong>{item.full_name || item.username}</strong>
                        <small>@{item.username}</small>
                        <small>{item.email}</small>
                      </div>
                    </div>

                    <div className={styles.adminMobileMeta}>
                      <div>
                        <span>Account</span>
                        <strong>{item.account_number || "Pending"}</strong>
                        <small>Current: {item.c_account_number || "N/A"}</small>
                        <small>Savings: {item.s_account_number || "N/A"}</small>
                        <small>Routing: {item.routing_number || "Not assigned"}</small>
                      </div>
                      <div>
                        <span>Balances</span>
                        <strong>{item.currency_sign}{Number(item.current_balance || 0).toLocaleString()}</strong>
                        <small>Savings: {item.currency_sign}{Number(item.savings_balance || 0).toLocaleString()}</small>
                        <small>Loan: {item.currency_sign}{Number(item.loan_balance || 0).toLocaleString()}</small>
                      </div>
                      <div>
                        <span>Status</span>
                        <div className={styles.adminStatusWrap}><StatusBadge status={item.acct_status} /></div>
                        <small>{item.email_verified ? "Verified" : "Not verified"}</small>
                        <small>Login OTP: {item.login_otp_enabled ? "On" : "Off"}</small>
                      </div>
                    </div>

                    <div className={styles.adminMobileActions}>
                      <button type="button" className={styles.secondaryBtn} onClick={() => setViewingUser(item)}>
                        <FiEye />
                        <span>View</span>
                      </button>
                      <button type="button" className={styles.editBtn} onClick={() => openEdit(item)}>
                        <FiEdit2 />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className={styles.loginBtn}
                        onClick={() => handleImpersonate(item)}
                        disabled={impersonatingId === String(item.id)}
                      >
                        <FiLogIn />
                        <span>{impersonatingId === String(item.id) ? "Opening..." : "Login"}</span>
                      </button>
                      <button type="button" className={`${styles.logoutBtn} ${styles.mobileDeleteBtn}`} onClick={() => setDeleteTarget(item)}>
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </section>

      {editingUser && (
        <div className={styles.adminModalOverlay} onClick={closeEdit}>
          <div className={styles.adminModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.adminModalHeader}>
              <div>
                <span className={styles.settingsEyebrow}><FiUser /> Edit User</span>
                <h2>{editingUser.full_name || editingUser.username}</h2>
                <p>Update user account details, balances, verification, and account numbers.</p>
              </div>
              <button type="button" className={styles.adminModalClose} onClick={closeEdit} aria-label="Close edit user modal">
                <FiX />
              </button>
            </div>

            <form className={styles.settingsForm} onSubmit={submitEdit}>
              <div className={styles.settingsFormGrid}>
                <label className={styles.field}>
                  <span>Full name</span>
                  <input value={editForm.full_name} onChange={(event) => setEditForm((current) => ({ ...current, full_name: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Username</span>
                  <input value={editForm.username} onChange={(event) => setEditForm((current) => ({ ...current, username: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" value={editForm.email} onChange={(event) => setEditForm((current) => ({ ...current, email: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Currency sign</span>
                  <input value={editForm.currency_sign} onChange={(event) => setEditForm((current) => ({ ...current, currency_sign: event.target.value }))} maxLength={5} />
                </label>
                <label className={styles.field}>
                  <span>Account status</span>
                  <select value={editForm.acct_status} onChange={(event) => setEditForm((current) => ({ ...current, acct_status: event.target.value }))}>
                    {ACCOUNT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Email verified</span>
                  <select
                    value={editForm.email_verified ? "1" : "0"}
                    onChange={(event) => setEditForm((current) => ({ ...current, email_verified: event.target.value === "1" }))}
                  >
                    <option value="1">Verified</option>
                    <option value="0">Not verified</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Current balance</span>
                  <input type="number" step="0.01" value={editForm.current_balance} onChange={(event) => setEditForm((current) => ({ ...current, current_balance: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Savings balance</span>
                  <input type="number" step="0.01" value={editForm.savings_balance} onChange={(event) => setEditForm((current) => ({ ...current, savings_balance: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Loan balance</span>
                  <input type="number" step="0.01" value={editForm.loan_balance} onChange={(event) => setEditForm((current) => ({ ...current, loan_balance: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Current account number</span>
                  <input value={editForm.c_account_number} onChange={(event) => setEditForm((current) => ({ ...current, c_account_number: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Savings account number</span>
                  <input value={editForm.s_account_number} onChange={(event) => setEditForm((current) => ({ ...current, s_account_number: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Routing name</span>
                  <input
                    value={editForm.routing_name}
                    onChange={(event) => setEditForm((current) => ({ ...current, routing_name: event.target.value }))}
                    placeholder="West Bridge Vault Reserve"
                  />
                </label>
                <label className={styles.field}>
                  <span>Routing type</span>
                  <select value={editForm.routing_type} onChange={(event) => setEditForm((current) => ({ ...current, routing_type: event.target.value }))}>
                    <option value="ABA">ABA routing</option>
                    <option value="ACH">ACH routing</option>
                    <option value="WIRE">Wire routing</option>
                    <option value="SORT_CODE">Sort code</option>
                    <option value="SWIFT">SWIFT/BIC</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Routing number</span>
                  <input
                    value={editForm.routing_number}
                    onChange={(event) => setEditForm((current) => ({ ...current, routing_number: event.target.value, generate_routing: false }))}
                    placeholder={editForm.generate_routing ? "Will be generated on save" : "Assign routing number"}
                  />
                </label>
                <div className={styles.field}>
                  <span>Routing generator</span>
                  <button
                    type="button"
                    className={styles.secondaryBtn}
                    onClick={() => setEditForm((current) => ({ ...current, routing_number: "", generate_routing: true, routing_type: current.routing_type || "ABA" }))}
                  >
                    <FiRefreshCw />
                    <span>{editForm.generate_routing ? "Generation queued" : "Generate on save"}</span>
                  </button>
                </div>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span>Profile image upload</span>
                  <input
                    ref={editFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => setEditImageFile(event.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.secondaryBtn} onClick={closeEdit}>Cancel</button>
                <button className={styles.refreshBtn} type="submit" disabled={savingId === `edit-${editingUser.id}`}>
                  <FiSave />
                  <span>{savingId === `edit-${editingUser.id}` ? "Saving..." : "Save changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingUser && (
        <div className={styles.adminModalOverlay} onClick={() => setViewingUser(null)}>
          <div className={styles.adminModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.adminModalHeader}>
              <div>
                <span className={styles.settingsEyebrow}><FiEye /> View Account</span>
                <h2>{viewingUser.full_name || viewingUser.username}</h2>
                <p>Read-only account profile, balances, account numbers, and verification status.</p>
              </div>
              <button type="button" className={styles.adminModalClose} onClick={() => setViewingUser(null)} aria-label="Close user details modal">
                <FiX />
              </button>
            </div>

            <div className={styles.adminDetailGrid}>
              <div className={styles.adminDetailCard}>
                <span>Profile</span>
                <strong>{viewingUser.full_name || viewingUser.username}</strong>
                <small>@{viewingUser.username}</small>
                <small>{viewingUser.email}</small>
              </div>
              <div className={styles.adminDetailCard}>
                <span>Main account</span>
                <strong>{viewingUser.account_number || "Pending"}</strong>
                <small>Current: {viewingUser.c_account_number || "N/A"}</small>
                <small>Savings: {viewingUser.s_account_number || "N/A"}</small>
                <small>Routing: {viewingUser.routing_number || "Not assigned"}</small>
              </div>
              <div className={styles.adminDetailCard}>
                <span>Routing details</span>
                <strong>{viewingUser.routing_name || "Not assigned"}</strong>
                <small>Number: {viewingUser.routing_number || "N/A"}</small>
                <small>Type: {viewingUser.routing_type || "N/A"}</small>
                <small>Assigned: {viewingUser.routing_assigned_at ? new Date(viewingUser.routing_assigned_at).toLocaleString() : "N/A"}</small>
              </div>
              <div className={styles.adminDetailCard}>
                <span>Balances</span>
                <strong>{viewingUser.currency_sign}{Number(viewingUser.current_balance || 0).toLocaleString()}</strong>
                <small>Savings: {viewingUser.currency_sign}{Number(viewingUser.savings_balance || 0).toLocaleString()}</small>
                <small>Loan: {viewingUser.currency_sign}{Number(viewingUser.loan_balance || 0).toLocaleString()}</small>
              </div>
              <div className={styles.adminDetailCard}>
                <span>Status</span>
                <strong>{String(viewingUser.acct_status || "unknown").toUpperCase()}</strong>
                <small>{viewingUser.email_verified ? "Email verified" : "Email not verified"}</small>
                <small>Currency: {viewingUser.currency_sign || "$"}</small>
                <small>Login OTP: {viewingUser.login_otp_enabled ? "Enabled" : "Disabled"}</small>
              </div>
            </div>

            <div className={styles.adminControlBar}>
              <button type="button" className={styles.secondaryBtn} onClick={() => viewFileRef.current?.click()}>
                <FiImage />
                <span>Upload image</span>
              </button>
              <input
                ref={viewFileRef}
                className={styles.hiddenFileInput}
                type="file"
                accept="image/*"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) handleViewImageUpload(viewingUser, file);
                  event.target.value = "";
                }}
              />
              <button type="button" className={styles.secondaryBtn} onClick={() => handleResetPin(viewingUser)}>
                <FiShield />
                <span>Reset PIN</span>
              </button>
              <button type="button" className={styles.secondaryBtn} onClick={() => handleResetPassword(viewingUser)}>
                <FiRefreshCw />
                <span>Reset password</span>
              </button>
              <button type="button" className={styles.refreshBtn} onClick={() => handleToggleLoginOtp(viewingUser)}>
                <FiShield />
                <span>{viewingUser.login_otp_enabled ? "Disable OTP" : "Enable OTP"}</span>
              </button>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setViewingUser(null)}>Close</button>
              <button type="button" className={styles.refreshBtn} onClick={() => {
                setViewingUser(null);
                openEdit(viewingUser);
              }}>
                <FiEdit2 />
                <span>Edit user</span>
              </button>
              <button type="button" className={styles.logoutBtn} onClick={() => {
                setDeleteTarget(viewingUser);
                setViewingUser(null);
              }}>
                <FiTrash2 />
                <span>Delete user</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {createOpen && (
        <div className={styles.adminModalOverlay} onClick={closeCreate}>
          <div className={styles.adminModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.adminModalHeader}>
              <div>
                <span className={styles.settingsEyebrow}><FiPlus /> Create User</span>
                <h2>Open a new user account</h2>
                <p>Create a user directly from admin with balances, status, and welcome email options.</p>
              </div>
              <button type="button" className={styles.adminModalClose} onClick={closeCreate} aria-label="Close create user modal">
                <FiX />
              </button>
            </div>

            <form className={styles.settingsForm} onSubmit={submitCreate}>
              <div className={styles.settingsFormGrid}>
                <label className={styles.field}>
                  <span>Full name</span>
                  <input value={createForm.full_name} onChange={(event) => setCreateForm((current) => ({ ...current, full_name: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Username</span>
                  <input value={createForm.username} onChange={(event) => setCreateForm((current) => ({ ...current, username: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" value={createForm.email} onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Password</span>
                  <input type="password" minLength={6} value={createForm.password} onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))} required />
                </label>
                <label className={styles.field}>
                  <span>Account status</span>
                  <select value={createForm.acct_status} onChange={(event) => setCreateForm((current) => ({ ...current, acct_status: event.target.value }))}>
                    {ACCOUNT_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Email verified</span>
                  <select value={createForm.email_verified ? "1" : "0"} onChange={(event) => setCreateForm((current) => ({ ...current, email_verified: event.target.value === "1" }))}>
                    <option value="1">Verified</option>
                    <option value="0">Not verified</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Currency sign</span>
                  <input value={createForm.currency_sign} onChange={(event) => setCreateForm((current) => ({ ...current, currency_sign: event.target.value }))} maxLength={5} />
                </label>
                <label className={styles.field}>
                  <span>Current balance</span>
                  <input type="number" step="0.01" value={createForm.current_balance} onChange={(event) => setCreateForm((current) => ({ ...current, current_balance: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Savings balance</span>
                  <input type="number" step="0.01" value={createForm.savings_balance} onChange={(event) => setCreateForm((current) => ({ ...current, savings_balance: event.target.value }))} />
                </label>
                <label className={styles.field}>
                  <span>Loan balance</span>
                  <input type="number" step="0.01" value={createForm.loan_balance} onChange={(event) => setCreateForm((current) => ({ ...current, loan_balance: event.target.value }))} />
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span>Profile image upload</span>
                  <input
                    ref={createFileRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => setCreateImageFile(event.target.files?.[0] || null)}
                  />
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span>Welcome email</span>
                  <select value={createForm.send_welcome ? "1" : "0"} onChange={(event) => setCreateForm((current) => ({ ...current, send_welcome: event.target.value === "1" }))}>
                    <option value="1">Send welcome email</option>
                    <option value="0">Do not send welcome email</option>
                  </select>
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.secondaryBtn} onClick={closeCreate}>Cancel</button>
                <button className={styles.refreshBtn} type="submit" disabled={savingId === "create-user"}>
                  <FiSave />
                  <span>{savingId === "create-user" ? "Creating..." : "Create user"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className={styles.adminModalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.adminConfirmModal} onClick={(event) => event.stopPropagation()}>
            <span className={styles.settingsEyebrow}><FiShield /> Delete account</span>
            <h2>Delete {deleteTarget.full_name || deleteTarget.username}?</h2>
            <p>This removes the user account and related account records from the banking system. This action cannot be undone.</p>

            <div className={styles.adminConfirmMeta}>
              <strong>{deleteTarget.email}</strong>
              <small>{deleteTarget.account_number || "No main account number"}</small>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.secondaryBtn} onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className={styles.logoutBtn} type="button" onClick={handleDelete} disabled={deletingId === String(deleteTarget.id)}>
                <FiTrash2 />
                <span>{deletingId === String(deleteTarget.id) ? "Deleting..." : "Delete account"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
