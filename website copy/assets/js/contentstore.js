/* =============================================================================
 *  MOD — Content Store
 *  Bridges hard-coded defaults (realdata.js) with admin-edited content
 *  stored in localStorage. Public pages render through this store so admin
 *  edits appear live without code changes.
 *
 *  Public API
 *  ──────────
 *    MOD_STORE.get()                   → full content blob
 *    MOD_STORE.slides()                → array of {img, role, name, alt}
 *    MOD_STORE.press()                 → array of press release objects
 *    MOD_STORE.leadership()            → {minister, ministerOfState, permSec}
 *    MOD_STORE.subscribers()           → newsletter signups
 *    MOD_STORE.addSubscriber(email)    → store a newsletter signup
 *    MOD_STORE.save(blob)              → admin-only: replace the entire blob
 *    MOD_STORE.update(path, value)     → admin-only: deep-update one key
 *    MOD_STORE.export()                → JSON string for backup
 *    MOD_STORE.import(json)            → load from a JSON backup
 *    MOD_STORE.reset()                 → forget all edits, revert to defaults
 * ============================================================================= */
(function (window) {
  "use strict";

  const KEY = "mod-content-v1";
  const SUBS_KEY = "mod-subscribers-v1";

  function defaults() {
    const D = window.MOD_DATA || {};
    return {
      // Hero headline + lead
      hero: {
        eyebrow: "Federal Republic of Nigeria",
        headline: "Defending the sovereignty of Nigeria.",
        body: "The Federal Ministry of Defence — the apex policy authority overseeing the Nigerian Armed Forces — provides strategic leadership for a modern, professional, mission-ready military in the service of more than 220 million citizens of the Federal Republic.",
      },
      // Hero slider
      slides: (D.HERO_SLIDES || []).map((s) => ({ ...s })),
      // Press releases
      press: (D.PRESS || []).map((p) => ({ ...p })),
      // Leadership
      leadership: {
        minister: { ...((D.LEADERSHIP && D.LEADERSHIP.minister) || {}) },
        ministerOfState: { ...((D.LEADERSHIP && D.LEADERSHIP.ministerOfState) || {}) },
        permSec: { ...((D.LEADERSHIP && D.LEADERSHIP.permSec) || {}) },
      },
      // Site-wide settings
      settings: {
        lastReviewed: "May 2026",
        ministryName: "Federal Ministry of Defence",
        country: "Federal Republic of Nigeria",
      },
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const stored = JSON.parse(raw);
      // Shallow-merge with defaults so new fields appear when added later
      const d = defaults();
      return {
        hero:       Object.assign({}, d.hero, stored.hero || {}),
        slides:     Array.isArray(stored.slides) && stored.slides.length ? stored.slides : d.slides,
        press:      Array.isArray(stored.press)  && stored.press.length  ? stored.press  : d.press,
        leadership: {
          minister:        Object.assign({}, d.leadership.minister, (stored.leadership && stored.leadership.minister) || {}),
          ministerOfState: Object.assign({}, d.leadership.ministerOfState, (stored.leadership && stored.leadership.ministerOfState) || {}),
          permSec:         Object.assign({}, d.leadership.permSec, (stored.leadership && stored.leadership.permSec) || {}),
        },
        settings:   Object.assign({}, d.settings, stored.settings || {}),
      };
    } catch (e) {
      console.warn("[MOD_STORE] load failed, using defaults:", e);
      return defaults();
    }
  }

  function persist(blob) {
    try { localStorage.setItem(KEY, JSON.stringify(blob)); }
    catch (e) { console.warn("[MOD_STORE] save failed:", e); }
  }

  const STORE = {
    get() { return load(); },
    slides() { return load().slides; },
    press() { return load().press; },
    leadership() { return load().leadership; },
    hero() { return load().hero; },
    settings() { return load().settings; },

    save(blob) {
      persist(blob);
      // Re-render public pages that are listening
      window.dispatchEvent(new CustomEvent("mod-content-updated"));
    },

    update(path, value) {
      const blob = load();
      const parts = path.split(".");
      let cur = blob;
      for (let i = 0; i < parts.length - 1; i++) {
        const k = parts[i];
        if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
        cur = cur[k];
      }
      cur[parts[parts.length - 1]] = value;
      this.save(blob);
    },

    export() {
      return JSON.stringify(load(), null, 2);
    },

    import(json) {
      try {
        const parsed = typeof json === "string" ? JSON.parse(json) : json;
        this.save(parsed);
        return true;
      } catch (e) { console.warn("[MOD_STORE] import failed:", e); return false; }
    },

    reset() {
      try { localStorage.removeItem(KEY); } catch {}
      window.dispatchEvent(new CustomEvent("mod-content-updated"));
    },

    // Newsletter
    subscribers() {
      try { return JSON.parse(localStorage.getItem(SUBS_KEY) || "[]"); }
      catch { return []; }
    },
    addSubscriber(email) {
      if (!email) return false;
      const list = this.subscribers();
      const exists = list.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (exists) return false;
      list.push({ email, when: new Date().toISOString() });
      try { localStorage.setItem(SUBS_KEY, JSON.stringify(list)); } catch {}
      return true;
    },
    removeSubscriber(email) {
      const list = this.subscribers().filter((s) => s.email.toLowerCase() !== email.toLowerCase());
      try { localStorage.setItem(SUBS_KEY, JSON.stringify(list)); } catch {}
    },
    exportSubscribers() {
      const list = this.subscribers();
      const rows = [["email", "subscribed_at"]].concat(list.map((s) => [s.email, s.when]));
      return rows.map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    },
  };

  window.MOD_STORE = STORE;
})(window);
