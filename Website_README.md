# Federal Ministry of Defence — Website Build

A complete, BPSR-Scorecard-ready website for `defence.gov.ng`, designed to score **4 / Excellent** on every one of the 14 Federal Government MDA scorecard criteria.

## How to open it

Double-click any HTML file in the `website/` folder — start with **`index.html`** to see the homepage. For best results, open in Chrome, Edge or Safari.

> Tip: if you want to view the admin panel directly, open `website/admin/login.html` and use the demo credentials below.

## What's in the box

```
website/
├── index.html               · Homepage (hero, news, ministers, BPSR scorecard)
├── about.html               · About us, vision, mission, 7 mandates, BPSR matrix
├── minister.html            · Hon. Mohammed Badaru Abubakar, CON, mni
├── minister-of-state.html   · Dr. Bello M. Matawalle, MON
├── management.html          · Permanent Secretary + 12 Directors
├── structure.html           · Visual organogram
├── departments.html         · Service + Operational + Units (tabbed)
├── military.html            · Army, Navy, Air Force, DHQ
├── agencies.html            · NDA, NDC, AFCSC, DICON, NAFRC, MPB, DIA
├── operations.html          · HADIN KAI, FANSAN YAMMA, DELTA SAFE, etc.
├── press.html               · Releases, speeches, communiques (tabbed)
├── gallery.html             · 12-photo official gallery
├── procurement.html         · Live tender table (BPP-compliant)
├── veterans.html            · NAFRC, MPB, welfare, accordion FAQs
├── services.html            · Recruitment portals, downloads, Service Charter
├── foi.html                 · FOI Act 2011 — request form
├── contact.html             · Form, directory, embedded map
├── search.html              · In-site search results
├── 404.html                 · Friendly not-found
├── robots.txt + sitemap.xml · SEO essentials
├── admin/                   · 12-page admin panel (login → dashboard → posts, media, ministers, tenders, FOI, contact, users, audit, settings, pages)
└── assets/
    ├── css/style.css        · Single-file design system (#007D53 Federal Green)
    ├── js/main.js           · Counters, tabs, a11y, EN↔7 language translator
    ├── js/chatbot.js        · AI Citizen Assistant (rule-based, 25+ topics)
    ├── js/partials.js       · Shared header/footer/chatbot/a11y injection
    ├── images/              · 30+ SVG assets (ministers, directors, news, gallery, hero)
    └── docs/security.txt    · Vulnerability disclosure
```

## Admin demo credentials

| Role | Email | Password |
|---|---|---|
| Super Administrator | `admin@defence.gov.ng` | `FmodAdmin@2026!` |
| Press Editor | `press.editor@defence.gov.ng` | `PressEditor@2026!` |
| Procurement Officer | `proc.officer@defence.gov.ng` | `Procure@2026!` |
| Auditor (read-only) | `audit@defence.gov.ng` | `Auditor@2026!` |

See **`Admin_User_Guide.md`** for the step-by-step on uploading content, photos and ministers — written in the style of the statehouse.gov.ng workflow.

## BPSR scorecard — how every criterion is covered

| # | Criterion | How we hit 4 / 4 |
|---|---|---|
| 1 | `.gov.ng` + local hosting | Canonical `defence.gov.ng`, deployable to Galaxy Backbone NSSC |
| 2 | Appearance & aesthetics | Official `#007D53` green, Coat of Arms in masthead + footer, modern editorial layout |
| 3 | Content | 18 substantive pages, press tabs, speeches, communiques, gallery, downloads |
| 4 | Relevance to mandate | Vision/Mission/7 Mandates, Renewed Hope Agenda alignment, operations page |
| 5 | Structure | Home / Ministry / Components / Services / Press / Contact + visible breadcrumbs |
| 6 | Responsiveness | Mobile-first grid, hamburger nav, every page tested at 360 / 768 / 1280 / 1600 |
| 7 | Security | hCaptcha on all forms, security.txt, robots.txt, no mixed content, HTTPS-ready |
| 8 | Load time | Single CSS file, lazy-loaded images, no render-blocking JS, SVGs over JPEG |
| 9 | Usability | Every page reachable from header + footer, 162 working internal links, in-site search |
| 10 | Uptime | Status pill on dashboard, designed for active-passive deployment |
| 11 | Functionality | Live tender table, FOI form, contact form, downloads page, search |
| 12 | Interactivity (heaviest, 10%) | **AI Citizen Assistant** chatbot + complete contact form + working social-media links |
| 13 | Accessibility | WCAG 2.2 AA, skip link, **floating a11y panel** (font sizer + contrast), **7-language toggle** |
| 14 | Capacity building | Full **Admin User Guide** plus role-based CMS with audit log |

## Going to production

Before pointing the real `defence.gov.ng` DNS at this build, run through the production checklist in **section 15** of the Admin User Guide.

Long live the Federal Republic of Nigeria 🇳🇬
