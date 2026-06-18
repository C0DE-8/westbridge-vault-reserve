import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiLifeBuoy,
  FiMessageCircle,
  FiPlus,
  FiSend,
  FiSettings,
  FiXCircle,
} from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import styles from "./FinancePages.module.css";

const initialForm = {
  subject: "",
  message: "",
};

export default function SupportPage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismissToast } = useGlassToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [replying, setReplying] = useState(false);
  const [closingId, setClosingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [reply, setReply] = useState("");

  const displayName = userUser?.full_name || userUser?.username || "User";

  const loadTickets = async (ticketToOpen) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/my-tickets");
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
      notify(error?.response?.data?.error || "Failed to load support tickets.", "error", "Support unavailable");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (ticket) => {
    if (!ticket?.id) return;
    try {
      setThreadLoading(true);
      const res = await axiosInstance.get(`/user/${ticket.id}/messages`);
      setActiveTicket(res.data?.ticket || ticket);
      setMessages(res.data?.messages || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load ticket messages.", "error", "Thread unavailable");
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openCount = useMemo(
    () => tickets.filter((item) => String(item.status).toLowerCase() !== "closed").length,
    [tickets]
  );

  const createTicket = async (event) => {
    event.preventDefault();
    try {
      setCreating(true);
      const res = await axiosInstance.post("/user/create", form);
      notify(res.data?.message || "Ticket created successfully.", "success", "Ticket opened");
      setForm(initialForm);
      await loadTickets(res.data?.ticket_id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to create ticket.", "error", "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const sendReply = async (event) => {
    event.preventDefault();
    if (!activeTicket?.id || !reply.trim()) return;
    try {
      setReplying(true);
      const res = await axiosInstance.post(`/user/${activeTicket.id}/reply`, {
        message: reply,
      });
      notify(res.data?.message || "Reply sent successfully.", "success", "Reply sent");
      setReply("");
      await loadMessages(activeTicket);
      await loadTickets(activeTicket.id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to send reply.", "error", "Reply failed");
    } finally {
      setReplying(false);
    }
  };

  const closeTicket = async (ticket) => {
    try {
      setClosingId(ticket.id);
      const res = await axiosInstance.put(`/user/tickets/${ticket.id}/close`);
      notify(res.data?.message || "Ticket closed successfully.", "success", "Ticket closed");
      await loadTickets(ticket.id);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to close ticket.", "error", "Close failed");
    } finally {
      setClosingId(null);
    }
  };

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
            <FiArrowLeft />
          </button>
          <div>
            <span><FiLifeBuoy /></span>
            <h1>Support</h1>
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

        <section className={styles.heroPanel}>
          <div>
            <span className={styles.eyebrow}>Help desk</span>
            <h2>Open and track support tickets</h2>
            <p>Start a new ticket, read the full conversation, and reply inside the same thread.</p>
          </div>
          <div className={styles.heroMeta}>
            <FiMessageCircle />
            <span>{openCount} open</span>
          </div>
        </section>

        <section className={styles.gridSupport}>
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <h2>New ticket</h2>
                <p>Create a support request for account help, transfer issues, cards, or onboarding.</p>
              </div>
            </div>

            <form className={styles.formStack} onSubmit={createTicket}>
              <label>
                Subject
                <input
                  value={form.subject}
                  onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                  placeholder="What do you need help with?"
                  required
                />
              </label>
              <label>
                Message
                <textarea
                  rows="5"
                  value={form.message}
                  onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                  placeholder="Describe the issue clearly"
                  required
                />
              </label>
              <button type="submit" className={styles.primaryButton} disabled={creating}>
                <FiPlus />
                <span>{creating ? "Creating..." : "Create ticket"}</span>
              </button>
            </form>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <div>
                <h2>Your tickets</h2>
                <p>Open a ticket to read the thread and continue the conversation.</p>
              </div>
            </div>

            {loading ? (
              <div className={styles.preloaderBlock}>
                <span />
                <strong>Loading tickets...</strong>
              </div>
            ) : tickets.length === 0 ? (
              <p className={styles.empty}>No support tickets yet.</p>
            ) : (
              <div className={styles.listStack}>
                {tickets.map((ticket) => (
                  <button
                    type="button"
                    key={ticket.id}
                    className={`${styles.ticketButton} ${Number(activeTicket?.id) === Number(ticket.id) ? styles.ticketButtonActive : ""}`}
                    onClick={() => loadMessages(ticket)}
                  >
                    <div>
                      <strong>{ticket.subject}</strong>
                      <small>#{ticket.id} • {ticket.created_at}</small>
                    </div>
                    <span className={styles.ticketStatus}>{ticket.status}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>{activeTicket ? activeTicket.subject : "Ticket thread"}</h2>
              <p>{activeTicket ? `Ticket #${activeTicket.id} • ${activeTicket.status}` : "Select a ticket to read messages."}</p>
            </div>
            {activeTicket && String(activeTicket.status).toLowerCase() !== "closed" ? (
              <button
                type="button"
                className={styles.secondaryButton}
                disabled={closingId === activeTicket.id}
                onClick={() => closeTicket(activeTicket)}
              >
                <FiXCircle />
                <span>{closingId === activeTicket.id ? "Closing..." : "Close ticket"}</span>
              </button>
            ) : null}
          </div>

          {!activeTicket ? (
            <p className={styles.empty}>No ticket selected.</p>
          ) : threadLoading ? (
            <div className={styles.preloaderBlock}>
              <span />
              <strong>Loading messages...</strong>
            </div>
          ) : (
            <>
              <div className={styles.messageThread}>
                {messages.map((message) => (
                  <article
                    className={`${styles.messageBubble} ${
                      message.sender === "user" ? styles.messageBubbleUser : styles.messageBubbleAdmin
                    }`}
                    key={message.id}
                  >
                    <strong>{message.sender === "user" ? "You" : "Support"}</strong>
                    <p>{message.message}</p>
                    <small>{message.created_at}</small>
                  </article>
                ))}
              </div>

              {String(activeTicket.status).toLowerCase() !== "closed" ? (
                <form className={styles.replyForm} onSubmit={sendReply}>
                  <textarea
                    rows="4"
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    placeholder="Reply to this ticket"
                    required
                  />
                  <button type="submit" className={styles.primaryButton} disabled={replying || !reply.trim()}>
                    <FiSend />
                    <span>{replying ? "Sending..." : "Send reply"}</span>
                  </button>
                </form>
              ) : (
                <p className={styles.empty}>This ticket is closed.</p>
              )}
            </>
          )}
        </section>
      </section>

      <MobileFooterNav />
      <GlassToast toasts={toasts} onDismiss={dismissToast} />
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
