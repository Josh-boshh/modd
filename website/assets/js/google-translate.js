/* =============================================================================
 *  FEDERAL MINISTRY OF DEFENCE — Google Translate integration
 *
 *  Uses the free Google Translate Website Widget (translate.google.com/element.js).
 *  No API key, no billing, no Cloud Console setup — works immediately.
 *
 *  Behaviour
 *  ─────────
 *    • Loads Google Translate library lazily on every page.
 *    • Creates a hidden Google widget; suppresses Google's banner / top bar.
 *    • Drives translation through the existing `.lang-select` dropdown in the
 *      top ribbon — change a language there and the WHOLE site translates.
 *    • Selection is saved to localStorage and re-applied on every page reload.
 *    • Translates dynamic content (chatbot replies, admin-injected news) too,
 *      because Google's widget watches the DOM.
 *
 *  Languages: English, Hausa, Igbo, Yoruba, French, Spanish, Chinese (Simp.).
 * ============================================================================= */
(function (window, document) {
  "use strict";

  const STORAGE_KEY = "mod-lang";
  const SUPPORTED = ["en", "ha", "ig", "yo", "fr", "es", "zh-CN"];

  // 1. Inject the hidden mount-point for the Google widget
  function ensureMount() {
    if (document.getElementById("google_translate_element")) return;
    const el = document.createElement("div");
    el.id = "google_translate_element";
    el.style.cssText = "position:absolute;left:-9999px;top:-9999px;visibility:hidden;";
    document.body.appendChild(el);
  }

  // 2. Google's loader expects a global named callback
  window.googleTranslateElementInit = function () {
    if (!window.google || !window.google.translate) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: SUPPORTED.join(","),
        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      },
      "google_translate_element"
    );
    // After init, restore the saved language (if any)
    setTimeout(applyStoredLanguage, 400);
    // After init, suppress Google's auto-injected banner / top inline bar
    setTimeout(suppressGoogleUI, 600);
    setTimeout(suppressGoogleUI, 1500);
  };

  // 3. Suppress Google's branded UI so only our pill remains visible
  function suppressGoogleUI() {
    // Remove the top banner Google injects
    document.querySelectorAll(".goog-te-banner-frame, .skiptranslate iframe").forEach((el) => {
      el.style.display = "none";
    });
    document.body.style.top = "0";
    document.body.style.position = "static";
    // Suppress Google's font tooltip
    document.querySelectorAll("font[style]").forEach((el) => {
      el.style.background = "transparent";
      el.style.boxShadow = "none";
    });
  }

  // Persistent observer that keeps killing the banner if it reappears
  function startBannerKiller() {
    suppressGoogleUI();
    new MutationObserver(suppressGoogleUI).observe(document.body, { childList: true, subtree: true });
  }

  // 4. Apply a translation by driving Google's hidden <select.goog-te-combo>
  function setLanguage(code) {
    if (!code || !SUPPORTED.includes(code)) code = "en";
    localStorage.setItem(STORAGE_KEY, code);
    const tryApply = (attempts) => {
      const gSel = document.querySelector(".goog-te-combo");
      if (gSel) {
        // Google's widget treats empty value as "Original / English"
        gSel.value = code === "en" ? "" : code;
        gSel.dispatchEvent(new Event("change"));
        if (code === "en") {
          // Force a full revert by reloading without the GOOGLE cookie
          // (only if the page is currently translated)
          if (document.documentElement.classList.contains("translated-ltr") ||
              document.documentElement.classList.contains("translated-rtl")) {
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + location.hostname;
          }
        }
        return;
      }
      if (attempts > 0) setTimeout(() => tryApply(attempts - 1), 300);
    };
    tryApply(15);
  }

  function applyStoredLanguage() {
    const saved = localStorage.getItem(STORAGE_KEY) || "en";
    if (saved && saved !== "en") setLanguage(saved);
    syncDropdown();
  }

  // 5. Wire our custom .lang-select dropdown
  function wireDropdown() {
    const sel = document.querySelector(".lang-select");
    if (!sel || sel.__gtBound) return;
    sel.__gtBound = true;

    // Populate options from MOD_CONFIG (already done by i18n.js, but be defensive)
    if (window.MOD_CONFIG && window.MOD_CONFIG.LANGUAGES && sel.options.length < 2) {
      sel.innerHTML = "";
      Object.entries(window.MOD_CONFIG.LANGUAGES).forEach(([code, label]) => {
        const o = document.createElement("option");
        o.value = code;
        o.textContent = label;
        sel.appendChild(o);
      });
    }
    syncDropdown();

    sel.addEventListener("change", function () {
      setLanguage(sel.value);
      indicateBusy(true);
      setTimeout(() => indicateBusy(false), 800);
    });
  }

  function syncDropdown() {
    const sel = document.querySelector(".lang-select");
    if (!sel) return;
    const saved = localStorage.getItem(STORAGE_KEY) || "en";
    if (Array.from(sel.options).some((o) => o.value === saved)) sel.value = saved;
  }

  function indicateBusy(b) {
    const ind = document.querySelector(".lang-status");
    if (!ind) return;
    ind.classList.toggle("busy", b);
    ind.textContent = b ? "Translating…" : "";
  }

  // 6. Load Google Translate library
  function loadGoogleLib() {
    if (window.__gtLoaded) return; window.__gtLoaded = true;
    const s = document.createElement("script");
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async = true;
    document.head.appendChild(s);
  }

  // 7. Boot
  function boot() {
    ensureMount();
    loadGoogleLib();
    // Try to wire as soon as the topbar lands (partials.js injects header on DOMContentLoaded)
    const attempt = () => {
      wireDropdown();
      if (!document.querySelector(".lang-select")) setTimeout(attempt, 200);
    };
    attempt();
    startBannerKiller();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();

  // Expose a tiny public API (useful for the chatbot or other scripts)
  window.MOD_TRANSLATE = {
    set: setLanguage,
    current: () => localStorage.getItem(STORAGE_KEY) || "en",
    supported: SUPPORTED.slice(),
  };
})(window, document);
