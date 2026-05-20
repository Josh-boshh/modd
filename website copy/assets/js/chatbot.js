/* =============================================================================
 *  FEDERAL MINISTRY OF DEFENCE — virtual assistant
 *  Rule-based FAQ chatbot (no API required). Routes to the right page.
 * ============================================================================= */
(function () {
  "use strict";

  const FAQ = [
    { q: ["recruit", "enlist", "join", "career"],
      a: "Recruitment is conducted by each Service: <a href='https://recruitment.army.mil.ng' target='_blank'>Nigerian Army</a>, <a href='https://navy.mil.ng' target='_blank'>Nigerian Navy</a>, <a href='https://airforce.mil.ng' target='_blank'>Nigerian Air Force</a>. Civilian openings at MOD are published on the <a href='services.html#recruitment'>Recruitment page</a>." },
    { q: ["foi", "freedom of information", "request"],
      a: "Submit an FOI request through the <a href='foi.html'>FOI page</a>. Responses are issued within 7 working days as required by the FOI Act, 2011." },
    { q: ["contact", "address", "phone", "email"],
      a: "Ministry of Defence, Ship House, Area 10, Abuja. Email <a href='mailto:contact@defence.gov.ng'>contact@defence.gov.ng</a> or call +234 9 234 5670. Full details on the <a href='contact.html'>Contact page</a>." },
    { q: ["minister", "musa", "honourable"],
      a: "The Honourable Minister of Defence is General Christopher Gwabin Musa (rtd), OFR. See the <a href='minister.html'>Minister's profile</a>." },
    { q: ["permanent secretary", "perm sec"],
      a: "Find the Permanent Secretary and the full Management team on the <a href='management.html'>Management page</a>." },
    { q: ["service charter", "charter", "servicom"],
      a: "Our Service Charter sets the standards you should expect when dealing with the Ministry. Read it on the <a href='services.html#charter'>Service Charter page</a>." },
    { q: ["procurement", "tender", "bid"],
      a: "All open tenders and contract awards are published on the <a href='procurement.html'>Procurement page</a>, in line with the Public Procurement Act 2007." },
    { q: ["veteran", "pension", "nafrc"],
      a: "Veterans services and pensions are administered through the <a href='veterans.html'>Veterans page</a> and the Military Pensions Board." },
    { q: ["news", "press", "release"],
      a: "Read the latest from the Press Office on the <a href='press.html'>Press Releases page</a>." },
    { q: ["gallery", "photo", "picture"],
      a: "Browse official photos from Ministry events in the <a href='gallery.html'>Gallery</a>." },
    { q: ["agency", "dicon", "nda", "afcsc", "ndc", "dia"],
      a: "Tri-service institutions and agencies are listed on the <a href='agencies.html'>Agencies page</a> — NDA, NDC, AFCSC, DICON, NAFRC, MPB, DIA." },
    { q: ["operation", "joint", "hadin"],
      a: "Active joint operations and theatres are summarised on the <a href='operations.html'>Operations page</a>." },
    { q: ["accessibility", "screen reader", "contrast"],
      a: "The accessibility panel (bottom-left ⚙ icon) provides high-contrast mode and text-size controls. Full WCAG-aligned details on the <a href='accessibility.html'>Accessibility page</a>." },
  ];

  function answer(text) {
    const t = text.toLowerCase();
    for (const f of FAQ) if (f.q.some((k) => t.includes(k))) return f.a;
    return "I don't have an immediate answer for that. Try the <a href='search.html?q=" + encodeURIComponent(text) + "'>site search</a>, or email <a href='mailto:contact@defence.gov.ng'>contact@defence.gov.ng</a>.";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Wait for partials to inject the chatbot panel
    setTimeout(() => {
      const panel = document.getElementById("chatbotPanel");
      if (!panel) return;
      document.querySelectorAll("[data-chatbot-toggle]").forEach((b) =>
        b.addEventListener("click", () => panel.classList.toggle("open"))
      );
      const form = document.querySelector("[data-chatbot-form]");
      const body = document.getElementById("chatbotBody");
      if (form && body) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          const input = form.querySelector("input");
          const q = (input.value || "").trim();
          if (!q) return;
          // user message
          const u = document.createElement("div");
          u.className = "chatbot-msg user";
          u.textContent = q;
          body.appendChild(u);
          // bot reply
          const a = document.createElement("div");
          a.className = "chatbot-msg bot";
          a.innerHTML = answer(q);
          body.appendChild(a);
          input.value = "";
          body.scrollTop = body.scrollHeight;
        });
      }
    }, 100);
  });
})();
