import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle, FiDollarSign, FiSettings } from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import CustomSelect from "../../components/Form/CustomSelect";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import styles from "./UserPage.module.css";

const initialForm = {
  full_name: "",
  gender: "",
  marital_status: "",
  email: "",
  ssn: "",
  mobile_number: "",
  residential_address: "",
  number_of_dependents: "",
  annual_income: "",
  employment_details: "",
  loan_service: "",
  loan_amount: "",
  payment_tenure: "",
  loan_purpose: "",
  agreed_terms: false,
};

const genderOptions = ["Male", "Female", "Other"];
const maritalOptions = ["Single", "Married", "Divorced", "Widowed"];
const loanServiceOptions = [
  "Personal Loan",
  "Business Loan",
  "Mortgage Loan",
  "Auto Loan",
  "Education Loan",
  "Debt Consolidation",
];
const tenureOptions = ["6 months", "12 months", "24 months", "36 months", "48 months", "60 months"];

export default function LoansPage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toasts, notify, dismissToast } = useGlassToast();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const displayName = userUser?.full_name || userUser?.username || "User";
  const currencySign = userUser?.currency_sign || "$";

  const loadLoans = async () => {
    try {
      setLoading(true);
      const [profileRes, loansRes] = await Promise.all([
        axiosInstance.get("/user/profile"),
        axiosInstance.get("/user/loans"),
      ]);
      const profile = profileRes.data?.user || userUser;
      setForm((current) => ({
        ...current,
        full_name: current.full_name || profile?.full_name || "",
        email: current.email || profile?.email || "",
      }));
      setLoans(loansRes.data?.loans || []);
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to load loans.", "error", "Loan page unavailable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLoans();
  }, []);

  const handleLogout = () => {
    logout("user");
    navigate("/", { replace: true });
  };

  const reviewRows = useMemo(
    () => [
      { label: "Loan service", value: form.loan_service || "Select loan type" },
      { label: "Amount", value: form.loan_amount ? `${currencySign}${Number(form.loan_amount).toLocaleString()}` : `${currencySign}0` },
      { label: "Tenure", value: form.payment_tenure || "Choose tenure" },
      { label: "Dependents", value: form.number_of_dependents || "0" },
    ],
    [currencySign, form.loan_amount, form.loan_service, form.number_of_dependents, form.payment_tenure]
  );

  const submitLoan = async (event) => {
    event.preventDefault();
    if (!form.agreed_terms) {
      notify("You must agree to the loan terms and policy.", "error", "Terms required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        agreed_terms: form.agreed_terms ? 1 : 0,
      };
      const res = await axiosInstance.post("/user/loans", payload);
      notify(res.data?.message || "Loan request submitted.", "success", "Loan submitted");
      setForm((current) => ({
        ...initialForm,
        full_name: current.full_name,
        email: current.email,
      }));
      await loadLoans();
    } catch (error) {
      notify(error?.response?.data?.error || "Failed to submit loan request.", "error", "Loan request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.page}>
      <GlassToast toasts={toasts} onDismiss={dismissToast} />

      <section className={styles.shell}>
        <header className={styles.header}>
          <button type="button" onClick={() => navigate("/dashboard")} aria-label="Back to dashboard">
            <FiArrowLeft />
          </button>
          <div>
            <span><FiDollarSign /></span>
            <h1>Loans</h1>
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
              <h2>Loan Application</h2>
              <p>Submit a complete loan request for admin review and approval.</p>
            </div>
          </div>

          <form className={styles.formGrid} onSubmit={submitLoan}>
            <label>
              Full name
              <input value={form.full_name} onChange={(e) => setForm((c) => ({ ...c, full_name: e.target.value }))} required />
            </label>
            <label>
              Gender
              <CustomSelect
                value={form.gender}
                options={[
                  { value: "", label: "Select gender" },
                  ...genderOptions.map((item) => ({ value: item, label: item })),
                ]}
                onChange={(value) => setForm((c) => ({ ...c, gender: value }))}
              />
            </label>
            <label>
              Marital status
              <CustomSelect
                value={form.marital_status}
                options={[
                  { value: "", label: "Select marital status" },
                  ...maritalOptions.map((item) => ({ value: item, label: item })),
                ]}
                onChange={(value) => setForm((c) => ({ ...c, marital_status: value }))}
              />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} required />
            </label>
            <label>
              SSN
              <input value={form.ssn} onChange={(e) => setForm((c) => ({ ...c, ssn: e.target.value }))} placeholder="e.g. 123-45-6789" required />
            </label>
            <label>
              Mobile number
              <input value={form.mobile_number} onChange={(e) => setForm((c) => ({ ...c, mobile_number: e.target.value }))} required />
            </label>
            <label>
              Residential address
              <textarea value={form.residential_address} onChange={(e) => setForm((c) => ({ ...c, residential_address: e.target.value }))} required />
            </label>
            <label>
              Number of dependents
              <input type="number" min="0" value={form.number_of_dependents} onChange={(e) => setForm((c) => ({ ...c, number_of_dependents: e.target.value }))} required />
            </label>
            <label>
              Annual income
              <input type="number" min="0" step="0.01" value={form.annual_income} onChange={(e) => setForm((c) => ({ ...c, annual_income: e.target.value }))} required />
            </label>
            <label>
              Employment details
              <textarea value={form.employment_details} onChange={(e) => setForm((c) => ({ ...c, employment_details: e.target.value }))} required />
            </label>
            <label>
              Loan / credit service
              <CustomSelect
                value={form.loan_service}
                options={[
                  { value: "", label: "Select loan service" },
                  ...loanServiceOptions.map((item) => ({ value: item, label: item })),
                ]}
                onChange={(value) => setForm((c) => ({ ...c, loan_service: value }))}
              />
            </label>
            <label>
              Loan amount
              <input type="number" min="1" step="0.01" value={form.loan_amount} onChange={(e) => setForm((c) => ({ ...c, loan_amount: e.target.value }))} required />
            </label>
            <label>
              Payment tenure
              <CustomSelect
                value={form.payment_tenure}
                options={[
                  { value: "", label: "Select payment tenure" },
                  ...tenureOptions.map((item) => ({ value: item, label: item })),
                ]}
                onChange={(value) => setForm((c) => ({ ...c, payment_tenure: value }))}
              />
            </label>
            <label>
              Loan purpose
              <textarea value={form.loan_purpose} onChange={(e) => setForm((c) => ({ ...c, loan_purpose: e.target.value }))} required />
            </label>

            <section className={styles.billReviewCard}>
              <div className={styles.billReviewHead}>
                <div>
                  <span>Application preview</span>
                  <strong>{form.loan_service || "Loan request"}</strong>
                </div>
                <div className={styles.billReviewPinBadge}>
                  <FiCheckCircle />
                  <small>Admin review</small>
                </div>
              </div>
              <div className={styles.billReviewGrid}>
                {reviewRows.map((row) => (
                  <div key={row.label}>
                    <span>{row.label}</span>
                    <strong>{row.value}</strong>
                  </div>
                ))}
              </div>
            </section>

            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.agreed_terms}
                onChange={(e) => setForm((c) => ({ ...c, agreed_terms: e.target.checked }))}
                required
              />
              <span>I agree to the terms and policy.</span>
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Loan Request"}
            </button>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Loan Requests</h2>
              <p>Track your submitted loan requests and review outcomes.</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.preloaderBlock}>
              <span />
              <strong>Loading loans...</strong>
            </div>
          ) : loans.length === 0 ? (
            <p className={styles.empty}>No loan requests submitted yet.</p>
          ) : (
            <div className={styles.transactionList}>
              {loans.map((loan) => (
                <div className={styles.transactionItem} key={loan.id}>
                  <span className={styles.transactionIcon}><FiDollarSign /></span>
                  <div>
                    <strong>{loan.loan_service}</strong>
                    <small>{loan.created_at} • {loan.payment_tenure}</small>
                    {loan.review_note ? <small>{loan.review_note}</small> : null}
                  </div>
                  <div className={styles.historyAside}>
                    <b>{currencySign}{Number(loan.loan_amount || 0).toLocaleString()}</b>
                    <small>{loan.status}</small>
                  </div>
                </div>
              ))}
            </div>
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
