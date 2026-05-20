<?php
declare(strict_types=1);

require_once __DIR__ . '/auth.php';

if (isAdminSignedIn()) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = trim((string) ($_POST['password'] ?? ''));
    $csrfToken = (string) ($_POST['csrf_token'] ?? '');

    if ($password === '' || !validateCsrfToken($csrfToken) || !loginAdmin($password)) {
        $error = 'Invalid password. Please try again.';
    }

    if ($error === '') {
        header('Location: dashboard.php');
        exit;
    }
}
?><!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Admin login · Federal Ministry of Defence</title>
  <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500;600;700;800;900&display=swap" />
  <link rel="stylesheet" href="../assets/css/style.css?v=8" />
  <link rel="stylesheet" href="admin.css" />
</head>
<body class="admin-body">
  <div class="admin-login" id="loginScreen">
    <div class="admin-login-card">
      <div class="admin-brand">
        <img src="../assets/images/coat-of-arms.svg" alt="Federal coat of arms" width="52" height="52" />
        <div>
          <div class="brand-name">Federal Ministry of Defence</div>
          <div class="brand-sub">Secure administration login</div>
        </div>
      </div>
      <h1>Secure admin access</h1>
      <p class="hint">Enter the admin password to sign in.</p>

      <?php if ($error !== ''): ?>
        <div class="error" style="margin-bottom:16px;">
          <?php echo htmlspecialchars($error, ENT_QUOTES, 'UTF-8'); ?>
        </div>
      <?php endif; ?>

      <form method="post" action="index.php" novalidate>
        <label for="password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required autofocus />
        <input type="hidden" name="csrf_token" value="<?php echo htmlspecialchars(getCsrfToken(), ENT_QUOTES, 'UTF-8'); ?>" />
        <button class="btn btn-green" type="submit">Sign in</button>
      </form>
      <a href="../index.html" class="back-link">← Back to public site</a>
    </div>
  </div>
</body>
</html>

