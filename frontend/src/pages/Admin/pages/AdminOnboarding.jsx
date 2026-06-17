import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import axiosInstance from "../../../api/axios";
import { EmptyState, resolveAsset, StatusBadge } from "../AdminPrimitives";
import styles from "../Admin.module.css";

export default function AdminOnboarding() {
  const { notify } = useOutletContext();
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState("");

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/admin/onboarding?status=${status}`);
      setApplications(res.data?.applications || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load onboarding applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [status]);

  const approveApplication = async (id) => {
    try {
      setActionId(`approve-${id}`);
      const res = await axiosInstance.post(`/admin/onboarding/${id}/approve`);
      notify(res.data?.message || "Application approved", "success");
      loadApplications();
    } catch (error) {
      notify(error?.response?.data?.error || "Approval failed", "error");
    } finally {
      setActionId("");
    }
  };

  const rejectApplication = async (id) => {
    const reason = window.prompt("Why is this onboarding being rejected?");
    if (!reason) return;

    try {
      setActionId(`reject-${id}`);
      const res = await axiosInstance.post(`/admin/onboarding/${id}/reject`, { reason });
      notify(res.data?.message || "Application rejected", "success");
      loadApplications();
    } catch (error) {
      notify(error?.response?.data?.error || "Rejection failed", "error");
    } finally {
      setActionId("");
    }
  };

  return (
    <section className={styles.panel}>
      <div className={styles.sectionHeader}>
        <h2>Onboarding Applications</h2>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="all">All</option>
        </select>
      </div>

      {loading ? (
        <EmptyState>Loading onboarding applications...</EmptyState>
      ) : applications.length === 0 ? (
        <EmptyState>No onboarding applications found.</EmptyState>
      ) : (
        <div className={styles.applicationList}>
          {applications.map((application) => (
            <article className={styles.application} key={application.id}>
              <div className={styles.applicationMain}>
                <div>
                  <div className={styles.nameLine}>
                    <h3>{application.full_name}</h3>
                    <StatusBadge status={application.status} />
                  </div>
                  <div className={styles.metaGrid}>
                    <span>Email: {application.email}</span>
                    <span>Username: {application.username}</span>
                    <span>Age: {application.age}</span>
                    <span>Work ID: {application.work_id}</span>
                    <span>ID: {application.id_type === "driver_license" ? "Driver license" : "Passport"}</span>
                    <span>Phone: {application.phone || "Not provided"}</span>
                    <span>Address: {application.address || "Not provided"}</span>
                    <span>Submitted: {new Date(application.created_at).toLocaleString()}</span>
                  </div>
                  {application.rejection_reason && (
                    <p className={styles.reason}>Reason: {application.rejection_reason}</p>
                  )}
                </div>

                {application.status === "pending" && (
                  <div className={styles.actions}>
                    <button className={styles.approveBtn} onClick={() => approveApplication(application.id)} disabled={actionId === `approve-${application.id}`}>Approve</button>
                    <button className={styles.rejectBtn} onClick={() => rejectApplication(application.id)} disabled={actionId === `reject-${application.id}`}>Reject</button>
                  </div>
                )}
              </div>

              <div className={styles.documents}>
                <a href={resolveAsset(application.id_front_url)} target="_blank" rel="noreferrer"><img src={resolveAsset(application.id_front_url)} alt="ID front" /><span>ID front</span></a>
                <a href={resolveAsset(application.id_back_url)} target="_blank" rel="noreferrer"><img src={resolveAsset(application.id_back_url)} alt="ID back" /><span>ID back</span></a>
                <a href={resolveAsset(application.face_photo_url)} target="_blank" rel="noreferrer"><img src={resolveAsset(application.face_photo_url)} alt="Face verification" /><span>Face photo</span></a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
