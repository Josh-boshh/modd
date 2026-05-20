-- =============================================================================
-- SEED DATA â€” May 2026 content
-- =============================================================================

INSERT INTO hero (id, eyebrow, headline, body) VALUES (1,
  'Federal Republic of Nigeria',
  'Defending the sovereignty of Nigeria.',
  'The Federal Ministry of Defence â€” the apex policy authority overseeing the Nigerian Armed Forces â€” provides strategic leadership for a modern, professional, mission-ready military in the service of more than 220 million citizens of the Federal Republic.');

-- â”€â”€â”€ HERO SLIDES â€” military-action imagery + per-slide captions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
INSERT INTO hero_slides (position, image_url, tag, caption, alt_text) VALUES
(1, 'https://images.unsplash.com/photo-1547106634-56dcd53ae883?w=1920&q=80&auto=format&fit=crop',
    'Land Forces',
    'Boots on the ground â€” protecting Nigerian territory across all six geopolitical zones.',
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
    'Tactical mobility and rapid response â€” wherever the Federal Republic needs them.',
    'Military helicopter on deployment'),
(5, 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=1920&q=80&auto=format&fit=crop',
    'Training & Readiness',
    'Discipline, training and constant readiness â€” the Nigerian Armed Forces at work.',
    'Nigerian troops in formation training');

-- â”€â”€â”€ LEADERSHIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ PRESS RELEASES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ DEPARTMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

-- â”€â”€â”€ DEFAULT ADMIN (CHANGE THE HASH BEFORE DEPLOYING) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
-- Generate: php -r 'echo password_hash("CHANGE-THIS", PASSWORD_BCRYPT);'
INSERT INTO admin_users (email, display_name, password_hash, role) VALUES
('admin@defence.gov.ng', 'FMOD Administrator', '$2y$12$REPLACE_WITH_BCRYPT_HASH', 'super_admin');

-- =============================================================================
-- End. Total: 16 dept rows, 8 press, 5 slides, 3 leadership, 1 admin, 1 hero.
-- =============================================================================

