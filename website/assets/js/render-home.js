/* =============================================================================
 *  MOD — Home-page renderer. Reads MOD_STORE and patches the home page's
 *  hero slider + leadership + press sections so admin edits appear live.
 * ============================================================================= */
(function () {
  "use strict";
  if (!window.MOD_STORE) return;

  function renderHero() {
    const slider = document.getElementById("heroSlider");
    if (!slider) return;
    const slides = window.MOD_STORE.slides();
    if (!slides || !slides.length) return;
    slider.innerHTML = slides.map((s, i) => `
      <div class="slide${i === 0 ? ' active' : ''}"
           data-caption-role="${escapeAttr(s.role || '')}"
           data-caption-name="${escapeAttr(s.name || '')}">
        <img src="${escapeAttr(s.img)}" alt="${escapeAttr(s.alt || s.name || 'Hero slide')}" referrerpolicy="no-referrer" />
      </div>
    `).join("");

    // Re-init the slider after replacing slides
    if (window.__initHeroSliderPublic) {
      window.__initHeroSliderPublic();
    }
  }

  function renderHeroText() {
    const hero = window.MOD_STORE.hero();
    const eyebrow = document.querySelector(".hero-text .eyebrow");
    const h1 = document.querySelector(".hero-text h1");
    const p = document.querySelector(".hero-text p");
    if (eyebrow && hero.eyebrow) eyebrow.textContent = hero.eyebrow;
    if (h1 && hero.headline) h1.textContent = hero.headline;
    if (p && hero.body) p.textContent = hero.body;
  }

  function renderPress() {
    const press = window.MOD_STORE.press();
    if (!press || !press.length) return;

    // Featured (first item)
    const featured = press[0];
    const feature = document.querySelector(".news-feature");
    if (feature && featured) {
      const a = feature.querySelector("a");
      if (a) a.setAttribute("href", "press.html#" + (featured.slug || ""));
      const img = feature.querySelector(".thumb img");
      if (img) img.setAttribute("src", featured.img);
      const date = feature.querySelector(".date");
      if (date) date.textContent = `${featured.date} · ${featured.category}`;
      const h3 = feature.querySelector("h3");
      if (h3) h3.textContent = featured.title;
      const excerpt = feature.querySelector(".excerpt");
      if (excerpt) excerpt.textContent = featured.excerpt;
    }

    // Side list (items 1..4)
    const side = document.querySelector(".news-side");
    if (side) {
      side.innerHTML = press.slice(1, 5).map((p) => `
        <div class="item">
          <div class="date">${escapeHTML(p.date)} · ${escapeHTML(p.category)}</div>
          <h4><a href="press.html#${escapeAttr(p.slug)}">${escapeHTML(p.title)}</a></h4>
        </div>
      `).join("");
    }

    // News grid (items 5..7)
    const grid = document.querySelector(".news-grid");
    if (grid && press.length > 5) {
      grid.innerHTML = press.slice(5, 8).map((p) => `
        <article class="news-card">
          <a href="press.html#${escapeAttr(p.slug)}" style="color:inherit; text-decoration:none;">
            <div class="thumb"><img src="${escapeAttr(p.img)}" alt="" referrerpolicy="no-referrer" /></div>
            <div class="body">
              <div class="date">${escapeHTML(p.date)} · ${escapeHTML(p.category)}</div>
              <h4>${escapeHTML(p.title)}</h4>
            </div>
          </a>
        </article>
      `).join("");
    }
  }

  function renderLeadership() {
    const L = window.MOD_STORE.leadership();
    if (!L) return;

    const photo = document.querySelector(".leader-photo img");
    if (photo && L.minister && L.minister.photo) {
      photo.setAttribute("src", L.minister.photo);
      photo.setAttribute("alt", `${L.minister.name} — ${L.minister.title}`);
    }
    const nameEl = document.querySelector(".leader-text h2");
    if (nameEl && L.minister && L.minister.name) nameEl.textContent = L.minister.name;

    // Duo cards
    const duo = document.querySelectorAll(".duo .duo-card");
    if (duo && duo.length >= 2 && L.ministerOfState && L.permSec) {
      const mos = duo[0];
      const ps = duo[1];
      const mosImg = mos.querySelector(".photo img");
      const mosName = mos.querySelector("h3");
      if (mosImg && L.ministerOfState.photo) mosImg.setAttribute("src", L.ministerOfState.photo);
      if (mosName && L.ministerOfState.name) mosName.textContent = L.ministerOfState.name;

      const psImg = ps.querySelector(".photo img");
      const psName = ps.querySelector("h3");
      if (psImg && L.permSec.photo) psImg.setAttribute("src", L.permSec.photo);
      if (psName && L.permSec.name) psName.textContent = L.permSec.name;
    }
  }

  function escapeHTML(s) { return String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function escapeAttr(s) { return escapeHTML(s); }

  function renderAll() {
    renderHeroText();
    renderHero();
    renderLeadership();
    renderPress();
  }

  // Run after the static markup is in place
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderAll);
  } else renderAll();

  // Re-render when the admin saves changes
  window.addEventListener("mod-content-updated", renderAll);
})();
