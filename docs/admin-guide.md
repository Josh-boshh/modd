# Federal Ministry of Defence — Website Administrator Guide

**Version 3.0 · For internal use by authorised MOD personnel**

This document tells you how to sign in to the FMOD Admin Portal, publish news, upload images, update Minister & Director profiles, and manage tenders, FOI requests and accessibility settings — exactly the way the State House team does on statehouse.gov.ng.

---

## 1. Demo Login Credentials

The portal ships with four pre-configured demo accounts so each role can be exercised end-to-end. **Rotate these passwords on day one of production.**

| Role | Email | Password | What they can do |
|---|---|---|---|
| **Super Administrator** | `admin@defence.gov.ng` | `FmodAdmin@2026!` | Everything — settings, users, audit log |
| **Press Editor** | `press.editor@defence.gov.ng` | `PressEditor@2026!` | News, speeches, gallery, ministers |
| **Procurement Officer** | `proc.officer@defence.gov.ng` | `Procure@2026!` | Tenders, EOIs, award notices |
| **Auditor (Read-only)** | `audit@defence.gov.ng` | `Auditor@2026!` | Audit log only |

> Demo notice: The admin portal is rendered client-side for evaluation. For production, wire the same UI to your CMS API (we recommend Strapi or WordPress headless + JWT auth) hosted inside Galaxy Backbone NSSC.

---

## 2. Signing in

1. From any page on the public site, click **Staff Login** in the top-right of the green ribbon.
2. You will be taken to `/admin/login.html`.
3. Enter your `@defence.gov.ng` email (or staff ID) and password.
4. Tick the hCaptcha confirmation box.
5. Click **Sign in to dashboard**.

If you forget your password, click **Forgot password?** to receive a reset link at your @defence.gov.ng inbox.

> Security: A failed login is logged. Three failed attempts in 10 minutes lock the account for 15 minutes.

---

## 3. The Dashboard

After login you will land on `/admin/dashboard.html` which shows:

- A welcome message with your name and role
- Four KPI cards: published posts, active tenders, open FOI requests, uptime
- Quick-action cards: publish a press release, upload images, open a tender, update profiles
- A "Recent activity" table for transparency
- A live BPSR scorecard tile (target 4/4 on every criterion)

Use the left-hand sidebar to navigate. The active page is highlighted with a gold left-border.

---

## 4. Publishing a Press Release (like State House)

1. Sidebar → **📰 News & Press Releases**, or click the orange **+ New post** button on the dashboard.
2. The Editor form scrolls into view at the bottom of the page.
3. Fill in:
   - **Title** — write in the State House style: lead with the Minister's name and the action, then the venue.
   - **Category** — choose Press Release, Speech, Communique, Statement or Photo News.
   - **Author** — auto-filled from your account.
   - **Publish date** — leave blank for "publish now", or pick a future date to schedule.
   - **Featured image** — 1600 × 900, JPG or WebP, ideally under 500 KB. Use **Media Library** to pick existing assets.
   - **Body** — write in plain English, paragraphs of ≤ 5 lines, embed quotes and images using the toolbar icons.
   - **Tags** — comma-separated, e.g. `DICON, AFRIDEX, Armed Forces`.
4. Click **Save draft** (you can come back later), **Publish** (goes live immediately on the homepage and `/press.html`), or **Schedule**.

To edit or unpublish a post, click **Edit** in the row, then either change content and click **Update**, or click **Archive** (red link) to take it down.

---

## 5. Uploading Images (Media Library)

1. Sidebar → **🖼️ Media Library**.
2. Click **Choose files** in the Upload form (top of the page). Multi-select is supported.
3. Choose an **Album**: Ministerial, Operations, Ceremonies, Press, or Documents.
4. Enter **Alt text** — this is mandatory for accessibility (WCAG 2.2 AA). Describe the photo in one short sentence.
5. Click **Upload**. The CMS auto-converts large images to WebP at three sizes (320 / 800 / 1600 px) for performance.

Once uploaded, you can:
- **Copy URL** to embed elsewhere
- **Edit alt text / caption**
- **Move** between albums
- **Delete** (Super Admin only, recoverable for 30 days from the audit log)

> Recommended specs: portrait photos 4:5, news thumbnails 16:9, gallery images 4:3. Keep file size ≤ 1 MB.

---

## 6. Updating Minister / Director Profiles & Photos

1. Sidebar → **👤 Ministers & Management**.
2. The Honourable Minister's card is at the top. To update:
   - Change the **Full name**, **Honours**, **Title** or **Tenure start**.
   - Click **Photo** → upload a new 4:5 portrait (at least 1200 × 1500 px, JPG / WebP, ≤ 1 MB).
   - Edit the **Biography** field; you can paste rich text.
   - Click **Save draft** to review, or **Publish to public site** to push live.
3. The Senior Management table lists the Permanent Secretary and all Directors. Click **Edit** in any row to update name, title, email, photo and biography.
4. Click **+ Add new director** at the bottom to add a new entry.

> When a Minister changes (e.g. cabinet reshuffle), edit the existing card; do not delete it. The system archives the previous holder under "Past Ministers" automatically.

---

## 7. Managing Procurement & Tenders

1. Sidebar → **📋 Procurement & Tenders**.
2. Click **+ New tender notice** (top-right).
3. Fill in:
   - **Reference** (e.g. `FMOD/2026/CB-020`)
   - **Title**, **Category** (Goods, Works, Services, Consulting), **Closing date**
   - **Tender document** (PDF, in BPP Standard Bidding format)
   - **Estimated value**, **Procurement method** (Open, Selective, Restricted)
4. Click **Publish** to push live to `/procurement.html` and the homepage marquee.
5. To close a tender, click **Close** in the row — the entry moves to the "Past tenders" archive.

> Compliance: All tender entries are stamped with the publishing user and timestamp in the audit log, in line with the Public Procurement Act 2007 and the BPP Open Contracting Data Standard.

---

## 8. Responding to FOI Requests

1. Sidebar → **🔍 FOI Requests**.
2. New requests appear with the badge **New**; SLA countdown is 7 working days.
3. Click **Open** on a request to view the full body, requester details and assigned officer.
4. Use the response editor to draft your reply; click **Attach** to add records (PDF, DOCX, XLSX).
5. Click **Send response** — the requester is notified by email and the request is marked **Closed**.
6. Statistics roll up monthly to the SERVICOM dashboard and the public Disclosure Register.

---

## 9. Contact Inbox

1. Sidebar → **✉️ Contact Inbox**.
2. Messages received via the public Contact form land here.
3. Each message has a topic (Recruitment, Media, Procurement, etc.). Click **Reply** to respond.
4. Replies go from your `@defence.gov.ng` address; the original is archived for audit.

---

## 10. Users & Roles

1. Sidebar → **👥 Users & Roles**.
2. Click **+ Invite user** to add a new colleague. Required fields: full name, @defence.gov.ng email, role.
3. The invitee receives an email with a one-time link to set their password and enrol in MFA.
4. To change a user's role or status, click **Edit** in the row. Deactivated users cannot sign in but their content history is preserved.

> Roles can be cloned and customised under **Settings → Roles** (Super Admin only).

---

## 11. Audit Log

1. Sidebar → **🛡️ Audit Log**.
2. Every action — login, publish, upload, delete, settings change — is recorded with timestamp, user, IP and target.
3. Filter by user, action type or date range.
4. Click **Export CSV** or **Export PDF** to share with BPSR / internal audit.

---

## 12. Site Settings

1. Sidebar → **⚙️ Settings**.
2. Edit **Site title**, **Tagline**, **Primary email**, **Switchboard**, **Brand colour**, **Favicon**.
3. Toggle **AI Citizen Assistant**, **Multilingual toggle**, **Accessibility floating button** and **Two-factor authentication**.
4. Click **Save settings**.

The Security tab confirms TLS 1.3, HSTS, CSP, hCaptcha, security.txt and quarterly pen-tests — all features required for a 4/Excellent on the BPSR Security criterion.

---

## 13. Languages

The public site auto-translates English content into Hausa, Igbo, Yoruba, French, Spanish and Chinese using a dictionary in `assets/js/main.js`. For full content translation:

1. Open the post in **News & Press Releases → Edit**.
2. Click the language tabs at the top of the editor.
3. Type the translated version in each tab.
4. Click **Save translations**.

If a translation is missing, the site falls back to English automatically.

---

## 14. Backups & Recovery

Daily encrypted backups run at 02:00 WAT and are retained for 90 days on Galaxy Backbone NSSC. To restore an article you accidentally deleted, open **Audit Log**, find the `post.delete` entry, click **Restore**.

---

## 15. Going Live (Production checklist)

Before pointing `defence.gov.ng` at this build:

- [ ] Rotate all four demo passwords; enable MFA enforcement.
- [ ] Replace minister/director photos with high-resolution official portraits.
- [ ] Replace placeholder press releases with current Press Office content.
- [ ] Confirm DNS, TLS 1.3 cert, HSTS preload, IPv6 and DNSSEC at Galaxy Backbone NSSC.
- [ ] Confirm `security.txt` at `/.well-known/security.txt`.
- [ ] Run Lighthouse audit — target ≥ 95 mobile across Performance, Accessibility, Best-Practices and SEO.
- [ ] Submit sitemap.xml to Google Search Console and Bing Webmaster Tools.
- [ ] Submit the site for the next BPSR / NITDA Scorecard cycle.

---

## 16. Need help?

- **Editorial training:** request a refresher from Press & PR Directorate (`press@defence.gov.ng`).
- **Technical:** raise a ticket with Defence ICT (`ict@defence.gov.ng`) or Galaxy Backbone Service Desk (`servicedesk@galaxybackbone.com.ng`, 0807 399 0518).
- **Security incident:** email `security@defence.gov.ng` immediately and follow the Vulnerability Disclosure policy.

---

*Long live the Federal Republic of Nigeria 🇳🇬*
