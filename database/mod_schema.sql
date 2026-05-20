-- =============================================================================
-- FEDERAL MINISTRY OF DEFENCE — Content database schema
-- Tested on PostgreSQL 14+ and MySQL 8+. SQLite-compatible with minor edits.
--
-- IMPORTANT: The live site does NOT use a SQL database today. All admin-managed
-- content is stored in browser localStorage (see /website/assets/js/contentstore.js).
-- This file is the migration target — when you move to Firebase, Supabase,
-- PostgreSQL, or any other server-side database, use this schema as the data
-- model and the INSERT statements at the bottom to seed the initial content.
-- =============================================================================

-- ─── HERO (single row) ──────────────────────────────────────────────────────
CREATE TABLE hero (
  id           INTEGER PRIMARY KEY,
  eyebrow      VARCHAR(120) NOT NULL,
  headline     VARCHAR(200) NOT NULL,
  body         TEXT         NOT NULL,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─── HERO SLIDER IMAGES ─────────────────────────────────────────────────────
CREATE TABLE hero_slides (
  id              SERIAL PRIMARY KEY,
  position        INTEGER NOT NULL DEFAULT 0,
  image_url       VARCHAR(500) NOT NULL,
  caption_role    VARCHAR(120),
  caption_name    VARCHAR(200),
  alt_text        VARCHAR(200),
  is_active       BOOLEAN     DEFAULT TRUE,
  created_at      TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_hero_slides_position ON hero_slides(position);

-- ─── PRESS RELEASES ─────────────────────────────────────────────────────────
CREATE TABLE press_releases (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(120)  UNIQUE NOT NULL,
  published_at  DATE          NOT NULL,
  category      VARCHAR(80)   NOT NULL DEFAULT 'Press Office',
  title         VARCHAR(300)  NOT NULL,
  excerpt       TEXT,
  body          TEXT,
  image_url     VARCHAR(500),
  external_url  VARCHAR(500),
  is_featured   BOOLEAN       DEFAULT FALSE,
  position      INTEGER       DEFAULT 0,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_press_published ON press_releases(published_at DESC);
CREATE INDEX idx_press_slug      ON press_releases(slug);

-- ─── LEADERSHIP (3 fixed roles) ─────────────────────────────────────────────
CREATE TABLE leadership (
  role         VARCHAR(40) PRIMARY KEY,
  name         VARCHAR(200) NOT NULL,
  title        VARCHAR(200) NOT NULL,
  photo_url    VARCHAR(500),
  bio          TEXT,
  email        VARCHAR(120),
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CHECK (role IN ('minister', 'minister_of_state', 'permanent_secretary'))
);

-- ─── DEPARTMENTS (16 of them) ───────────────────────────────────────────────
CREATE TABLE departments (
  slug          VARCHAR(60)  PRIMARY KEY,
  name          VARCHAR(150) NOT NULL,
  category      VARCHAR(60),
  director_name VARCHAR(200),
  director_role VARCHAR(200),
  email         VARCHAR(120),
  lead_text     TEXT,
  body          TEXT,
  position      INTEGER      DEFAULT 0,
  updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─── NEWSLETTER SUBSCRIBERS ─────────────────────────────────────────────────
CREATE TABLE subscribers (
  id             SERIAL       PRIMARY KEY,
  email          VARCHAR(200) UNIQUE NOT NULL,
  subscribed_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  source         VARCHAR(80)  DEFAULT 'footer-form'
);
CREATE INDEX idx_subs_email ON subscribers(email);

-- ─── FREEDOM OF INFORMATION REQUESTS ────────────────────────────────────────
CREATE TABLE foi_requests (
  id              SERIAL PRIMARY KEY,
  reference       VARCHAR(40)  UNIQUE NOT NULL,
  requester_name  VARCHAR(200) NOT NULL,
  requester_email VARCHAR(200) NOT NULL,
  requester_phone VARCHAR(40),
  organisation    VARCHAR(200),
  subject         VARCHAR(300) NOT NULL,
  details         TEXT         NOT NULL,
  status          VARCHAR(30)  DEFAULT 'received',
  submitted_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  responded_at    TIMESTAMP,
  response        TEXT,
  CHECK (status IN ('received','acknowledged','in_progress','responded','partially_granted','refused'))
);
CREATE INDEX idx_foi_status ON foi_requests(status);
CREATE INDEX idx_foi_submitted ON foi_requests(submitted_at DESC);

-- ─── SERVICOM COMPLAINTS ────────────────────────────────────────────────────
CREATE TABLE servicom_complaints (
  id              SERIAL PRIMARY KEY,
  reference       VARCHAR(40)  UNIQUE NOT NULL,
  complainant     VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL,
  where_service   VARCHAR(300),
  when_service    DATE,
  details         TEXT         NOT NULL,
  status          VARCHAR(30)  DEFAULT 'received',
  submitted_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  resolved_at     TIMESTAMP,
  resolution      TEXT,
  CHECK (status IN ('received','in_progress','resolved','closed'))
);

-- ─── CONTACT MESSAGES ───────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  subject       VARCHAR(300),
  message       TEXT         NOT NULL,
  is_read       BOOLEAN      DEFAULT FALSE,
  submitted_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- ─── TENDERS / PROCUREMENT ──────────────────────────────────────────────────
CREATE TABLE tenders (
  id           SERIAL PRIMARY KEY,
  reference    VARCHAR(60)  UNIQUE NOT NULL,
  title        VARCHAR(300) NOT NULL,
  category     VARCHAR(60),
  description  TEXT,
  document_url VARCHAR(500),
  published_at DATE         DEFAULT CURRENT_DATE,
  closes_at    DATE         NOT NULL,
  is_active    BOOLEAN      DEFAULT TRUE
);
CREATE INDEX idx_tenders_active ON tenders(is_active, closes_at);

-- ─── ADMIN USERS (when you upgrade past single-password gate) ───────────────
CREATE TABLE admin_users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(200) UNIQUE NOT NULL,
  display_name    VARCHAR(200),
  password_hash   VARCHAR(255) NOT NULL,
  role            VARCHAR(30)  DEFAULT 'editor',
  is_active       BOOLEAN      DEFAULT TRUE,
  last_login_at   TIMESTAMP,
  created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CHECK (role IN ('super_admin','admin','editor','press_officer'))
);

-- ─── AUDIT LOG ──────────────────────────────────────────────────────────────
CREATE TABLE audit_log (
  id           SERIAL PRIMARY KEY,
  user_email   VARCHAR(200),
  action       VARCHAR(60)  NOT NULL,
  entity_type  VARCHAR(60)  NOT NULL,
  entity_id    VARCHAR(80),
  old_value    TEXT,
  new_value    TEXT,
  ip_address   VARCHAR(45),
  occurred_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_audit_occurred ON audit_log(occurred_at DESC);


-- =============================================================================
-- SEED DATA — the real content currently shown on the site (May 2026)
-- =============================================================================

-- ─── HERO ───────────────────────────────────────────────────────────────────
INSERT INTO hero (id, eyebrow, headline, body) VALUES (1,
  'Federal Republic of Nigeria',
  'Defending the sovereignty of Nigeria.',
  'The Federal Ministry of Defence — the apex policy authority overseeing the Nigerian Armed Forces — provides strategic leadership for a modern, professional, mission-ready military in the service of more than 220 million citizens of the Federal Republic.'
);

-- ─── HERO SLIDES (5 real photos hot-linked from defence.gov.ng) ─────────────
INSERT INTO hero_slides (position, image_url, caption_role, caption_name, alt_text) VALUES
(1, 'https://defence.gov.ng/wp-content/uploads/slider/cache/5c91a2fb5a3c3d7d91aa26fb98ea005d/WhatsApp-Image-2026-05-08-at-09.51.56.jpg', 'Honourable Minister of Defence', 'General Christopher Gwabin Musa (rtd), OFR', 'Hon. Minister at the African Medical Centre of Excellence'),
(2, 'https://defence.gov.ng/wp-content/uploads/slider/cache/7ed124706b9db62fa4aae0e8bdc44f70/WhatsApp-Image-2026-05-06-at-09.44.49.jpg',  'Regional Security', 'Regional security consultation', 'Regional security meeting'),
(3, 'https://defence.gov.ng/wp-content/uploads/slider/cache/f2ac3e9cb69b47524dec83e6268b40b1/WhatsApp-Image-2026-05-05-at-16.06.33.jpg',  'Civil–Military Engagement', 'Reception of the Veritas University delegation', 'Veritas University delegation'),
(4, 'https://defence.gov.ng/wp-content/uploads/slider/cache/b64dada37ea1a198b4a6e0382f45f0c0/WhatsApp-Image-2026-05-05-at-04.41.488-1.jpg', 'National Security', 'Engaging Nigerian students on national security', 'Students engagement on national security'),
(5, 'https://defence.gov.ng/wp-content/uploads/slider/cache/de24e192a317d951778e07962e82686d/WhatsApp-Image-2026-04-29-at-21.34.414.jpg',  'Strategic Committees', 'Inauguration at Ship House, 29 April 2026', 'Strategic committees inauguration');

-- ─── LEADERSHIP ─────────────────────────────────────────────────────────────
INSERT INTO leadership (role, name, title, photo_url) VALUES
('minister',
 'General Christopher Gwabin Musa (rtd), OFR',
 'Honourable Minister of Defence',
 'https://defence.gov.ng/wp-content/uploads/2025/12/Minister-733x1024.jpeg'),
('minister_of_state',
 'Dr. Bello Mohammed Matawalle, MON',
 'Honourable Minister of State for Defence',
 'https://defence.gov.ng/wp-content/uploads/2023/08/WhatsApp-Image-2023-08-30-at-17.54.10-819x1024.jpg'),
('permanent_secretary',
 'Permanent Secretary',
 'Permanent Secretary, Federal Ministry of Defence',
 'https://defence.gov.ng/wp-content/uploads/2021/01/Perm-Sec-733x1024.jpeg');

-- ─── PRESS RELEASES (8 real items from May 2026) ────────────────────────────
INSERT INTO press_releases (slug, published_at, category, title, excerpt, image_url, external_url, is_featured, position) VALUES
('defence-minister-pledges-amce', '2026-05-11', 'Press Office',
 'Defence Minister pledges to boost military healthcare, reduce medical tourism during AMCE visit',
 'The Honourable Minister of Defence, General Christopher Gwabin Musa (rtd), has pledged the Ministry of Defence''s commitment to strengthening military healthcare and reducing medical tourism, during a working visit to the African Medical Centre of Excellence (AMCE) in Abuja.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/5c91a2fb5a3c3d7d91aa26fb98ea005d/WhatsApp-Image-2026-05-08-at-09.51.56.jpg',
 'https://defence.gov.ng/2026/05/11/defence-minister-pledges-to-boost-military-healthcare-reduce-medical-tourism-during-amce-visit/',
 TRUE, 1),

('icrc-humanitarian', '2026-05-08', 'Press Office',
 'Defence Minister commends ICRC for humanitarian services in the country',
 'The Honourable Minister of Defence has commended the International Committee of the Red Cross (ICRC) for its sustained humanitarian engagement across Nigeria, particularly in conflict-affected communities.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/7ed124706b9db62fa4aae0e8bdc44f70/WhatsApp-Image-2026-05-06-at-09.44.49.jpg',
 'https://defence.gov.ng/2026/05/08/defence-minister-commends-icrc-for-humanitarian-services-in-the-country/',
 FALSE, 2),

('regional-security-meeting', '2026-05-06', 'Press Office',
 'Defence Minister participates in regional security meeting',
 'Reaffirming Nigeria''s commitment to regional cooperation and collective security, the Honourable Minister of Defence joined counterparts from the West African sub-region for a high-level consultation on emerging threats.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/f2ac3e9cb69b47524dec83e6268b40b1/WhatsApp-Image-2026-05-05-at-16.06.33.jpg',
 'https://defence.gov.ng/2026/05/06/defence-minister-participates-in-regional-security-meeting/',
 FALSE, 3),

('prestigious-fellowship', '2026-05-06', 'Press Office',
 'Defence Minister conferred with prestigious fellowship',
 'The Ministry of Defence has welcomed the conferment of an Honorary Fellowship on the Honourable Minister in recognition of his contributions to national security and defence reform.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/b64dada37ea1a198b4a6e0382f45f0c0/WhatsApp-Image-2026-05-05-at-04.41.488-1.jpg',
 'https://defence.gov.ng/2026/05/06/defence-minister-conferred-with-prestigious-fellowship/',
 FALSE, 4),

('musa-students-security', '2026-05-05', 'Press Office',
 'Gen. Musa urges Nigerian students to play active role in national security',
 'The Honourable Minister urged Nigerian students and youth to take ownership of the national security conversation through civic responsibility, intelligence sharing and lawful conduct.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/7d5dab6eb3370ef45d22dfbeceb170b0/WhatsApp-Image-2026-05-05-at-04.41.4644.jpg',
 'https://defence.gov.ng/2026/05/05/gen-musa-urges-nigerian-students-to-play-active-role-in-national-security/',
 FALSE, 5),

('veritas-university', '2026-05-05', 'Press Office',
 'Hon. Minister receives Veritas University Political Science delegation',
 'The Honourable Minister of Defence received a delegation from the Department of Political Science and Diplomacy of Veritas University at Ship House, Abuja, for a courtesy and research engagement.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/f2ac3e9cb69b47524dec83e6268b40b1/WhatsApp-Image-2026-05-05-at-16.06.33.jpg',
 NULL, FALSE, 6),

('three-committees-inaugurated', '2026-04-30', 'Press Office',
 'Hon. Minister inaugurates three committees at Ship House',
 'The Honourable Minister of Defence inaugurated three strategic committees at the Ministry''s Conference Room, Ship House, Abuja, on Wednesday, 29 April 2026, in furtherance of the Ministry''s reform agenda.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/de24e192a317d951778e07962e82686d/WhatsApp-Image-2026-04-29-at-21.34.414.jpg',
 NULL, FALSE, 7),

('strategic-committees-security-veterans', '2026-04-30', 'Press Office',
 'Defence Ministry inaugurates strategic committees to strengthen national security and veterans welfare',
 'The Ministry of Defence has inaugurated strategic committees aimed at strengthening national security architecture and improving the welfare and resettlement of veterans of the Armed Forces.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/39e7bd9f42f86e2e15e02a7a8e72b6bb/WhatsApp-Image-2026-04-29-at-21.34.426.jpg',
 NULL, FALSE, 8);

-- ─── DEPARTMENTS (16 of them — from departments-data.js) ────────────────────
INSERT INTO departments (slug, name, category, director_name, director_role, email, lead_text) VALUES
('joint-services','Joint Services','Civilian Component','Mrs. B.O. Olaniyi','Director, Joint Services','joint@defence.gov.ng',
 'Coordinates tri-service operations, joint task forces and combined exercises between the Army, Navy and Air Force.'),
('human-resources','Human Resources','Civilian Component','Mal. Idris Shehu Gaya, mni','Director, Human Resource Management','hr@defence.gov.ng',
 'Manages recruitment, posting, promotion, discipline, training and welfare for civilian staff of the Federal Ministry of Defence.'),
('prs','Planning, Research & Statistics','Civilian Component','Alh. Abdulrahman Suleiman','Director, Planning, Research & Statistics','prs@defence.gov.ng',
 'Defence policy research, strategic planning, monitoring and evaluation across the Ministry and its agencies.'),
('army-affairs','Army Affairs','Civilian Component','Mr. SM Attah','Director, Army Affairs','army-affairs@defence.gov.ng',
 'The Ministry''s primary interface with the Nigerian Army on policy, finance, welfare and procurement.'),
('navy-affairs','Navy Affairs','Civilian Component','Mr. Joel Adeoye Christopher','Director, Navy Affairs','navy-affairs@defence.gov.ng',
 'The Ministry''s primary interface with the Nigerian Navy on policy, finance, welfare and procurement.'),
('air-force-affairs','Air Force Affairs','Civilian Component','Dr. Ahmad Ibrahim Sulaiman','Director, Air Force Affairs','airforce-affairs@defence.gov.ng',
 'The Ministry''s primary interface with the Nigerian Air Force on policy, finance, welfare and procurement.'),
('finance-accounts','Finance & Accounts','Civilian Component','Mr. Afolabi Idowu Omoniwa','Director, Finance and Accounts','finance@defence.gov.ng',
 'Budget preparation, payment processing, financial reporting and treasury management for the Ministry.'),
('procurement-dept','Procurement','Civilian Component','Mr. Otalike P. Yahaya','Director, Procurement','procurement@defence.gov.ng',
 'Open, competitive procurement of goods, works and services for the Ministry, in line with the Public Procurement Act 2007.'),
('legal','Legal Services','Civilian Component','Barr. Adebola Odugbesa','Director, Legal Services','legal@defence.gov.ng',
 'Legal advisory, contracts, treaties and dispute resolution for the Federal Ministry of Defence.'),
('health-services','Health Services','Civilian Component II','Dr. Jibrin Alhassan','Director, Health Services','health@defence.gov.ng',
 'Health policy, military medical reciprocity and the Ministry''s medical-care interventions.'),
('general-services','General Services','Civilian Component II','Uwaneyi Raymond Erurane','Director, General Services','general-services@defence.gov.ng',
 'Estate, facilities, transport, security and protocol for the Ministry''s Headquarters at Ship House.'),
('public-relations','Information, Press & Public Relations','Civilian Component II','Mr. Henshaw Ogubike','Director, Information, Press & Public Relations','press@defence.gov.ng',
 'Public communications, press releases, media accreditation and citizen engagement.'),
('education-services','Education Services','Civilian Component II','Mr. Kura Markus','Director, Education Services','education@defence.gov.ng',
 'Liaison with the NDA, AFCSC, NDC and other Defence training and educational institutions.'),
('internal-audit','Internal Audit','Civilian Component II','Mrs. Gloria Okopi','Director, Internal Audit','internal-audit@defence.gov.ng',
 'Independent assurance over the Ministry''s financial controls, processes and value for money.'),
('reform-coordination','Reform Coordination & Service Improvement','Civilian Component II','Nneji Nkiru Florence','Director, Reforms Coordination & Service Improvement','reforms@defence.gov.ng',
 'Implementation of public-service reform and SERVICOM commitments in the Federal Ministry of Defence.'),
('permanent-secretary','Office of the Permanent Secretary','Office of Direction','Permanent Secretary, FMOD','Permanent Secretary','ps@defence.gov.ng',
 'The chief administrative and accounting officer of the Ministry, coordinating the work of all departments.');

-- ─── ADMIN USER (replace the hash before deploying!) ────────────────────────
-- Generate with: php -r 'echo password_hash("CHANGE-THIS", PASSWORD_BCRYPT);'
-- or in Node:    bcrypt.hashSync("CHANGE-THIS", 12)
INSERT INTO admin_users (email, display_name, password_hash, role) VALUES
('admin@defence.gov.ng', 'FMOD Administrator', '$2y$12$REPLACE_WITH_BCRYPT_HASH', 'super_admin');

-- =============================================================================
-- END OF SEED DATA. Total: ~32 rows, mirrors the live site exactly.
-- =============================================================================
