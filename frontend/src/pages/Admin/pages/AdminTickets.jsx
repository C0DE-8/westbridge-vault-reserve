import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FiFileText, FiPaperclip, FiSend, FiXCircle } from "react-icons/fi";
import axiosInstance from "../../../api/axios";
import { EmptyState, StatusBadge, TableSkeleton, resolveAsset } from "../AdminPrimitives";
import styles from "../Admin.module.css";

const formatSupportDate = (value) => {
  if (!value) return "N/A";
  const normalized = typeof value === "string" && !value.includes("T") ? value.replace(" ", "T") : value;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
};

const formatFileSize = (bytes) => {
  const size = Number(bytes);
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

function AttachmentPreview({ message }) {
  if (!message?.attachment_url) return null;
  const url = resolveAsset(message.attachment_url);
  const isImage = String(message.attachment_type || "").startsWith("image/");

  return (
    <a className={styles.supportAttachment} href={url} target="_blank" rel="noreferrer">
      {isImage ? (
        <img src={url} alt={message.attachment_name || "Support attachment"} />
      ) : (
        <span className={styles.supportAttachmentIcon}><FiFileText /></span>
      )}
      <span>
        <strong>{message.attachment_name || "Attachment"}</strong>
        <small>{message.attachment_type || "File"} {formatFileSize(message.attachment_size)}</small>
      </span>
    </a>
  );
}

export default function AdminTickets() {
  const { notify } = useOutletContext();
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [reply, setReply] = useState("");
  const [replyFile, setReplyFile] = useState(null);
  const [replying, setReplying] = useState(false);
  const [closingId, setClosingId] = useState(null);

  const loadTickets = async (ticketToOpen) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/admin/tickets");
      const nextTickets = Array.isArray(res.data) ? res.data : [];
      setTickets(nextTickets);
      const nextActive =
        ticketToOpen
          ? nextTickets.find((item) => Number(item.id) === Number(ticketToOpen))
          : activeTicket
            ? nextTickets.find((item) => Number(item.id) === Number(activeTicket.id))
            : nextTickets[0];
      if (nextActive) {
        await loadMessages(nextActive);
      } else {
        setActiveTicket(null);
        setMessages([]);
      }
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load tickets", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (ticket) => {
    if (!ticket?.id) return;
    try {
      setThreadLoading(true);
      const res = await axiosInstance.get(`/admin/tickets/${ticket.id}/messages`);
      setActiveTicket(res.data?.ticket || ticket);
      setMessages(Array.isArray(res.data?.messages) ? res.data.messages : []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load ticket messages", "error");
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const closeTicket = async (id) => {
    try {
      setClosingId(id);
      const res = await axiosInstance.put(`/admin/tickets/${id}/close`);
      notify(res.data?.message || "Ticket closed", "success");
      await loadTickets(id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to close ticket", "error");
    } finally {
      setClosingId(null);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!activeTicket?.id || (!reply.trim() && !replyFile)) return;
    try {
      setReplying(true);
      const formData = new FormData();
      formData.append("message", reply);
      if (replyFile) formData.append("attachment", replyFile);
      const res = await axiosInstance.post(`/admin/tickets/${activeTicket.id}/reply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      notify(res.data?.message || "Reply sent successfully", "success");
      setReply("");
      setReplyFile(null);
      await loadMessages(activeTicket);
      await loadTickets(activeTicket.id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to send reply", "error");
    } finally {
      setReplying(false);
    }
  };

  const openTickets = useMemo(
    () => tickets.filter((item) => String(item.status).toLowerCase() !== "closed").length,
    [tickets]
  );

  if (loading) return <TableSkeleton columns={5} rows={7} />;

  return (
    <div className={styles.supportDesk}>
      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>Support Tickets</h2>
            <p className={styles.muted}>{openTickets} open tickets</p>
          </div>
        </div>

        {tickets.length === 0 ? (
          <EmptyState>No support tickets found.</EmptyState>
        ) : (
          <div className={styles.supportTicketList}>
            {tickets.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`${styles.supportTicketButton} ${Number(activeTicket?.id) === Number(item.id) ? styles.supportTicketButtonActive : ""}`}
                onClick={() => loadMessages(item)}
              >
                <span>
                  <strong>{item.subject}</strong>
                  <small>#{item.id} by {item.user_username || item.user_id} • {formatSupportDate(item.created_at)}</small>
                </span>
                <span className={styles.supportTicketMeta}>
                  <StatusBadge status={item.status} />
                  {Number(item.attachment_count) > 0 ? <small><FiPaperclip /> {item.attachment_count}</small> : null}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className={styles.panel}>
        <div className={styles.sectionHeader}>
          <div>
            <h2>{activeTicket ? activeTicket.subject : "Ticket Thread"}</h2>
            <p className={styles.muted}>
              {activeTicket ? `Ticket #${activeTicket.id} • ${activeTicket.user_username || activeTicket.user_id}` : "Select a ticket"}
            </p>
          </div>
          {activeTicket && String(activeTicket.status).toLowerCase() !== "closed" ? (
            <button
              type="button"
              className={styles.dangerSoftBtn}
              disabled={closingId === activeTicket.id}
              onClick={() => closeTicket(activeTicket.id)}
            >
              <FiXCircle />
              <span>{closingId === activeTicket.id ? "Closing..." : "Close"}</span>
            </button>
          ) : null}
        </div>

        {!activeTicket ? (
          <EmptyState>Select a ticket to read the conversation.</EmptyState>
        ) : threadLoading ? (
          <TableSkeleton title="Loading ticket thread" columns={2} rows={4} />
        ) : (
          <>
            <div className={styles.supportThread}>
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`${styles.supportMessage} ${
                    message.sender === "admin" ? styles.supportMessageAdmin : styles.supportMessageUser
                  }`}
                >
                  <strong>{message.sender_username || (message.sender === "admin" ? "Admin" : "User")}</strong>
                  {message.message ? <p>{message.message}</p> : null}
                  <AttachmentPreview message={message} />
                  <small>{formatSupportDate(message.created_at)}</small>
                </article>
              ))}
            </div>

            {String(activeTicket.status).toLowerCase() !== "closed" ? (
              <form className={styles.supportReplyForm} onSubmit={sendReply}>
                <textarea
                  rows="4"
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  placeholder="Reply to this ticket"
                />
                <div className={styles.supportReplyActions}>
                  <label className={styles.supportFileInput}>
                    <FiPaperclip />
                    <span>{replyFile ? replyFile.name : "Attach PDF or image"}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(event) => setReplyFile(event.target.files?.[0] || null)}
                    />
                  </label>
                  <button type="submit" className={styles.applyBtn} disabled={replying || (!reply.trim() && !replyFile)}>
                    <FiSend />
                    <span>{replying ? "Sending..." : "Send reply"}</span>
                  </button>
                </div>
              </form>
            ) : (
              <EmptyState>This ticket is closed.</EmptyState>
            )}
          </>
        )}
      </section>
    </div>
  );
}
