/* =============================================================================
 *  MOD Admin — content manager
 *  Single-file SPA. Reads/writes via MOD_STORE and uses backend authentication.
 * ============================================================================= */
(function () {
  "use strict";

  function boot() {
    const dash = document.getElementById("dashboard");
    if (!dash) {
      console.warn("[admin] dashboard not found");
      return;
    }

    initNav();
    bindBackup();
    renderAll();

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        window.location.href = "logout.php";
      });
    }

    document.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", closeModal));
    const modal = document.getElementById("adminModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target.id === "adminModal") closeModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });
  }

  document.addEventListener("DOMContentLoaded", boot);

  function initNav() {
    document.querySelectorAll(".admin-nav-btn").forEach((b) => {
      b.addEventListener("click", () => switchTo(b.dataset.section));
    });
    document.querySelectorAll("[data-jump]").forEach((b) => {
      b.addEventListener("click", () => switchTo(b.dataset.jump));
    });
  }

  function switchTo(name) {
    document.querySelectorAll(".admin-nav-btn").forEach((b) => b.classList.toggle("active", b.dataset.section === name));
    document.querySelectorAll(".admin-section").forEach((s) => s.classList.toggle("active", s.dataset.panel === name));
    renderAll();
  }

  function renderAll() {
    renderStats();
    renderHeroEditor();
    renderSlides();
    renderPress();
    renderLeadershipEditors();
    renderSubscribers();
    renderSettings();
    bindBackup();
  }

  function renderStats() {
    const c = window.MOD_STORE.get();
    setText("statPress", c.press.length);
    setText("statSlides", c.slides.length);
    setText("statSubs", window.MOD_STORE.subscribers().length);
    setText("statLastReviewed", c.settings.lastReviewed || "—");
  }

  function renderHeroEditor() {
    const h = window.MOD_STORE.hero();
    val("heroEyebrow", h.eyebrow);
    val("heroHeadline", h.headline);
    val("heroBody", h.body);
    once("saveHeroText", "click", function () {
      window.MOD_STORE.update("hero", {
        eyebrow: getVal("heroEyebrow"),
        headline: getVal("heroHeadline"),
        body: getVal("heroBody"),
      });
      flash("heroTextStatus", "Saved ✓");
      toast("Hero text saved", "success");
    });
  }

  function renderSlides() {
    const list = document.getElementById("slidesList");
    const slides = window.MOD_STORE.slides();
    if (!slides.length) {
      list.innerHTML = `<div class="empty">No slides yet. Click "+ Add slide" above.</div>`;
    } else {
      list.innerHTML = slides.map((s, i) => itemCard({
        thumb: s.img,
        meta: s.role || `Slide ${i + 1}`,
        title: s.name || s.alt || "(untitled)",
        idx: i,
      })).join("");
    }
    list.onclick = function (e) {
      const btn = e.target.closest("button"); if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      if (btn.classList.contains("up")) moveItem("slides", idx, -1);
      else if (btn.classList.contains("dn")) moveItem("slides", idx, +1);
      else if (btn.classList.contains("edit")) editSlide(idx);
      else if (btn.classList.contains("del")) confirmDelete("slides", idx);
    };
    once("addSlide", "click", () => editSlide(-1));
  }

  function editSlide(idx) {
    const slides = window.MOD_STORE.slides();
    const s = idx >= 0 ? slides[idx] : { img: "", role: "", name: "", alt: "" };
    openModal(idx >= 0 ? "Edit slide" : "New slide", `
      <div class="form-row"><label>Image URL</label><input type="text" id="mImg" value="${esc(s.img)}" placeholder="https://..." /></div>
      <div class="form-row"><label>Caption role (top line)</label><input type="text" id="mRole" value="${esc(s.role)}" placeholder="e.g. Honourable Minister" /></div>
      <div class="form-row"><label>Caption name (main line)</label><input type="text" id="mName" value="${esc(s.name)}" placeholder="e.g. General Christopher Gwabin Musa" /></div>
      <div class="form-row"><label>Alt text (accessibility)</label><input type="text" id="mAlt" value="${esc(s.alt)}" placeholder="Short description of the photo" /></div>
      <div class="form-row"><label>Preview</label><div class="photo-preview" id="mPreview" style="width:100%; height:200px; background-image:url('${esc(s.img)}');"></div></div>
    `, function () {
      const updated = {
        img: getVal("mImg"),
        role: getVal("mRole"),
        name: getVal("mName"),
        alt: getVal("mAlt"),
      };
      const all = window.MOD_STORE.slides();
      if (idx >= 0) all[idx] = updated; else all.push(updated);
      window.MOD_STORE.update("slides", all);
      renderSlides(); renderStats();
      toast(idx >= 0 ? "Slide updated" : "Slide added", "success");
    });
    setTimeout(() => {
      const i = document.getElementById("mImg");
      const p = document.getElementById("mPreview");
      i.addEventListener("input", () => p.style.backgroundImage = `url('${i.value}')`);
    }, 50);
  }

  function renderPress() {
    const list = document.getElementById("pressList");
    const press = window.MOD_STORE.press();
    if (!press.length) {
      list.innerHTML = `<div class="empty">No press releases yet. Click "+ New press release".</div>`;
    } else {
      list.innerHTML = press.map((p, i) => itemCard({
        thumb: p.img, meta: p.date + " · " + p.category, title: p.title, idx: i,
      })).join("");
    }
    list.onclick = function (e) {
      const btn = e.target.closest("button"); if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      if (btn.classList.contains("up")) moveItem("press", idx, -1);
      else if (btn.classList.contains("dn")) moveItem("press", idx, +1);
      else if (btn.classList.contains("edit")) editPress(idx);
      else if (btn.classList.contains("del")) confirmDelete("press", idx);
    };
    once("addPress", "click", () => editPress(-1));
  }

  function editPress(idx) {
    const press = window.MOD_STORE.press();
    const p = idx >= 0 ? press[idx] : { slug: "", date: "", category: "Press Office", title: "", excerpt: "", img: "", url: "" };
    openModal(idx >= 0 ? "Edit press release" : "New press release", `
      <div class="form-grid">
        <div class="form-row"><label>Title</label><input type="text" id="mTitle" value="${esc(p.title)}" /></div>
        <div class="form-row"><label>Date</label><input type="date" id="mDate" value="${esc(p.date)}" /></div>
        <div class="form-row"><label>Category</label><input type="text" id="mCategory" value="${esc(p.category)}" /></div>
        <div class="form-row full"><label>Excerpt</label><textarea id="mExcerpt" rows="3">${esc(p.excerpt)}</textarea></div>
        <div class="form-row full"><label>Image URL</label><input type="text" id="mImg" value="${esc(p.img)}" /></div>
        <div class="form-row full"><label>External URL</label><input type="text" id="mUrl" value="${esc(p.url)}" /></div>
        <div class="form-row full"><label>Slug</label><input type="text" id="mSlug" value="${esc(p.slug)}" /></div>
      </div>
    `, function () {
      const updated = {
        slug: getVal("mSlug"),
        date: getVal("mDate"),
        category: getVal("mCategory"),
        title: getVal("mTitle"),
        excerpt: getVal("mExcerpt"),
        img: getVal("mImg"),
        url: getVal("mUrl"),
      };
      const all = window.MOD_STORE.press();
      if (idx >= 0) all[idx] = updated; else all.push(updated);
      window.MOD_STORE.update("press", all);
      renderPress(); renderStats();
      toast(idx >= 0 ? "Press release updated" : "Press release added", "success");
    });
  }

  function renderLeadershipEditors() {
    const L = window.MOD_STORE.leadership();
    val("ministerName", L.minister.name);
    val("ministerTitle", L.minister.title);
    val("ministerPhoto", L.minister.photo);
    setPreview("ministerPreview", L.minister.photo);
    val("mosName", L.ministerOfState.name);
    val("mosTitle", L.ministerOfState.title);
    val("mosPhoto", L.ministerOfState.photo);
    setPreview("mosPreview", L.ministerOfState.photo);
    val("psName", L.permSec.name);
    val("psTitle", L.permSec.title);
    val("psPhoto", L.permSec.photo);
    setPreview("psPreview", L.permSec.photo);
    once("saveMinister", "click", function () {
      window.MOD_STORE.update("leadership.minister", {
        name: getVal("ministerName"),
        title: getVal("ministerTitle"),
        photo: getVal("ministerPhoto"),
      });
      renderStats();
      toast("Minister saved", "success");
    });
    once("saveMos", "click", function () {
      window.MOD_STORE.update("leadership.ministerOfState", {
        name: getVal("mosName"),
        title: getVal("mosTitle"),
        photo: getVal("mosPhoto"),
      });
      renderStats();
      toast("Minister of State saved", "success");
    });
    once("savePs", "click", function () {
      window.MOD_STORE.update("leadership.permSec", {
        name: getVal("psName"),
        title: getVal("psTitle"),
        photo: getVal("psPhoto"),
      });
      renderStats();
      toast("Permanent Secretary saved", "success");
    });
    bindLive("ministerPhoto", "ministerPreview");
    bindLive("mosPhoto", "mosPreview");
    bindLive("psPhoto", "psPreview");
  }

  function bindLive(inputId, previewId) {
    const i = document.getElementById(inputId);
    const p = document.getElementById(previewId);
    if (!i || !p) return;
    if (i.__bound) return; i.__bound = true;
    i.addEventListener("input", () => setPreview(previewId, i.value));
  }

  function setPreview(id, url) {
    const el = document.getElementById(id);
    if (el && url) el.style.backgroundImage = `url('${url}')`;
  }

  function renderSubscribers() {
    const list = document.getElementById("subsList");
    const subs = window.MOD_STORE.subscribers();
    if (!subs.length) {
      list.innerHTML = `<div class="empty">No subscribers yet. Sign-ups from the public footer form appear here.</div>`;
    } else {
      list.innerHTML = subs.map((s, i) => `
        <div class="item-card subs">
          <div class="body">
            <div class="meta">Subscriber</div>
            <div class="title">${esc(s.email)}</div>
          </div>
          <div style="font-size:.78rem; color:var(--ink-3);">${new Date(s.when).toLocaleDateString()}</div>
          <div class="actions"><button class="del" data-idx="${i}" title="Remove">🗑</button></div>
        </div>
      `).join("");
    }
    list.onclick = function (e) {
      const btn = e.target.closest("button.del"); if (!btn) return;
      const idx = parseInt(btn.dataset.idx, 10);
      const subs = window.MOD_STORE.subscribers();
      const email = subs[idx].email;
      if (confirm(`Remove subscriber: ${email}?`)) {
        window.MOD_STORE.removeSubscriber(email);
        renderSubscribers(); renderStats();
        toast("Subscriber removed", "success");
      }
    };
    once("exportSubs", "click", function () {
      const csv = window.MOD_STORE.exportSubscribers();
      download(csv, "mod-subscribers-" + new Date().toISOString().slice(0, 10) + ".csv", "text/csv");
    });
    once("addSub", "click", function () {
      const email = prompt("Email address to add:");
      if (email) {
        const ok = window.MOD_STORE.addSubscriber(email.trim());
        renderSubscribers(); renderStats();
        toast(ok ? "Subscriber added" : "Already subscribed", ok ? "success" : "error");
      }
    });
  }

  function renderSettings() {
    const s = window.MOD_STORE.settings();
    val("setName", s.ministryName);
    val("setCountry", s.country);
    val("setReviewed", s.lastReviewed);
    once("saveSettings", "click", function () {
      window.MOD_STORE.update("settings", {
        ministryName: getVal("setName"),
        country: getVal("setCountry"),
        lastReviewed: getVal("setReviewed"),
      });
      renderStats();
      toast("Site settings saved", "success");
    });
  }

  function bindBackup() {
    once("exportContent", "click", function () {
      const json = window.MOD_STORE.export();
      download(json, "mod-content-" + new Date().toISOString().slice(0, 10) + ".json", "application/json");
    });
    once("copyContent", "click", async function () {
      try { await navigator.clipboard.writeText(window.MOD_STORE.export()); toast("Copied to clipboard", "success"); }
      catch { toast("Copy failed — use Download instead", "error"); }
    });
    once("importContent", "click", function () {
      const raw = getVal("importJson").trim();
      if (!raw) { toast("Paste JSON first", "error"); return; }
      if (!confirm("Replace ALL current content with this JSON? This overwrites everything.")) return;
      if (window.MOD_STORE.import(raw)) {
        renderAll();
        toast("Content imported", "success");
      } else toast("Invalid JSON", "error");
    });
    once("importFile", "change", function (e) {
      const f = e.target.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = function () {
        document.getElementById("importJson").value = r.result;
        toast("File loaded — click 'Import & overwrite'", "success");
      };
      r.readAsText(f);
    });
    once("resetContent", "click", function () {
      if (!confirm("Delete ALL edits and revert to defaults? This cannot be undone.")) return;
      window.MOD_STORE.reset();
      renderAll();
      toast("Content reset to defaults", "success");
    });
  }

  function itemCard(o) {
    return `
      <div class="item-card">
        <div class="thumb" style="${o.thumb ? `background-image:url('${esc(o.thumb)}')` : ''}"></div>
        <div class="body">
          <div class="meta">${esc(o.meta)}</div>
          <div class="title">${esc(o.title)}</div>
        </div>
        <div class="actions">
          <button class="up"   data-idx="${o.idx}" title="Move up">↑</button>
          <button class="dn"   data-idx="${o.idx}" title="Move down">↓</button>
          <button class="edit" data-idx="${o.idx}" title="Edit">✎</button>
          <button class="del"  data-idx="${o.idx}" title="Delete">🗑</button>
        </div>
      </div>`;
  }

  function moveItem(field, idx, dir) {
    const arr = window.MOD_STORE[field === "slides" ? "slides" : "press"]();
    const j = idx + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[idx], arr[j]] = [arr[j], arr[idx]];
    window.MOD_STORE.update(field, arr);
    if (field === "slides") renderSlides(); else renderPress();
    renderStats();
  }

  function confirmDelete(field, idx) {
    const arr = window.MOD_STORE[field === "slides" ? "slides" : "press"]();
    const label = field === "slides" ? "slide" : "press release";
    if (!confirm(`Delete this ${label}? This cannot be undone.`)) return;
    arr.splice(idx, 1);
    window.MOD_STORE.update(field, arr);
    if (field === "slides") renderSlides(); else renderPress();
    renderStats();
    toast(`${label[0].toUpperCase() + label.slice(1)} deleted`, "success");
  }

  let __modalSave = null;
  function openModal(title, bodyHTML, onSave) {
    document.getElementById("modalTitle").textContent = title;
    document.getElementById("modalBody").innerHTML = bodyHTML;
    document.getElementById("adminModal").hidden = false;
    __modalSave = onSave;
    once("modalSave", "click", function () {
      if (__modalSave) __modalSave();
      closeModal();
    });
  }

  function closeModal() {
    document.getElementById("adminModal").hidden = true;
    __modalSave = null;
  }

  function val(id, v)      { const el = document.getElementById(id); if (el) el.value = v == null ? "" : v; }
  function getVal(id)      { const el = document.getElementById(id); return el ? el.value : ""; }
  function setText(id, v)  { const el = document.getElementById(id); if (el) el.textContent = v == null ? "" : v; }
  function flash(id, m)    { const el = document.getElementById(id); if (!el) return; el.textContent = m; setTimeout(() => el.textContent = "", 2000); }

  function once(id, evt, fn) {
    const el = document.getElementById(id); if (!el) return;
    if (!el.__handlers) el.__handlers = {};
    if (el.__handlers[evt]) el.removeEventListener(evt, el.__handlers[evt]);
    el.__handlers[evt] = fn;
    el.addEventListener(evt, fn);
  }

  function toast(msg, type) {
    const el = document.getElementById("adminToast");
    el.textContent = msg;
    el.className = "admin-toast show " + (type || "");
    setTimeout(() => el.className = "admin-toast", 2400);
  }

  function download(content, filename, mime) {
    const blob = new Blob([content], { type: mime || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
})();
