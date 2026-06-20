import { useEffect, useId, useRef, useState } from "react";
import { FiGlobe } from "react-icons/fi";
import styles from "./LanguageSwitcher.module.css";

const STORAGE_KEY = "wb_language";
const SCRIPT_ID = "google-translate-script";
const ELEMENT_ID = "google_translate_element";
let googleTranslateReady = false;

const fallbackLanguages = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" },
  { code: "zh-CN", label: "Chinese" },
  { code: "hi", label: "Hindi" },
  { code: "ja", label: "Japanese" },
];

const languageFlagCountries = {
  af: "za",
  ak: "gh",
  am: "et",
  ar: "sa",
  as: "in",
  ay: "bo",
  az: "az",
  be: "by",
  bg: "bg",
  bho: "in",
  bm: "ml",
  bn: "bd",
  bs: "ba",
  ca: "es",
  ceb: "ph",
  ckb: "iq",
  co: "fr",
  cs: "cz",
  cy: "gb",
  da: "dk",
  de: "de",
  doi: "in",
  dv: "mv",
  ee: "gh",
  el: "gr",
  en: "us",
  es: "es",
  et: "ee",
  eu: "es",
  fa: "ir",
  fi: "fi",
  fr: "fr",
  fy: "nl",
  ga: "ie",
  gd: "gb-sct",
  gl: "es",
  gu: "in",
  ha: "ng",
  haw: "us",
  he: "il",
  hi: "in",
  hmn: "cn",
  hr: "hr",
  ht: "ht",
  hu: "hu",
  hy: "am",
  id: "id",
  ig: "ng",
  ilo: "ph",
  is: "is",
  it: "it",
  iw: "il",
  ja: "jp",
  jw: "id",
  jv: "id",
  ka: "ge",
  kk: "kz",
  km: "kh",
  kn: "in",
  ko: "kr",
  kri: "sl",
  ku: "iq",
  ky: "kg",
  la: "va",
  lb: "lu",
  lo: "la",
  lt: "lt",
  lus: "in",
  lv: "lv",
  mai: "in",
  mg: "mg",
  mi: "nz",
  mk: "mk",
  ml: "in",
  "mni-Mtei": "in",
  mn: "mn",
  mr: "in",
  ms: "my",
  mt: "mt",
  my: "mm",
  ne: "np",
  nl: "nl",
  no: "no",
  ny: "mw",
  om: "et",
  or: "in",
  pa: "in",
  pl: "pl",
  ps: "af",
  pt: "pt",
  qu: "pe",
  ro: "ro",
  ru: "ru",
  sa: "in",
  sd: "pk",
  si: "lk",
  sk: "sk",
  sl: "si",
  sm: "ws",
  sn: "zw",
  so: "so",
  sq: "al",
  sr: "rs",
  st: "ls",
  su: "id",
  sv: "se",
  sw: "tz",
  ta: "in",
  te: "in",
  tg: "tj",
  th: "th",
  ti: "er",
  tl: "ph",
  tk: "tm",
  tr: "tr",
  ts: "za",
  uk: "ua",
  ur: "pk",
  uz: "uz",
  vi: "vn",
  xh: "za",
  yi: "il",
  yo: "ng",
  "zh-CN": "cn",
  "zh-TW": "tw",
  zu: "za",
};

function flagCountryForLanguage(code) {
  return languageFlagCountries[code] || languageFlagCountries[String(code).split("-")[0]] || "";
}

function flagUrlForLanguage(code) {
  const countryCode = flagCountryForLanguage(code);
  return countryCode ? `https://flagcdn.com/w40/${countryCode}.png` : "";
}

function FlagIcon({ language }) {
  const [failed, setFailed] = useState(false);
  const flagUrl = flagUrlForLanguage(language.code);
  const showFallback = failed || !flagUrl;

  useEffect(() => {
    setFailed(false);
  }, [language.code]);

  if (showFallback) {
    return (
      <span className={styles.flagFallback} aria-hidden="true">
        <FiGlobe />
      </span>
    );
  }

  return (
    <img
      className={styles.flagImage}
      src={flagUrl}
      srcSet={`${flagUrlForLanguage(language.code).replace("/w40/", "/w80/")} 2x`}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function ensureGoogleElement() {
  if (document.getElementById(ELEMENT_ID)) return;
  const element = document.createElement("div");
  element.id = ELEMENT_ID;
  element.style.display = "none";
  document.body.appendChild(element);
}

function initializeGoogleTranslate() {
  ensureGoogleElement();

  window.googleTranslateElementInit = () => {
    if (!window.google?.translate?.TranslateElement) return;
    const element = document.getElementById(ELEMENT_ID);
    if (!element) return;

    if (!element.dataset.initialized) {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
        },
        ELEMENT_ID
      );
      element.dataset.initialized = "true";
    }

    googleTranslateReady = true;
  };

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  } else if (window.google?.translate?.TranslateElement) {
    window.googleTranslateElementInit();
  }
}

function setTranslateCookie(code) {
  const expires = code === "en" ? "Thu, 01 Jan 1970 00:00:00 GMT" : "";
  const value = code === "en" ? "" : `/en/${code}`;
  document.cookie = `googtrans=${value}; path=/; ${expires ? `expires=${expires};` : ""}`;
  document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}; ${expires ? `expires=${expires};` : ""}`;
}

function syncDocumentLanguage(code) {
  document.documentElement.lang = code || "en";
  setTranslateCookie(code || "en");
}

function applyGoogleLanguageWithoutReload(code) {
  syncDocumentLanguage(code);

  if (code === "en") return true;

  const combo = document.querySelector(".goog-te-combo");
  if (!combo) return false;

  if (combo.value !== code) {
    combo.value = code;
    combo.dispatchEvent(new Event("change"));
  }

  return true;
}

function isTranslatedPage(code) {
  if (code === "en") return true;
  return (
    document.documentElement.classList.contains("translated-ltr") ||
    document.documentElement.classList.contains("translated-rtl")
  );
}

export function prepareSavedGoogleLanguage({ timeout = 5200, minDelay = 650, settleDelay = 900 } = {}) {
  const savedLanguage = localStorage.getItem(STORAGE_KEY) || "en";
  const startedAt = Date.now();

  syncDocumentLanguage(savedLanguage);
  initializeGoogleTranslate();

  return new Promise((resolve) => {
    const finish = () => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, minDelay - elapsed);
      window.setTimeout(resolve, remaining);
    };

    if (savedLanguage === "en") {
      finish();
      return;
    }

    let appliedAt = 0;
    const interval = window.setInterval(() => {
      const applied = applyGoogleLanguageWithoutReload(savedLanguage);

      if (applied && !appliedAt) {
        appliedAt = Date.now();
      }

      const translated = appliedAt && isTranslatedPage(savedLanguage) && Date.now() - appliedAt >= settleDelay;
      const timedOut = Date.now() - startedAt >= timeout;

      if (translated || timedOut) {
        window.clearInterval(interval);
        finish();
      }
    }, 150);
  });
}

function applyGoogleLanguage(code) {
  syncDocumentLanguage(code);

  const combo = document.querySelector(".goog-te-combo");
  if (combo && code !== "en") {
    combo.value = code;
    combo.dispatchEvent(new Event("change"));
    return;
  }

  window.location.reload();
}

function getGoogleLanguages() {
  const combo = document.querySelector(".goog-te-combo");
  if (!combo?.options?.length) return [];

  const options = Array.from(combo.options)
    .filter((option) => option.value)
    .map((option) => ({
      code: option.value,
      label: option.textContent || option.value,
    }));

  return [{ code: "en", label: "English" }, ...options];
}

export default function LanguageSwitcher({ compact = false }) {
  const labelId = useId();
  const listboxId = useId();
  const switcherRef = useRef(null);
  const restoredLanguageRef = useRef(false);
  const [language, setLanguage] = useState(() => localStorage.getItem(STORAGE_KEY) || "en");
  const [languageOptions, setLanguageOptions] = useState(fallbackLanguages);
  const [open, setOpen] = useState(false);
  const selectedLanguage = languageOptions.find((item) => item.code === language) || fallbackLanguages[0];

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY) || "en";
    setLanguage(savedLanguage);
    syncDocumentLanguage(savedLanguage);
    initializeGoogleTranslate();

    const interval = window.setInterval(() => {
      const googleLanguages = getGoogleLanguages();
      if (googleLanguages.length) {
        setLanguageOptions(googleLanguages);
        if (!restoredLanguageRef.current) {
          restoredLanguageRef.current = applyGoogleLanguageWithoutReload(savedLanguage);
        }
        if (restoredLanguageRef.current) window.clearInterval(interval);
      } else if (googleTranslateReady && savedLanguage === "en") {
        restoredLanguageRef.current = true;
        window.clearInterval(interval);
      }
    }, 700);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!switcherRef.current?.contains(event.target)) setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSelect = (nextLanguage) => {
    setOpen(false);
    if (nextLanguage === language) return;
    setLanguage(nextLanguage);
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    applyGoogleLanguage(nextLanguage);
  };

  return (
    <div className={`${styles.switcher} ${compact ? styles.compact : ""}`} ref={switcherRef}>
      <span id={labelId}>Language</span>
      <div className={styles.control}>
        <b className={styles.languageMark} aria-hidden="true">
          <FiGlobe />
          <span className={styles.flagBadge}>
            <FlagIcon language={selectedLanguage} />
          </span>
        </b>
        <strong className={styles.selectedLanguage}>
          {selectedLanguage.label}
          <small>{selectedLanguage.code.toUpperCase()}</small>
        </strong>
        <button
          type="button"
          className={styles.selectButton}
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((current) => !current)}
        />
        {open ? (
          <div className={styles.options} id={listboxId} role="listbox" aria-labelledby={labelId}>
            {languageOptions.map((item) => (
              <button
                type="button"
                key={item.code}
                className={`${styles.option} ${item.code === language ? styles.optionActive : ""}`}
                role="option"
                aria-selected={item.code === language}
                onClick={() => handleSelect(item.code)}
              >
                <span className={styles.optionFlag}>
                  <FlagIcon language={item} />
                </span>
                <span className={styles.optionText}>
                  <strong>{item.label}</strong>
                  <small>{item.code.toUpperCase()}</small>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <small>Powered by Google</small>
    </div>
  );
}
