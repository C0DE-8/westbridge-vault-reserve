import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiFileText,
  FiGrid,
  FiList,
  FiLock,
  FiSettings,
  FiPhone,
} from "react-icons/fi";
import axiosInstance from "../../api/axios";
import MobileFooterNav from "../../components/Dashboard/MobileFooterNav";
import UserSettingsDrawer from "../../components/Dashboard/UserSettingsDrawer";
import CustomSelect from "../../components/Form/CustomSelect";
import GlassToast, { useGlassToast } from "../../components/Toast/GlassToast";
import TransactionPinPrompt from "../../components/ui/TransactionPinPrompt";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import billsSpriteSheet from "../../assets/bills-sprite-sheet.png";
import airtimeSpriteSheet from "../../assets/airtime-sprite-sheet.png";
import styles from "./UserPage.module.css";

const billTypeOptions = [
  { value: "water", label: "Water" },
  { value: "electricity", label: "Electricity" },
  { value: "gas", label: "Gas" },
  { value: "internet", label: "Internet" },
  { value: "cable", label: "Cable TV" },
  { value: "phone", label: "Phone" },
  { value: "tax", label: "Taxes" },
  { value: "insurance", label: "Insurance" },
  { value: "waste", label: "Waste" },
  { value: "hoa", label: "HOA" },
  { value: "tuition", label: "Tuition" },
  { value: "mortgage", label: "Mortgage" },
];

const airtimeProviderOptions = [
  { value: "Verizon", label: "Verizon" },
  { value: "AT&T", label: "AT&T" },
  { value: "T-Mobile", label: "T-Mobile" },
  { value: "Cricket Wireless", label: "Cricket Wireless" },
  { value: "Boost Mobile", label: "Boost Mobile" },
];

const billProviderPresets = {
  water: ["American Water", "Aqua America", "Municipal Water Services"],
  electricity: ["Duke Energy", "Florida Power & Light", "Con Edison"],
  gas: ["National Grid", "SoCalGas", "CenterPoint Energy"],
  internet: ["Xfinity", "Spectrum", "Optimum"],
  cable: ["Comcast", "Cox", "DIRECTV"],
  phone: ["AT&T", "Verizon", "T-Mobile"],
  tax: ["IRS", "State Revenue Office", "County Tax Office"],
  insurance: ["State Farm", "GEICO", "Allstate"],
  waste: ["Waste Management", "Republic Services", "City Sanitation"],
  hoa: ["Community Association Office", "Property Management Group", "Resident Services HOA"],
  tuition: ["University Cashier", "Student Accounts Office", "Campus Billing Office"],
  mortgage: ["Rocket Mortgage", "Chase Home Lending", "Wells Fargo Home Mortgage"],
};

const accountOptions = [
  { value: "current", label: "Current Account" },
  { value: "savings", label: "Savings Account" },
];

const billImageClassMap = {
  water: "billArtWater",
  electricity: "billArtElectricity",
  gas: "billArtGas",
  internet: "billArtInternet",
  cable: "billArtCable",
  phone: "billArtPhone",
  tax: "billArtTax",
  insurance: "billArtInsurance",
  waste: "billArtWaste",
  hoa: "billArtHoa",
  tuition: "billArtTuition",
  mortgage: "billArtMortgage",
};

const airtimeImageClassMap = {
  Verizon: "airtimeArtVerizon",
  "AT&T": "airtimeArtAtt",
  "T-Mobile": "airtimeArtTmobile",
  "Cricket Wireless": "airtimeArtCricket",
  "Boost Mobile": "airtimeArtBoost",
};

const initialForm = {
  payment_kind: "bill",
  bill_category: "electricity",
  provider_name: "",
  customer_reference: "",
  from_account: "current",
  amount: "",
  note: "",
};

export default function BillsAirtimePage() {
  const navigate = useNavigate();
  const { userUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [historyView, setHistoryView] = useState("list");
  const [pin, setPin] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [hasPin, setHasPin] = useState(true);
  const [checkingPin, setCheckingPin] = useState(true);
  const { toasts, notify, dismissToast } = useGlassToast();
  const displayName = userUser?.full_name || userUser?.username || "User";
  const currencySign = userUser?.currency_sign || "$";

  const providerOptions =
    form.payment_kind === "airtime"
      ? airtimeProviderOptions
      : (billProviderPresets[form.bill_category] || []).map((name) => ({ value: name, label: name }));
  const activeVisualClass =
    form.payment_kind === "airtime"
      ? airtimeImageClassMap[form.provider_name] || "airtimeArtVerizon"
      : billImageClassMap[form.bill_category] || "billArtElectricity";
  const activeVisualSheet = form.payment_kind === "airtime" ? airtimeSpriteSheet : billsSpriteSheet;
  const formatMoney = (value) => `${currencySign}${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const loadPayments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/user/bill-payments");
      setPayments(res.data?.payments || []);
    } catch (error) {
      setMessage(error?.response?.data?.error || "Failed to load bill payments.");
    } finally {
      setLoading(false);
    }
  };

  const loadPinStatus = async () => {
    try {
      setCheckingPin(true);
      const res = await axiosInstance.get("/user/pin");
      setHasPin(Boolean(res.data?.has_pin));
    } catch (error) {
      setHasPin(false);
    } finally {
      setCheckingPin(false);
    }
  };

  useEffect(() => {
    loadPayments();
    loadPinStatus();
  }, []);

  useEffect(() => {
    if (!form.provider_name && providerOptions[0]?.value) {
      setForm((current) => ({ ...current, provider_name: providerOptions[0].value }));
    }
  }, [form.payment_kind, form.bill_category]);

  const updateField = (key, value) => {
    setForm((current) => {
      if (key === "payment_kind") {
        const nextCategory = value === "airtime" ? "phone" : current.bill_category === "phone" ? "electricity" : current.bill_category;
        const nextProviders =
          value === "airtime"
            ? airtimeProviderOptions
            : (billProviderPresets[nextCategory] || []).map((name) => ({ value: name, label: name }));
        return {
          ...current,
          payment_kind: value,
          bill_category: nextCategory,
          provider_name: nextProviders[0]?.value || "",
        };
      }

      if (key === "bill_category") {
        const nextProviders = (billProviderPresets[value] || []).map((name) => ({ value: name, label: name }));
        return {
          ...current,
          bill_category: value,
          provider_name: nextProviders[0]?.value || current.provider_name,
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const requestPinConfirmation = (event) => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;

    if (checkingPin) {
      notify("Checking your transaction PIN status. Try again in a moment.", "info", "Please wait");
      return;
    }

    if (!hasPin) {
      notify("Set your transaction PIN first before sending a bill or airtime request.", "error", "PIN required");
      return;
    }

    setMessage("");
    setPin("");
    setPinOpen(true);
  };

  const submit = async () => {
    try {
      setSubmitting(true);
      setMessage("");
      const res = await axiosInstance.post("/user/bill-payments", { ...form, pin });
      setMessage(res.data?.message || "Payment request submitted.");
      notify(res.data?.message || "Payment request submitted.", "success", "Submitted");
      setForm((current) => ({
        ...current,
        customer_reference: "",
        amount: "",
        note: "",
      }));
      setPin("");
      setPinOpen(false);
      loadPayments();
    } catch (error) {
      const errorMessage = error?.response?.data?.error || "Payment request failed.";
      setMessage(errorMessage);
      notify(errorMessage, "error", "Payment failed");
    } finally {
      setSubmitting(false);
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
            <span>{form.payment_kind === "airtime" ? <FiPhone /> : <FiFileText />}</span>
            <h1>Bills & Airtime</h1>
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

        <div className={styles.segmentedTwo}>
          <button
            type="button"
            className={form.payment_kind === "bill" ? styles.activeSegment : ""}
            onClick={() => updateField("payment_kind", "bill")}
          >
            Bills
          </button>
          <button
            type="button"
            className={form.payment_kind === "airtime" ? styles.activeSegment : ""}
            onClick={() => updateField("payment_kind", "airtime")}
          >
            Airtime
          </button>
        </div>

        <section className={styles.servicePreviewCard}>
          <div
            className={`${styles.servicePreviewArt} ${styles[activeVisualClass]}`}
            style={{ "--sheet-image": `url(${activeVisualSheet})` }}
          />
          <div>
            <span>{form.payment_kind === "airtime" ? "Mobile Recharge" : "Bill Category"}</span>
            <strong>{form.payment_kind === "airtime" ? form.provider_name || "Carrier" : billTypeOptions.find((item) => item.value === form.bill_category)?.label}</strong>
            <small>
              {form.payment_kind === "airtime"
                ? "Pick a carrier and submit the recharge for approval."
                : "Select the utility or obligation you want the admin to process."}
            </small>
          </div>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>{form.payment_kind === "airtime" ? "Mobile Airtime" : "U.S. Bill Payment"}</h2>
              <p>Every payment request is held pending until an admin confirms it.</p>
            </div>
          </div>

          {message && <p className={styles.notice}>{message}</p>}

          <form className={styles.formGrid} onSubmit={requestPinConfirmation}>
            {form.payment_kind === "bill" ? (
              <div className={styles.imagePickerGroup}>
                <span className={styles.pickerLabel}>Bill type</span>
                <div className={styles.imagePickerGrid}>
                  {billTypeOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={`${styles.imagePickerCard} ${
                        form.bill_category === option.value ? styles.imagePickerCardActive : ""
                      }`}
                      onClick={() => updateField("bill_category", option.value)}
                    >
                      <div
                        className={`${styles.serviceTileArt} ${styles[billImageClassMap[option.value]]}`}
                        style={{ "--sheet-image": `url(${billsSpriteSheet})` }}
                      />
                      <strong>{option.label}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {form.payment_kind === "airtime" ? (
              <div className={styles.imagePickerGroup}>
                <span className={styles.pickerLabel}>Carrier</span>
                <div className={`${styles.imagePickerGrid} ${styles.imagePickerGridTight}`}>
                  {airtimeProviderOptions.map((option) => (
                    <button
                      type="button"
                      key={option.value}
                      className={`${styles.imagePickerCard} ${
                        form.provider_name === option.value ? styles.imagePickerCardActive : ""
                      }`}
                      onClick={() => updateField("provider_name", option.value)}
                    >
                      <div
                        className={`${styles.serviceTileArt} ${styles[airtimeImageClassMap[option.value]]}`}
                        style={{ "--sheet-image": `url(${airtimeSpriteSheet})` }}
                      />
                      <strong>{option.label}</strong>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {form.payment_kind === "bill" ? (
              <CustomSelect
                label="Provider"
                value={form.provider_name || providerOptions[0]?.value || ""}
                options={providerOptions.length ? providerOptions : [{ value: "", label: "Select provider" }]}
                onChange={(value) => updateField("provider_name", value)}
              />
            ) : null}

            <CustomSelect
              label="Pay from"
              value={form.from_account}
              options={accountOptions}
              onChange={(value) => updateField("from_account", value)}
            />

            <label>
              {form.payment_kind === "airtime" ? "Phone number" : "Account / reference number"}
              <input
                value={form.customer_reference}
                onChange={(event) => updateField("customer_reference", event.target.value)}
                placeholder={form.payment_kind === "airtime" ? "e.g. 2025550189" : "Billing account number"}
                required
              />
            </label>

            <label>
              Amount
              <input
                type="number"
                min="1"
                step="0.01"
                value={form.amount}
                onChange={(event) => updateField("amount", event.target.value)}
                placeholder="0.00"
                required
              />
            </label>

            <label>
              Note
              <textarea
                rows="4"
                value={form.note}
                onChange={(event) => updateField("note", event.target.value)}
                placeholder="Optional billing note or payment memo"
              />
            </label>

            <section className={styles.billReviewCard}>
              <div className={styles.billReviewHead}>
                <div>
                  <span>Ready to submit</span>
                  <strong>{form.payment_kind === "airtime" ? "Airtime request" : "Bill payment request"}</strong>
                </div>
                <div className={styles.billReviewPinBadge}>
                  <FiLock />
                  <small>{checkingPin ? "Checking PIN..." : hasPin ? "PIN secured" : "PIN needed"}</small>
                </div>
              </div>

              <div className={styles.billReviewGrid}>
                <div>
                  <span>Provider</span>
                  <strong>{form.provider_name || "Choose provider"}</strong>
                </div>
                <div>
                  <span>From</span>
                  <strong>{accountOptions.find((item) => item.value === form.from_account)?.label || "Select account"}</strong>
                </div>
                <div>
                  <span>Reference</span>
                  <strong>{form.customer_reference || "Add reference"}</strong>
                </div>
                <div>
                  <span>Amount</span>
                  <strong>{formatMoney(form.amount)}</strong>
                </div>
              </div>
            </section>

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Review & Confirm"}
            </button>
          </form>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHead}>
            <div>
              <h2>Recent Requests</h2>
              <p>Your latest bills and airtime payment requests.</p>
            </div>
            <div className={styles.viewToggle} aria-label="History view mode">
              <button
                type="button"
                className={historyView === "list" ? styles.viewToggleActive : ""}
                onClick={() => setHistoryView("list")}
                aria-label="List view"
              >
                <FiList />
              </button>
              <button
                type="button"
                className={historyView === "grid" ? styles.viewToggleActive : ""}
                onClick={() => setHistoryView("grid")}
                aria-label="Grid view"
              >
                <FiGrid />
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.preloaderBlock}>
              <span />
              <strong>Loading bill payments...</strong>
            </div>
          ) : payments.length === 0 ? (
            <p className={styles.empty}>No bill or airtime requests yet.</p>
          ) : (
            <div
              className={`${styles.transactionList} ${
                historyView === "grid" ? styles.transactionGrid : styles.transactionListGlass
              }`}
            >
              {payments.map((payment) => (
                <div
                  className={`${styles.transactionItem} ${
                    historyView === "grid" ? styles.transactionCardGrid : styles.transactionCardGlass
                  }`}
                  key={payment.id}
                >
                  <span
                    className={`${styles.transactionIcon} ${
                      styles[
                        payment.payment_kind === "airtime"
                          ? airtimeImageClassMap[payment.provider_name] || "airtimeArtVerizon"
                          : billImageClassMap[payment.bill_category] || "billArtElectricity"
                      ]
                    } ${styles.transactionImageIcon}`}
                    style={{
                      "--sheet-image": `url(${payment.payment_kind === "airtime" ? airtimeSpriteSheet : billsSpriteSheet})`,
                    }}
                  />
                  <div>
                    <strong>{payment.provider_name}</strong>
                    <small>
                      {payment.payment_kind === "airtime" ? "Airtime" : payment.bill_category} • {payment.from_account} • {payment.created_at}
                    </small>
                  </div>
                  <div className={styles.historyAside}>
                    <b>{formatMoney(payment.amount)}</b>
                    <small>{payment.status}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>

      <MobileFooterNav />
      <GlassToast toasts={toasts} onDismiss={dismissToast} />
      <TransactionPinPrompt
        open={pinOpen}
        title="Confirm this payment"
        description="Enter your 6-digit transaction PIN to submit this request for admin approval."
        value={pin}
        onChange={setPin}
        onClose={() => {
          if (submitting) return;
          setPinOpen(false);
          setPin("");
        }}
        onSubmit={submit}
        loading={submitting}
        length={6}
      />
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
