<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';
requireAdmin();
$user = getAdminUser();
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="robots" content="noindex, nofollow" />
  <meta name="csrf-token" content="<?php echo htmlspecialchars(getCsrfToken(), ENT_QUOTES, 'UTF-8'); ?>" />
  <title>Admin · Federal Ministry of Defence</title>
  <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="../assets/css/style.css?v=8" />
  <link rel="stylesheet" href="admin.css" />
</head>
<body class="admin-body">
  <div class="admin-shell" id="dashboard">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <img src="../assets/images/coat-of-arms.svg" alt="" width="40" height="40" />
        <div>
          <div class="brand-name">FMOD Admin</div>
          <div class="brand-sub">Site management</div>
        </div>
      </div>
      <div class="admin-user">
        <strong><?php echo htmlspecialchars($user['display_name'], ENT_QUOTES, 'UTF-8'); ?></strong>
        <span><?php echo htmlspecialchars($user['email'], ENT_QUOTES, 'UTF-8'); ?></span>
      </div>
      <nav class="admin-nav">
        <button class="admin-nav-btn active" data-section="dashboard"><span class="icon">▦</span> Dashboard</button>
        <button class="admin-nav-btn" data-section="hero"><span class="icon">⛶</span> Hero & slider</button>
        <button class="admin-nav-btn" data-section="press"><span class="icon">▤</span> Press releases</button>
        <button class="admin-nav-btn" data-section="leadership"><span class="icon">◉</span> Leadership</button>
        <button class="admin-nav-btn" data-section="newsletter"><span class="icon">✉</span> Newsletter</button>
        <button class="admin-nav-btn" data-section="settings"><span class="icon">⚙</span> Site settings</button>
        <button class="admin-nav-btn" data-section="backup"><span class="icon">⤓</span> Backup & restore</button>
      </nav>
      <div class="admin-foot">
        <a href="../index.html" target="_blank">View public site ↗</a>
        <a class="logout" id="logoutBtn">Sign out</a>
      </div>
    </aside>

    <main class="admin-main">
      <section class="admin-section active" data-panel="dashboard">
        <header class="admin-header">
          <h1>Dashboard.</h1>
          <p>Welcome back. Everything you publish here updates the public site live.</p>
        </header>
        <div class="admin-stats">
          <div class="stat-card"><div class="stat-num" id="statPress">—</div><div class="stat-label">Press releases</div></div>
          <div class="stat-card"><div class="stat-num" id="statSlides">—</div><div class="stat-label">Slider images</div></div>
          <div class="stat-card"><div class="stat-num" id="statSubs">—</div><div class="stat-label">Newsletter subscribers</div></div>
          <div class="stat-card"><div class="stat-num" id="statLastReviewed">—</div><div class="stat-label">Last reviewed</div></div>
        </div>
        <div class="admin-grid-2">
          <div class="panel">
            <h3>Quick actions</h3>
            <div class="quick-actions">
              <button class="btn btn-green" data-jump="press">+ New press release</button>
              <button class="btn btn-outline" data-jump="hero">+ New slide</button>
              <button class="btn btn-outline" data-jump="newsletter">View subscribers</button>
              <button class="btn btn-outline" data-jump="backup">Backup site</button>
            </div>
          </div>
          <div class="panel">
            <h3>How edits work</h3>
            <p>Changes you make here are saved in your browser's <strong>localStorage</strong> and persisted to the backend database.</p>
            <p>Use <strong>Backup & restore</strong> to export/import JSON across devices.</p>
          </div>
        </div>
      </section>

      <section class="admin-section" data-panel="hero">
        <header class="admin-header">
          <h1>Hero & slider.</h1>
          <p>Edit the headline text and the hero image slides shown on the home page.</p>
        </header>
        <div class="panel">
          <h3>Hero text</h3>
          <div class="form-row">
            <label>Eyebrow (small line above headline)</label>
            <input type="text" id="heroEyebrow" />
          </div>
          <div class="form-row">
            <label>Headline</label>
            <input type="text" id="heroHeadline" />
          </div>
          <div class="form-row">
            <label>Body paragraph</label>
            <textarea id="heroBody" rows="3"></textarea>
          </div>
          <button class="btn btn-green" id="saveHeroText">Save hero text</button>
          <span class="save-status" id="heroTextStatus"></span>
        </div>

        <div class="panel">
          <div class="panel-head">
            <h3>Slider images</h3>
            <button class="btn btn-green btn-sm" id="addSlide">+ Add slide</button>
          </div>
          <p class="hint">Use the ↑ / ↓ buttons to reorder slides.</p>
          <div id="slidesList" class="item-list"></div>
        </div>
      </section>

      <section class="admin-section" data-panel="press">
        <header class="admin-header">
          <h1>Press releases.</h1>
          <p>The first item appears as the featured story on the home page.</p>
        </header>
        <div class="panel">
          <div class="panel-head">
            <h3>All press releases</h3>
            <button class="btn btn-green btn-sm" id="addPress">+ New press release</button>
          </div>
          <div id="pressList" class="item-list"></div>
        </div>
      </section>

      <section class="admin-section" data-panel="leadership">
        <header class="admin-header">
          <h1>Leadership.</h1>
          <p>Update Minister, Minister of State and Permanent Secretary details.</p>
        </header>
        <div class="panel">
          <h3>Honourable Minister of Defence</h3>
          <div class="form-grid">
            <div class="form-row"><label>Name</label><input type="text" id="ministerName" /></div>
            <div class="form-row"><label>Title</label><input type="text" id="ministerTitle" /></div>
            <div class="form-row full"><label>Photo URL</label><input type="text" id="ministerPhoto" /></div>
            <div class="form-row full"><label>Preview</label><div class="photo-preview" id="ministerPreview"></div></div>
          </div>
          <button class="btn btn-green" id="saveMinister">Save</button>
        </div>

        <div class="panel">
          <h3>Honourable Minister of State</h3>
          <div class="form-grid">
            <div class="form-row"><label>Name</label><input type="text" id="mosName" /></div>
            <div class="form-row"><label>Title</label><input type="text" id="mosTitle" /></div>
            <div class="form-row full"><label>Photo URL</label><input type="text" id="mosPhoto" /></div>
            <div class="form-row full"><label>Preview</label><div class="photo-preview" id="mosPreview"></div></div>
          </div>
          <button class="btn btn-green" id="saveMos">Save</button>
        </div>

        <div class="panel">
          <h3>Permanent Secretary</h3>
          <div class="form-grid">
            <div class="form-row"><label>Name</label><input type="text" id="psName" /></div>
            <div class="form-row"><label>Title</label><input type="text" id="psTitle" /></div>
            <div class="form-row full"><label>Photo URL</label><input type="text" id="psPhoto" /></div>
            <div class="form-row full"><label>Preview</label><div class="photo-preview" id="psPreview"></div></div>
          </div>
          <button class="btn btn-green" id="savePs">Save</button>
        </div>
      </section>

      <section class="admin-section" data-panel="newsletter">
        <header class="admin-header">
          <h1>Newsletter.</h1>
          <p>View and manage the subscriber list below.</p>
        </header>
        <div class="panel">
          <div class="panel-head">
            <h3>Subscribers</h3>
            <div>
              <button class="btn btn-outline btn-sm" id="exportSubs">Export CSV</button>
              <button class="btn btn-outline btn-sm" id="addSub">+ Add manually</button>
            </div>
          </div>
          <div id="subsList" class="item-list"></div>
        </div>
      </section>

      <section class="admin-section" data-panel="settings">
        <header class="admin-header">
          <h1>Site settings.</h1>
          <p>Update the ministry footer and metadata shown across the site.</p>
        </header>
        <div class="panel">
          <div class="form-row"><label>Ministry name</label><input type="text" id="setName" /></div>
          <div class="form-row"><label>Country line</label><input type="text" id="setCountry" /></div>
          <div class="form-row"><label>Last reviewed (e.g. May 2026)</label><input type="text" id="setReviewed" /></div>
          <button class="btn btn-green" id="saveSettings">Save settings</button>
        </div>
      </section>

      <section class="admin-section" data-panel="backup">
        <header class="admin-header">
          <h1>Backup & restore.</h1>
          <p>Download or import the site content JSON for migrations or backups.</p>
        </header>
        <div class="panel">
          <h3>Export</h3>
          <p>Download all edits as a single JSON file.</p>
          <button class="btn btn-green" id="exportContent">Download JSON</button>
          <button class="btn btn-outline" id="copyContent">Copy to clipboard</button>
        </div>
        <div class="panel">
          <h3>Import</h3>
          <p>Paste exported JSON below and click Import to overwrite current content.</p>
          <textarea id="importJson" rows="8" placeholder="Paste exported JSON here..."></textarea>
          <div style="display:flex; gap:8px; margin-top:8px;">
            <button class="btn btn-green" id="importContent">Import & overwrite</button>
            <label class="btn btn-outline" style="cursor:pointer;">
              Load from file
              <input type="file" id="importFile" accept="application/json" hidden />
            </label>
          </div>
        </div>
        <div class="panel danger">
          <h3>Reset to defaults</h3>
          <p>Restore the original content and clear database-backed edits.</p>
          <button class="btn" id="resetContent" style="background: var(--red); border-color: var(--red);">Reset everything</button>
        </div>
      </section>
    </main>
  </div>

  <div class="admin-modal" id="adminModal" hidden>
    <div class="admin-modal-card">
      <header class="admin-modal-head">
        <h2 id="modalTitle">Edit item</h2>
        <button class="modal-close" data-close>&times;</button>
      </header>
      <div class="admin-modal-body" id="modalBody"></div>
      <footer class="admin-modal-foot">
        <button class="btn btn-outline" data-close>Cancel</button>
        <button class="btn btn-green" id="modalSave">Save</button>
      </footer>
    </div>
  </div>

  <div class="admin-toast" id="adminToast"></div>

  <script src="../assets/js/realdata.js"></script>
  <script src="../assets/js/contentstore.js"></script>
  <script src="admin.js"></script>
</body>
</html>

