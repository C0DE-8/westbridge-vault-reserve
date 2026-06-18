import { useEffect } from "react";
import { FiDelete, FiLock, FiX } from "react-icons/fi";
import styles from "./TransactionPinPrompt.module.css";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "backspace"];

export default function TransactionPinPrompt({
  open,
  title = "Confirm with PIN",
  description = "Enter your 6-digit transaction PIN to continue.",
  value,
  onChange,
  onClose,
  onSubmit,
  loading = false,
  length = 6,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key === "Backspace") {
        onChange(value.slice(0, -1));
        return;
      }

      if (/^\d$/.test(event.key) && value.length < length) {
        onChange(`${value}${event.key}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [length, onChange, onClose, open, value]);

  if (!open) return null;

  const pushDigit = (digit) => {
    if (value.length >= length) return;
    onChange(`${value}${digit}`);
  };

  const removeDigit = () => onChange(value.slice(0, -1));

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="transaction-pin-title">
      <div className={styles.sheet}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close PIN prompt">
          <FiX />
        </button>

        <div className={styles.heroBadge}>
          <FiLock />
          <span>{Array.from({ length }).map((_, index) => (index < value.length ? "•" : "*")).join(" ")}</span>
        </div>

        <div className={styles.copy}>
          <h3 id="transaction-pin-title">{title}</h3>
          <p>{description}</p>
        </div>

        <div className={styles.slots} aria-label="Transaction PIN digits">
          {Array.from({ length }).map((_, index) => (
            <div className={`${styles.slot} ${index < value.length ? styles.slotFilled : ""}`} key={index}>
              {index < value.length ? <span /> : null}
            </div>
          ))}
        </div>

        <div className={styles.keypad}>
          {keypad.map((key, index) => {
            if (!key) return <div className={styles.keypadSpacer} key={`spacer-${index}`} />;

            if (key === "backspace") {
              return (
                <button
                  type="button"
                  className={styles.keyButton}
                  onClick={removeDigit}
                  aria-label="Delete digit"
                  key={key}
                >
                  <FiDelete />
                </button>
              );
            }

            return (
              <button
                type="button"
                className={styles.keyButton}
                onClick={() => pushDigit(key)}
                disabled={value.length >= length}
                key={key}
              >
                {key}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className={styles.submitButton}
          disabled={loading || value.length !== length}
          onClick={onSubmit}
        >
          {loading ? "Confirming..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
