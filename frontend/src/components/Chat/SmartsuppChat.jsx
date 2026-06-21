import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SMARTSUPP_CONFIG = {
  key: "9b56fa3303342809cc8f392ba7cf0468d0866750",
  scriptId: "smartsupp-live-chat-script",
  scriptSrc: "https://www.smartsuppchat.com/loader.js?",
};

function routeAllowsChat(pathname) {
  return !pathname.startsWith("/admin") && !pathname.startsWith("/lock/admin");
}

function setChatVisibility(visible) {
  document.documentElement.classList.toggle("smartsupp-chat-hidden", !visible);
}

function ensureChatOffsetStyles() {
  if (document.getElementById("smartsupp-chat-offset-styles")) return;

  const style = document.createElement("style");
  style.id = "smartsupp-chat-offset-styles";
  style.textContent = `
    .smartsupp-chat-hidden iframe[src*="smartsupp"],
    .smartsupp-chat-hidden iframe[title*="Smartsupp"],
    .smartsupp-chat-hidden iframe[title*="chat"],
    .smartsupp-chat-hidden #smartsupp-widget-container,
    .smartsupp-chat-hidden #smartsupp-chat-container,
    .smartsupp-chat-hidden #chat-application,
    .smartsupp-chat-hidden #chat-widget-container,
    .smartsupp-chat-hidden [id*="smartsupp"],
    .smartsupp-chat-hidden [class*="smartsupp"] {
      display: none !important;
    }

    @media (max-width: 980px) {
      :root {
        --wb-smartsupp-mobile-bottom: 190px;
      }

      iframe[src*="smartsupp"],
      iframe[title*="Smartsupp"],
      iframe[title*="chat"],
      #smartsupp-widget-container,
      #smartsupp-chat-container,
      #chat-application,
      #chat-widget-container,
      [id*="smartsupp"],
      [class*="smartsupp"] {
        bottom: var(--wb-smartsupp-mobile-bottom) !important;
        right: 14px !important;
      }

      iframe[src*="smartsupp"],
      iframe[title*="Smartsupp"],
      iframe[title*="chat"] {
        transform: none !important;
      }
    }

    @media (max-width: 420px) {
      :root {
        --wb-smartsupp-mobile-bottom: 204px;
      }

      iframe[src*="smartsupp"],
      iframe[title*="Smartsupp"],
      iframe[title*="chat"],
      #smartsupp-widget-container,
      #smartsupp-chat-container,
      #chat-application,
      #chat-widget-container,
      [id*="smartsupp"],
      [class*="smartsupp"] {
        bottom: var(--wb-smartsupp-mobile-bottom) !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function isLikelyChatWidget(element) {
  const identity = `${element.id || ""} ${element.className || ""} ${element.getAttribute?.("src") || ""} ${element.getAttribute?.("title") || ""}`.toLowerCase();
  if (identity.includes("smartsupp") || identity.includes("chat-widget") || identity.includes("chat-application")) {
    return true;
  }

  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const fixedNearMobileFooter =
    style.position === "fixed" &&
    Number.parseInt(style.zIndex || "0", 10) > 1000 &&
    rect.width <= 420 &&
    rect.height <= 720 &&
    rect.right > window.innerWidth - 180 &&
    rect.bottom > window.innerHeight - 180;

  return fixedNearMobileFooter;
}

function applyChatMobilePosition() {
  if (window.innerWidth > 980) return;

  const bottom = window.innerWidth <= 420 ? "204px" : "190px";
  const selectors = [
    'iframe[src*="smartsupp"]',
    'iframe[title*="Smartsupp"]',
    'iframe[title*="chat"]',
    "#smartsupp-widget-container",
    "#smartsupp-chat-container",
    "#chat-application",
    "#chat-widget-container",
    '[id*="smartsupp"]',
    '[class*="smartsupp"]',
    "iframe",
    "div",
  ];

  document.querySelectorAll(selectors.join(",")).forEach((element) => {
    if (!isLikelyChatWidget(element)) return;

    element.style.setProperty("bottom", bottom, "important");
    element.style.setProperty("right", "14px", "important");
    element.style.setProperty("margin-bottom", "0", "important");
    element.style.setProperty("transform", "none", "important");

    if (element.parentElement && isLikelyChatWidget(element.parentElement)) {
      element.parentElement.style.setProperty("bottom", bottom, "important");
      element.parentElement.style.setProperty("right", "14px", "important");
      element.parentElement.style.setProperty("margin-bottom", "0", "important");
      element.parentElement.style.setProperty("transform", "none", "important");
    }
  });
}

export default function SmartsuppChat() {
  const location = useLocation();

  useEffect(() => {
    const allowed = routeAllowsChat(location.pathname);
    setChatVisibility(allowed);
    ensureChatOffsetStyles();

    if (!allowed) return undefined;

    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_CONFIG.key;

    if (!window.smartsupp) {
      window.smartsupp = function smartsuppQueue() {
        window.smartsupp._.push(arguments);
      };
      window.smartsupp._ = [];
    }

    if (!document.getElementById(SMARTSUPP_CONFIG.scriptId)) {
      const firstScript = document.getElementsByTagName("script")[0];
      const script = document.createElement("script");
      script.id = SMARTSUPP_CONFIG.scriptId;
      script.type = "text/javascript";
      script.charset = "utf-8";
      script.async = true;
      script.src = SMARTSUPP_CONFIG.scriptSrc;
      firstScript.parentNode.insertBefore(script, firstScript);
    }

    if (window.smartsupp) {
      window.smartsupp("chat:show");
    }

    applyChatMobilePosition();
    const interval = window.setInterval(applyChatMobilePosition, 700);
    const observer = new MutationObserver(applyChatMobilePosition);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "id"],
    });
    window.addEventListener("resize", applyChatMobilePosition);

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
      window.removeEventListener("resize", applyChatMobilePosition);
    };
  }, [location.pathname]);

  return null;
}
