-- =============================================================================
-- FEDERAL MINISTRY OF DEFENCE — MySQL schema (target: MySQL 8.0+ / MariaDB 10.5+)
-- Engine: InnoDB · Charset: utf8mb4 (full Unicode incl. emoji, Yoruba diacritics)
--
-- Import:  mysql -u root -p < database/mod_schema_mysql.sql
--          OR
--          mysql -u root -p fmod_prod < database/mod_schema_mysql.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS fmod_prod
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fmod_prod;

-- Clean slate if re-running
DROP TABLE IF EXISTS audit_log, admin_users, tenders, contact_messages,
                     servicom_complaints, foi_requests, subscribers, departments,
                     leadership, press_releases, hero_slides, hero;

-- ─── HERO TEXT (single row) ─────────────────────────────────────────────────
CREATE TABLE hero (
  id          TINYINT UNSIGNED PRIMARY KEY,
  eyebrow     VARCHAR(120)    NOT NULL,
  headline    VARCHAR(200)    NOT NULL,
  body        TEXT            NOT NULL,
  updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── HERO SLIDER IMAGES ─────────────────────────────────────────────────────
CREATE TABLE hero_slides (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  position     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  image_url    VARCHAR(500)      NOT NULL,
  caption      VARCHAR(280)      NULL,         -- the 1–2 line sentence per slide
  tag          VARCHAR(80)       NULL,         -- short eyebrow above the caption
  alt_text     VARCHAR(200)      NULL,
  is_active    TINYINT(1)        NOT NULL DEFAULT 1,
  created_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP         DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_hero_slides_position (position, is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── PRESS RELEASES ─────────────────────────────────────────────────────────
CREATE TABLE press_releases (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug          VARCHAR(120)     NOT NULL UNIQUE,
  published_at  DATE             NOT NULL,
  category      VARCHAR(80)      NOT NULL DEFAULT 'Press Office',
  title         VARCHAR(300)     NOT NULL,
  excerpt       TEXT,
  body          MEDIUMTEXT,
  image_url     VARCHAR(500),
  external_url  VARCHAR(500),
  is_featured   TINYINT(1)       DEFAULT 0,
  position      SMALLINT UNSIGNED DEFAULT 0,
  created_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_press_published (published_at DESC),
  INDEX idx_press_featured (is_featured, published_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── LEADERSHIP (3 fixed roles) ─────────────────────────────────────────────
CREATE TABLE leadership (
  role        ENUM('minister','minister_of_state','permanent_secretary') NOT NULL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  photo_url   VARCHAR(500),
  bio         MEDIUMTEXT,
  email       VARCHAR(120),
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── DEPARTMENTS (16 of them) ───────────────────────────────────────────────
CREATE TABLE departments (
  slug           VARCHAR(60)  PRIMARY KEY,
  name           VARCHAR(150) NOT NULL,
  category       VARCHAR(60),
  director_name  VARCHAR(200),
  director_role  VARCHAR(200),
  email          VARCHAR(120),
  lead_text      TEXT,
  body           MEDIUMTEXT,
  position       SMALLINT UNSIGNED DEFAULT 0,
  updated_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── NEWSLETTER SUBSCRIBERS ─────────────────────────────────────────────────
CREATE TABLE subscribers (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(200) NOT NULL UNIQUE,
  subscribed_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP    NULL,
  source          VARCHAR(80)  DEFAULT 'footer-form',
  INDEX idx_subs_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── FOI REQUESTS ───────────────────────────────────────────────────────────
CREATE TABLE foi_requests (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference        VARCHAR(40)  NOT NULL UNIQUE,
  requester_name   VARCHAR(200) NOT NULL,
  requester_email  VARCHAR(200) NOT NULL,
  requester_phone  VARCHAR(40),
  organisation     VARCHAR(200),
  subject          VARCHAR(300) NOT NULL,
  details          TEXT         NOT NULL,
  status           ENUM('received','acknowledged','in_progress','responded','partially_granted','refused')
                   NOT NULL DEFAULT 'received',
  submitted_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  responded_at     TIMESTAMP    NULL,
  response         MEDIUMTEXT,
  INDEX idx_foi_status (status),
  INDEX idx_foi_submitted (submitted_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── SERVICOM COMPLAINTS ────────────────────────────────────────────────────
CREATE TABLE servicom_complaints (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference       VARCHAR(40)  NOT NULL UNIQUE,
  complainant     VARCHAR(200) NOT NULL,
  email           VARCHAR(200) NOT NULL,
  where_service   VARCHAR(300),
  when_service    DATE,
  details         TEXT         NOT NULL,
  status          ENUM('received','in_progress','resolved','closed') NOT NULL DEFAULT 'received',
  submitted_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  resolved_at     TIMESTAMP    NULL,
  resolution      MEDIUMTEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── CONTACT MESSAGES ───────────────────────────────────────────────────────
CREATE TABLE contact_messages (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  email         VARCHAR(200) NOT NULL,
  subject       VARCHAR(300),
  message       TEXT         NOT NULL,
  is_read       TINYINT(1)   DEFAULT 0,
  submitted_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── TENDERS / PROCUREMENT ──────────────────────────────────────────────────
CREATE TABLE tenders (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  reference     VARCHAR(60)  NOT NULL UNIQUE,
  title         VARCHAR(300) NOT NULL,
  category      VARCHAR(60),
  description   MEDIUMTEXT,
  document_url  VARCHAR(500),
  published_at  DATE         DEFAULT (CURRENT_DATE),
  closes_at     DATE         NOT NULL,
  is_active     TINYINT(1)   DEFAULT 1,
  INDEX idx_tenders_active (is_active, closes_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── ADMIN USERS ────────────────────────────────────────────────────────────
CREATE TABLE admin_users (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(200) NOT NULL UNIQUE,
  display_name   VARCHAR(200),
  password_hash  VARCHAR(255) NOT NULL,
  role           ENUM('super_admin','admin','editor','press_officer') NOT NULL DEFAULT 'editor',
  is_active      TINYINT(1)   DEFAULT 1,
  last_login_at  TIMESTAMP    NULL,
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admin_users (email, display_name, password_hash, role, is_active) VALUES (
  'admin@defence.gov.ng',
  'Site Administrator',
  '$2y$10$nIg3y1QW7X.DUCo.YvV2TO6Exr8ofrgJ9tSU5IPiNg8MT8HXcoihi',
  'super_admin',
  1
);

-- ─── SITE SETTINGS ─────────────────────────────────────────────────────────
CREATE TABLE site_settings (
  setting_key   VARCHAR(100) NOT NULL PRIMARY KEY,
  setting_value VARCHAR(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('ministryName', 'Federal Ministry of Defence'),
  ('country', 'Federal Republic of Nigeria'),
  ('lastReviewed', 'May 2026');

-- ─── AUDIT LOG ──────────────────────────────────────────────────────────────
CREATE TABLE audit_log (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_email   VARCHAR(200),
  action       VARCHAR(60)  NOT NULL,
  entity_type  VARCHAR(60)  NOT NULL,
  entity_id    VARCHAR(80),
  old_value    MEDIUMTEXT,
  new_value    MEDIUMTEXT,
  ip_address   VARCHAR(45),
  occurred_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_occurred (occurred_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- SEED DATA — May 2026 content
-- =============================================================================

INSERT INTO hero (id, eyebrow, headline, body) VALUES (1,
  'Federal Republic of Nigeria',
  'Defending the sovereignty of Nigeria.',
  'The Federal Ministry of Defence — the apex policy authority overseeing the Nigerian Armed Forces — provides strategic leadership for a modern, professional, mission-ready military in the service of more than 220 million citizens of the Federal Republic.');

-- ─── HERO SLIDES — military-action imagery + per-slide captions ─────────────
INSERT INTO hero_slides (position, image_url, tag, caption, alt_text) VALUES
(1, 'https://images.unsplash.com/photo-1547106634-56dcd53ae883?w=1920&q=80&auto=format&fit=crop',
    'Land Forces',
    'Boots on the ground — protecting Nigerian territory across all six geopolitical zones.',
    'Nigerian Army soldiers on patrol'),
(2, 'https://images.unsplash.com/photo-1568814833907-15edd8a93a87?w=1920&q=80&auto=format&fit=crop',
    'Mechanised Operations',
    'Armour and mechanised infantry secure the corridors of the North-East and North-West theatres.',
    'Military mechanised convoy'),
(3, 'https://images.unsplash.com/photo-1583266486593-c4fe2db1f6e2?w=1920&q=80&auto=format&fit=crop',
    'Air Component',
    'Air supremacy, close air support and ISR over Nigerian skies.',
    'Nigerian Air Force fighter aircraft'),
(4, 'https://images.unsplash.com/photo-1505563842318-1a8e0ce1c037?w=1920&q=80&auto=format&fit=crop',
    'Mobility & Rapid Response',
    'Tactical mobility and rapid response — wherever the Federal Republic needs them.',
    'Military helicopter on deployment'),
(5, 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=1920&q=80&auto=format&fit=crop',
    'Training & Readiness',
    'Discipline, training and constant readiness — the Nigerian Armed Forces at work.',
    'Nigerian troops in formation training');

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

-- ─── PRESS RELEASES ─────────────────────────────────────────────────────────
INSERT INTO press_releases (slug, published_at, category, title, excerpt, image_url, external_url, is_featured, position) VALUES
('defence-minister-pledges-amce','2026-05-11','Press Office',
 'Defence Minister pledges to boost military healthcare, reduce medical tourism during AMCE visit',
 'The Honourable Minister of Defence, General Christopher Gwabin Musa (rtd), has pledged the Ministry of Defence\'s commitment to strengthening military healthcare and reducing medical tourism.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/5c91a2fb5a3c3d7d91aa26fb98ea005d/WhatsApp-Image-2026-05-08-at-09.51.56.jpg',
 'https://defence.gov.ng/2026/05/11/defence-minister-pledges-to-boost-military-healthcare-reduce-medical-tourism-during-amce-visit/', 1, 1),
('icrc-humanitarian','2026-05-08','Press Office',
 'Defence Minister commends ICRC for humanitarian services in the country',
 'The Honourable Minister has commended the International Committee of the Red Cross for its sustained humanitarian engagement across Nigeria.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/7ed124706b9db62fa4aae0e8bdc44f70/WhatsApp-Image-2026-05-06-at-09.44.49.jpg',
 'https://defence.gov.ng/2026/05/08/defence-minister-commends-icrc-for-humanitarian-services-in-the-country/', 0, 2),
('regional-security-meeting','2026-05-06','Press Office',
 'Defence Minister participates in regional security meeting',
 'Reaffirming Nigeria\'s commitment to regional cooperation and collective security across the West African sub-region.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/f2ac3e9cb69b47524dec83e6268b40b1/WhatsApp-Image-2026-05-05-at-16.06.33.jpg',
 'https://defence.gov.ng/2026/05/06/defence-minister-participates-in-regional-security-meeting/', 0, 3),
('prestigious-fellowship','2026-05-06','Press Office',
 'Defence Minister conferred with prestigious fellowship',
 'The Ministry has welcomed the conferment of an Honorary Fellowship on the Honourable Minister.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/b64dada37ea1a198b4a6e0382f45f0c0/WhatsApp-Image-2026-05-05-at-04.41.488-1.jpg',
 'https://defence.gov.ng/2026/05/06/defence-minister-conferred-with-prestigious-fellowship/', 0, 4),
('musa-students-security','2026-05-05','Press Office',
 'Gen. Musa urges Nigerian students to play active role in national security',
 'The Honourable Minister urged Nigerian students to take ownership of the national security conversation.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/7d5dab6eb3370ef45d22dfbeceb170b0/WhatsApp-Image-2026-05-05-at-04.41.4644.jpg',
 'https://defence.gov.ng/2026/05/05/gen-musa-urges-nigerian-students-to-play-active-role-in-national-security/', 0, 5),
('veritas-university','2026-05-05','Press Office',
 'Hon. Minister receives Veritas University Political Science delegation',
 'A delegation from Veritas University was received at Ship House for a courtesy and research engagement.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/f2ac3e9cb69b47524dec83e6268b40b1/WhatsApp-Image-2026-05-05-at-16.06.33.jpg',
 NULL, 0, 6),
('three-committees-inaugurated','2026-04-30','Press Office',
 'Hon. Minister inaugurates three committees at Ship House',
 'Three strategic committees inaugurated at the Ministry\'s Conference Room, Ship House, Abuja.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/de24e192a317d951778e07962e82686d/WhatsApp-Image-2026-04-29-at-21.34.414.jpg',
 NULL, 0, 7),
('strategic-committees-security-veterans','2026-04-30','Press Office',
 'Defence Ministry inaugurates strategic committees to strengthen national security and veterans welfare',
 'Strategic committees to strengthen national security and improve veterans welfare and resettlement.',
 'https://defence.gov.ng/wp-content/uploads/slider/cache/39e7bd9f42f86e2e15e02a7a8e72b6bb/WhatsApp-Image-2026-04-29-at-21.34.426.jpg',
 NULL, 0, 8);

-- ─── DEPARTMENTS ────────────────────────────────────────────────────────────
INSERT INTO departments (slug, name, category, director_name, director_role, email, lead_text) VALUES
('joint-services','Joint Services','Civilian Component','Mrs. B.O. Olaniyi','Director, Joint Services','joint@defence.gov.ng','Coordinates tri-service operations and combined exercises.'),
('human-resources','Human Resources','Civilian Component','Mal. Idris Shehu Gaya, mni','Director, Human Resource Management','hr@defence.gov.ng','Recruitment, posting, promotion, discipline and welfare for civilian staff.'),
('prs','Planning, Research & Statistics','Civilian Component','Alh. Abdulrahman Suleiman','Director, Planning, Research & Statistics','prs@defence.gov.ng','Defence policy research, strategic planning, monitoring and evaluation.'),
('army-affairs','Army Affairs','Civilian Component','Mr. SM Attah','Director, Army Affairs','army-affairs@defence.gov.ng','Primary interface with the Nigerian Army.'),
('navy-affairs','Navy Affairs','Civilian Component','Mr. Joel Adeoye Christopher','Director, Navy Affairs','navy-affairs@defence.gov.ng','Primary interface with the Nigerian Navy.'),
('air-force-affairs','Air Force Affairs','Civilian Component','Dr. Ahmad Ibrahim Sulaiman','Director, Air Force Affairs','airforce-affairs@defence.gov.ng','Primary interface with the Nigerian Air Force.'),
('finance-accounts','Finance & Accounts','Civilian Component','Mr. Afolabi Idowu Omoniwa','Director, Finance and Accounts','finance@defence.gov.ng','Budget, payments, financial reporting and treasury management.'),
('procurement-dept','Procurement','Civilian Component','Mr. Otalike P. Yahaya','Director, Procurement','procurement@defence.gov.ng','Open, competitive procurement under the Public Procurement Act 2007.'),
('legal','Legal Services','Civilian Component','Barr. Adebola Odugbesa','Director, Legal Services','legal@defence.gov.ng','Legal advisory, contracts, treaties and dispute resolution.'),
('health-services','Health Services','Civilian Component II','Dr. Jibrin Alhassan','Director, Health Services','health@defence.gov.ng','Health policy and the Ministry\'s medical-care interventions.'),
('general-services','General Services','Civilian Component II','Uwaneyi Raymond Erurane','Director, General Services','general-services@defence.gov.ng','Estate, facilities, transport, security and protocol.'),
('public-relations','Information, Press & Public Relations','Civilian Component II','Mr. Henshaw Ogubike','Director, Information, Press & Public Relations','press@defence.gov.ng','Public communications and press relations.'),
('education-services','Education Services','Civilian Component II','Mr. Kura Markus','Director, Education Services','education@defence.gov.ng','Liaison with NDA, AFCSC, NDC and other training institutions.'),
('internal-audit','Internal Audit','Civilian Component II','Mrs. Gloria Okopi','Director, Internal Audit','internal-audit@defence.gov.ng','Independent assurance over the Ministry\'s financial controls.'),
('reform-coordination','Reform Coordination & Service Improvement','Civilian Component II','Nneji Nkiru Florence','Director, Reforms Coordination & Service Improvement','reforms@defence.gov.ng','SERVICOM and public-service reform implementation.'),
('permanent-secretary','Office of the Permanent Secretary','Office of Direction','Permanent Secretary, FMOD','Permanent Secretary','ps@defence.gov.ng','Chief administrative and accounting officer of the Ministry.');

-- =============================================================================
-- End. Total: 16 dept rows, 8 press, 5 slides, 3 leadership, 1 admin, 1 hero.
-- =============================================================================
