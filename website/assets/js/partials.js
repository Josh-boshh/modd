/* =============================================================================
 * MOD Nigeria — shared partials (header, footer, chatbot, a11y, search)
 * Injected on every page via <div data-include="header"></div> markers.
 * ============================================================================= */
(function () {
  "use strict";

  // Real coat-of-arms (inline copy of /assets/images/coat-of-arms.jpg for SSR-less rendering)
  const COAT = `<img src="assets/images/coat-of-arms.jpg" alt="Coat of Arms of the Federal Republic of Nigeria" width="52" height="52" />`;
  const COAT_FOOTER = `<img src="assets/images/coat-of-arms.jpg" alt="" width="52" height="52" style="filter:brightness(1.15) drop-shadow(0 0 12px rgba(184,146,60,.18));" />`;

  // Real MOD social URLs (from defence.gov.ng footer)
  const FB = "https://www.facebook.com/modinfonigeria";
  const IG = "https://instagram.com/mod_nigeria";
  const TW = "https://twitter.com/MODInfoNg";
  const YT = "https://www.youtube.com/@modnigeria";

  const ICON_FB = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.4c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12Z"/></svg>`;
  const ICON_X  = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h3l-7.5 8.6L22 22h-6l-5-6.6L5 22H2l8-9.2L2 2h6l4.6 6 5.4-6Z"/></svg>`;
  const ICON_IG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-2.8a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>`;
  const ICON_YT = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.4 3.6 12 3.6 12 3.6s-7.4 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.2 0 12 0 12s0 3.8.5 5.8a3 3 0 0 0 2.1 2.1c2 .5 9.4.5 9.4.5s7.4 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8ZM9.6 15.5V8.5l6.3 3.5-6.3 3.5Z"/></svg>`;

  const HEADER_HTML = `
  <a href="#main" class="skip-link">Skip to main content</a>

  <div class="topbar">
    <div class="container">
      <div class="topbar-links">
        <a href="foi.html">FOI</a>
        <a href="servicom.html">SERVICOM</a>
        <a href="contact.html#staff-mail">Staff Mail</a>
        <span class="topbar-meta hide-mobile">Ship House · Area 10, Abuja</span>
      </div>
      <div class="topbar-tools">
        <span class="lang-select-wrap" data-i18n-skip>
          <select class="lang-select" aria-label="Site language">
            <option value="en">English</option>
          </select>
          <span class="lang-status" aria-live="polite"></span>
        </span>
        <span class="social hide-mobile" aria-label="Official social media">
          <a href="${FB}" target="_blank" rel="noopener" aria-label="Facebook">${ICON_FB}</a>
          <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram">${ICON_IG}</a>
          <a href="${TW}" target="_blank" rel="noopener" aria-label="X / Twitter">${ICON_X}</a>
          <a href="${YT}" target="_blank" rel="noopener" aria-label="YouTube">${ICON_YT}</a>
        </span>
      </div>
    </div>
  </div>

  <nav class="navbar" aria-label="Primary">
    <div class="container nav-inner">
      <a href="index.html" class="brand" aria-label="Federal Ministry of Defence — Home">
        <span class="brand-logo">${COAT}</span>
        <span class="brand-text">
          <span class="ministry" data-i18n>Federal Ministry of Defence</span>
          <span class="country" data-i18n>Federal Republic of Nigeria</span>
        </span>
      </a>
      <button class="mobile-toggle" aria-label="Open menu" aria-expanded="false">
        <span class="mobile-toggle-label">Menu</span>
        <span class="mobile-toggle-icon" aria-hidden="true">☰</span>
      </button>
      <ul class="menu" role="menubar">
        <li><a href="index.html" data-i18n>Home</a></li>
        <li><a href="about.html">The Ministry
          <ul class="submenu">
            <li><a href="about.html" data-i18n>About Us</a></li>
            <li><a href="structure.html" data-i18n>Our Structure</a></li>
            <li><a href="minister.html" data-i18n>Honourable Minister</a></li>
            <li><a href="minister-of-state.html" data-i18n>Minister of State</a></li>
            <li><a href="management.html" data-i18n>Management</a></li>
          </ul>
        </a></li>
        <li><a href="military.html">Components of MOD
          <ul class="submenu submenu-wide">
            <li class="submenu-group"><span class="group-label">Military Component</span>
              <a href="military.html#dhq" data-i18n>Defence Headquarters</a>
              <a href="military.html#army" data-i18n>Nigerian Army</a>
              <a href="military.html#navy" data-i18n>Nigerian Navy</a>
              <a href="military.html#airforce" data-i18n>Nigerian Air Force</a>
            </li>
            <li class="submenu-group"><span class="group-label">Civilian Components</span>
              <a href="department.html?d=joint-services" data-i18n>Joint Services</a>
              <a href="department.html?d=human-resources" data-i18n>Human Resources</a>
              <a href="department.html?d=prs" data-i18n>Planning, Research & Statistics</a>
              <a href="department.html?d=army-affairs" data-i18n>Army Affairs</a>
              <a href="department.html?d=navy-affairs" data-i18n>Navy Affairs</a>
              <a href="department.html?d=air-force-affairs" data-i18n>Air Force Affairs</a>
              <a href="department.html?d=finance-accounts" data-i18n>Finance & Accounts</a>
              <a href="department.html?d=procurement-dept" data-i18n>Procurement</a>
              <a href="department.html?d=legal" data-i18n>Legal</a>
            </li>
            <li class="submenu-group"><span class="group-label">Civilian Component II</span>
              <a href="department.html?d=health-services" data-i18n>Health Services</a>
              <a href="department.html?d=general-services" data-i18n>General Services</a>
              <a href="department.html?d=public-relations" data-i18n>Info & Public Relations</a>
              <a href="department.html?d=education-services" data-i18n>Education Services</a>
              <a href="department.html?d=permanent-secretary" data-i18n>Office of the Permanent Secretary</a>
              <a href="department.html?d=internal-audit" data-i18n>Internal Audit</a>
              <a href="department.html?d=reform-coordination" data-i18n>Reform Coordination & Service Improvement</a>
            </li>
            <li class="submenu-group"><span class="group-label">Others</span>
              <a href="agencies.html#nda" data-i18n>NDA</a>
              <a href="agencies.html#ndc" data-i18n>NDC</a>
              <a href="agencies.html#afcsc" data-i18n>AFCSC</a>
              <a href="agencies.html#dicon" data-i18n>DICON</a>
              <a href="agencies.html#nafrc" data-i18n>NAFRC</a>
              <a href="agencies.html#mpb" data-i18n>MPB</a>
              <a href="agencies.html#dia" data-i18n>DIA</a>
            </li>
          </ul>
        </a></li>
        <li><a href="press.html">News & Media
          <ul class="submenu">
            <li><a href="press.html" data-i18n>Press Releases</a></li>
            <li><a href="press.html#speeches" data-i18n>Speeches</a></li>
            <li><a href="press.html#communiques" data-i18n>Communiques</a></li>
            <li><a href="gallery.html" data-i18n>Gallery</a></li>
          </ul>
        </a></li>
        <li><a href="services.html">Services
          <ul class="submenu">
            <li><a href="services.html#recruitment" data-i18n>Recruitment</a></li>
            <li><a href="services.html#charter" data-i18n>Service Charter</a></li>
            <li><a href="services.html#downloads" data-i18n>Downloads</a></li>
            <li><a href="veterans.html" data-i18n>Veterans</a></li>
            <li><a href="procurement.html" data-i18n>Procurement</a></li>
            <li><a href="foi.html" data-i18n>Freedom of Information</a></li>
          </ul>
        </a></li>
        <li><a href="contact.html" data-i18n>Contact</a></li>
        <li>
          <button class="search-toggle" aria-label="Search the site" data-search-toggle>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </button>
        </li>
      </ul>
      <img src="assets/images/mod-logo.png" class="nav-mod-logo" alt="Federal Ministry of Defence logo" />
    </div>
  </nav>

  <div class="search-modal" id="searchModal" role="dialog" aria-modal="true" aria-label="Site search">
    <div class="inner">
      <form action="search.html" method="get">
        <input type="search" name="q" placeholder="Search press releases, departments, services…" autocomplete="off" autofocus />
      </form>
      <div class="hint">Press <strong>Enter</strong> to search · <strong>Esc</strong> to close</div>
    </div>
  </div>
  `;

  const FOOTER_HTML = `
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div>
          <div class="footer-brand">
            <span>${COAT_FOOTER}</span>
            <div>
              <div class="name" data-i18n>Federal Ministry of Defence</div>
              <div class="country" data-i18n>Federal Republic of Nigeria</div>
            </div>
          </div>
          <p>Ship House, Central Business District, Area 10, Federal Capital Territory, Abuja, Nigeria.</p>
          <p style="margin-top:8px;">
            <a href="mailto:contact@defence.gov.ng" style="color:rgba(255,255,255,.85);">contact@defence.gov.ng</a><br>
            +234 9 234 5670
          </p>
          <div class="footer-social" aria-label="Official social media">
            <a href="${FB}" target="_blank" rel="noopener" aria-label="Facebook">${ICON_FB}</a>
            <a href="${IG}" target="_blank" rel="noopener" aria-label="Instagram">${ICON_IG}</a>
            <a href="${TW}" target="_blank" rel="noopener" aria-label="X / Twitter">${ICON_X}</a>
            <a href="${YT}" target="_blank" rel="noopener" aria-label="YouTube">${ICON_YT}</a>
          </div>
        </div>
        <div>
          <h4 data-i18n>The Ministry</h4>
          <ul>
            <li><a href="about.html" data-i18n>About Us</a></li>
            <li><a href="minister.html" data-i18n>Honourable Minister</a></li>
            <li><a href="minister-of-state.html" data-i18n>Minister of State</a></li>
            <li><a href="management.html" data-i18n>Management</a></li>
            <li><a href="structure.html" data-i18n>Our Structure</a></li>
            <li><a href="departments.html" data-i18n>Departments</a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n>Services</h4>
          <ul>
            <li><a href="services.html#recruitment" data-i18n>Recruitment</a></li>
            <li><a href="services.html#charter" data-i18n>Service Charter</a></li>
            <li><a href="veterans.html" data-i18n>Veterans</a></li>
            <li><a href="procurement.html" data-i18n>Procurement</a></li>
            <li><a href="foi.html" data-i18n>Freedom of Information</a></li>
            <li><a href="servicom.html" data-i18n>SERVICOM</a></li>
          </ul>
        </div>
        <div>
          <h4 data-i18n>Useful Links</h4>
          <ul>
            <li><a href="https://nigeria.gov.ng" target="_blank" rel="noopener">Nigeria Government</a></li>
            <li><a href="https://defencehq.mil.ng" target="_blank" rel="noopener">Defence Headquarters</a></li>
            <li><a href="https://army.mil.ng" target="_blank" rel="noopener">Nigerian Army</a></li>
            <li><a href="https://navy.mil.ng" target="_blank" rel="noopener">Nigerian Navy</a></li>
            <li><a href="https://airforce.mil.ng" target="_blank" rel="noopener">Nigerian Air Force</a></li>
            <li><a href="https://interior.gov.ng" target="_blank" rel="noopener">Ministry of Interior</a></li>
          </ul>
          <h4 style="margin-top:28px;" data-i18n>Newsletter</h4>
          <p style="margin-bottom:8px;font-size:.82rem;">Receive press releases & updates.</p>
          <form class="newsletter-wrap" onsubmit="event.preventDefault(); alert('Thank you. Your subscription has been received.'); this.reset();">
            <input type="email" placeholder="your.email@example.com" required aria-label="Email address" />
            <button type="submit" data-i18n>Subscribe</button>
          </form>
        </div>
      </div>

      <div class="footer-bottom">
        <div>&copy; <span data-current-year>2026</span> Federal Ministry of Defence · All rights reserved.</div>
        <div class="legal">
          <a href="accessibility.html" data-i18n>Accessibility</a>
          <a href="foi.html" data-i18n>FOI</a>
          <a href="servicom.html">SERVICOM</a>
          <a href="sitemap.html" data-i18n>Sitemap</a>
          <a href="contact.html" data-i18n>Contact</a>
          <a href="admin/index.html" title="Staff content management">Admin</a>
        </div>
      </div>
    </div>
  </footer>
  `;

  const CHATBOT_HTML = `
  <button class="chatbot-launcher" aria-label="Open MOD assistant" data-chatbot-toggle>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  </button>
  <div class="chatbot-panel" id="chatbotPanel" role="dialog" aria-label="MOD virtual assistant">
    <div class="chatbot-header">
      <div>
        <div class="title">MOD Assistant</div>
        <div class="sub">Ask about services, departments, recruitment</div>
      </div>
      <button aria-label="Close" data-chatbot-toggle>&times;</button>
    </div>
    <div class="chatbot-body" id="chatbotBody">
      <div class="chatbot-msg bot">Hello — I can help you find information about recruitment, the FOI process, contact details, or any of our departments. What would you like to know?</div>
    </div>
    <form class="chatbot-input" data-chatbot-form>
      <input type="text" placeholder="Type a question…" aria-label="Your message" required />
      <button type="submit">Send</button>
    </form>
  </div>
  `;

  const A11Y_HTML = `
  <button class="a11y-fab" aria-label="Accessibility options" data-a11y-toggle>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><path d="M12 7v8M9 22l3-7 3 7M5 11h14"/></svg>
  </button>
  <div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="Accessibility options">
    <h4>Accessibility</h4>
    <button data-a11y="font-default">Default text size</button>
    <button data-a11y="font-large">Larger text</button>
    <button data-a11y="font-xlarge">Largest text</button>
    <button data-a11y="contrast">High-contrast mode</button>
    <button data-a11y="reset">Reset all</button>
  </div>
  `;

  function include(selector, html) {
    document.querySelectorAll(`[data-include="${selector}"]`).forEach((el) => {
      el.outerHTML = html;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    include("header", HEADER_HTML);
    include("footer", FOOTER_HTML);
    include("chatbot", CHATBOT_HTML);
    include("a11y", A11Y_HTML);

    // Stamp current year
    document.querySelectorAll("[data-current-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    // Mark active nav item
    const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".menu a").forEach((a) => {
      const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href === path) a.parentElement.classList.add("active");
    });

    // Search modal
    const sm = document.getElementById("searchModal");
    document.querySelectorAll("[data-search-toggle]").forEach((b) =>
      b.addEventListener("click", () => sm && sm.classList.add("open"))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && sm) sm.classList.remove("open");
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); sm && sm.classList.add("open"); }
    });
    sm && sm.addEventListener("click", (e) => { if (e.target === sm) sm.classList.remove("open"); });
  });
})();
