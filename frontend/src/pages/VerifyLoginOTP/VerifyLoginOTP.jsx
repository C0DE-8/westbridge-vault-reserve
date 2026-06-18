import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./VerifyLoginOTP.module.css";

const BRAND_LOGO = "/westbridge-assets/images/westbridge.png";

export default function VerifyLoginOTP() {
  const navigate = useNavigate();
  const { verifyOtpLogin } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const savedEmail = localStorage.getItem("pendingLoginEmail") || "";

  const [formData, setFormData] = useState({
    email: savedEmail,
    otp: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!savedEmail) {
      alert("Login session expired. Please login again.");
      navigate("/login", { replace: true });
    }
  }, [savedEmail, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      alert("Missing login email. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOtpLogin({
        email: formData.email,
        otp: formData.otp,
      });

      localStorage.removeItem("pendingLoginEmail");

      if (res?.user?.is_admin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      alert(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.backgroundGlowOne}></div>
      <div className={styles.backgroundGlowTwo}></div>
      <div className={styles.backgroundGrid}></div>

      <div className={`${styles.loginShell} ${mounted ? styles.showShell : ""}`}>
        <div className={styles.formPanel}>
          <div className={styles.logoRow}>
            <img className={styles.logoImage} src={BRAND_LOGO} alt="West Bridge Vault Reserve" />
          </div>

          <div className={styles.formContent}>
            <h1>Verify login OTP</h1>
            <p className={styles.subtitle}>
              Enter the one-time password sent to your email to complete your
              secure sign in and continue to your West Bridge Vault Reserve dashboard.
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your login email"
                  value={formData.email}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>OTP Code</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  inputMode="numeric"
                />
              </div>

              <div className={styles.formExtras}>
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => navigate("/login")}
                >
                  Back to login
                </button>
              </div>

              <button
                className={styles.primaryBtn}
                type="submit"
                disabled={loading || !formData.email}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>

        <div className={styles.visualPanel}>
          <div className={styles.visualOverlay}></div>
          <div className={styles.floatingOrbOne}></div>
          <div className={styles.floatingOrbTwo}></div>

          <div className={styles.visualContent}>
            <div className={styles.stars}>✦ ✦</div>
            <h2>Secure every login with trusted verification.</h2>
            <p>
              Your account security matters. Confirm your one-time password and
              continue with confidence using West Bridge Vault Reserve's protected login flow.
            </p>

            <div className={styles.usersRow}>
              <div className={styles.userBubble}>S</div>
              <div className={styles.userBubble}>B</div>
              <div className={styles.userBubble}>✓</div>
              <span>Protected access for every session</span>
            </div>
          </div>

          <div className={styles.cardMock}>
            <div className={styles.cardChip}></div>
            <div className={styles.cardBrand}>OTP</div>
            <div className={styles.cardNumber}>•••• •••• •••• 9021</div>
            <div className={styles.cardFooter}>
              <span>SECURE LOGIN</span>
              <span>WEST BRIDGE</span>
            </div>
          </div>

          <div className={styles.statsCard}>
            <span className={styles.statsLabel}>Security Check</span>
            <strong>2FA</strong>
          </div>

          <div className={styles.curve}></div>
        </div>
      </div>
    </div>
  );
}
