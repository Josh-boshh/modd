/* =============================================================================
 *  FEDERAL MINISTRY OF DEFENCE — main JS
 *  Mobile nav · counters · hero slider · a11y · search · date stamping
 * ============================================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    hardenImages();
    initMobileMenu();
    initCounters();
    initA11y();
    initHeroSlider();
    initTabs();
    stampDates();
  });

  // Make every image referrer-friendly and add a graceful fallback so a broken
  // hot-link never collapses its container.
  function hardenImages() {
    document.querySelectorAll("img").forEach(applyHarden);
    // Catch any images added later (partials, chatbot, async injects)
    new MutationObserver((muts) => {
      muts.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.tagName === "IMG") applyHarden(n);
        n.querySelectorAll && n.querySelectorAll("img").forEach(applyHarden);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  }

  function applyHarden(img) {
    if (img.__hardened) return;
    img.__hardened = true;
    if (!img.hasAttribute("referrerpolicy")) img.setAttribute("referrerpolicy", "no-referrer");
    if (!img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
    if (!img.hasAttribute("decoding")) img.setAttribute("decoding", "async");
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr);
      // Replace with a neutral inline SVG so the layout never collapses
      const w = img.getAttribute("width") || 200;
      const h = img.getAttribute("height") || 200;
      const label = (img.alt || "").slice(0, 24);
      img.src = "data:image/svg+xml;utf8," + encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'>
           <rect width='${w}' height='${h}' fill='#E6F4ED'/>
           <text x='50%' y='50%' fill='#008751' font-family='Inter,Arial' font-size='14' text-anchor='middle' dominant-baseline='middle'>${label || "MOD"}</text>
         </svg>`
      );
    }, { once: true });
  }

  function initMobileMenu() {
    const t = document.querySelector(".mobile-toggle");
    const m = document.querySelector(".menu");
    if (t && m) {
      t.addEventListener("click", () => {
        m.classList.toggle("open");
        t.setAttribute("aria-expanded", m.classList.contains("open"));
      });
    }
  }

  function initCounters() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseFloat(el.getAttribute("data-count"));
          const suffix = el.getAttribute("data-suffix") || "";
          const dur = 1400, start = performance.now();
          function frame(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString() + suffix;
            if (p < 1) requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });
    els.forEach((c) => obs.observe(c));
  }

  function initA11y() {
    document.addEventListener("click", (e) => {
      const tog = e.target.closest("[data-a11y-toggle]");
      if (tog) { document.getElementById("a11yPanel")?.classList.toggle("open"); return; }
      const panel = document.getElementById("a11yPanel");
      if (panel && panel.classList.contains("open") && !panel.contains(e.target) && !e.target.closest(".a11y-fab")) {
        panel.classList.remove("open");
      }
    });
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-a11y]");
      if (!btn) return;
      const action = btn.getAttribute("data-a11y");
      const body = document.body;
      switch (action) {
        case "font-default": body.classList.remove("font-large","font-xlarge"); break;
        case "font-large":   body.classList.remove("font-xlarge"); body.classList.add("font-large"); break;
        case "font-xlarge":  body.classList.remove("font-large"); body.classList.add("font-xlarge"); break;
        case "contrast":     body.classList.toggle("high-contrast"); break;
        case "reset":        body.classList.remove("font-large","font-xlarge","high-contrast"); break;
      }
      localStorage.setItem("mod-a11y", action);
    });
    const saved = localStorage.getItem("mod-a11y");
    if (saved && saved !== "reset") {
      const tries = () => {
        const b = document.querySelector(`[data-a11y="${saved}"]`);
        if (b) b.click(); else setTimeout(tries, 100);
      };
      setTimeout(tries, 200);
      setTimeout(() => document.getElementById("a11yPanel")?.classList.remove("open"), 400);
    }
  }

  window.__initHeroSliderPublic = function () { initHeroSlider(); };

  function initHeroSlider() {
    const slider = document.getElementById("heroSlider");
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll(".slide"));
    if (slides.length < 2) return;
    const dotsWrap = document.getElementById("heroDots");
    const role = document.getElementById("heroRole");
    const name = document.getElementById("heroName");
    let idx = 0, timer = null;

    if (dotsWrap) {
      dotsWrap.innerHTML = "";
      slides.forEach((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.setAttribute("aria-label", `Go to slide ${i + 1}`);
        if (i === 0) b.classList.add("active");
        b.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(b);
      });
    }
    function update() {
      slides.forEach((s, i) => s.classList.toggle("active", i === idx));
      dotsWrap && dotsWrap.querySelectorAll("button").forEach((b, i) => b.classList.toggle("active", i === idx));
      const s = slides[idx];
      if (role && s.dataset.captionRole) role.textContent = s.dataset.captionRole;
      if (name && s.dataset.captionName) name.textContent = s.dataset.captionName;
    }
    function goTo(i) { idx = (i + slides.length) % slides.length; update(); restart(); }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }
    function restart() { clearInterval(timer); timer = setInterval(next, 6000); }

    document.querySelector("[data-slider-prev]")?.addEventListener("click", prev);
    document.querySelector("[data-slider-next]")?.addEventListener("click", next);
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);
    update(); restart();
  }

  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((wrap) => {
      const tabs = wrap.querySelectorAll("[data-tab]");
      const panels = wrap.querySelectorAll("[data-panel]");
      tabs.forEach((t) => {
        t.addEventListener("click", () => {
          tabs.forEach((x) => x.classList.remove("active"));
          panels.forEach((p) => p.classList.remove("active"));
          t.classList.add("active");
          const id = t.getAttribute("data-tab");
          wrap.querySelector(`[data-panel="${id}"]`)?.classList.add("active");
        });
      });
    });
  }

  function stampDates() {
    document.querySelectorAll("[data-last-updated]").forEach((el) => {
      el.textContent = (window.MOD_CONFIG && window.MOD_CONFIG.LAST_REVIEWED) || "May 2026";
    });
  }
})();
