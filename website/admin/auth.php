<?php
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

define('ADMIN_SESSION_NAME', $config['session_name']);
define('ADMIN_SESSION_KEY', $config['admin_session_key']);
define('CSRF_SESSION_KEY', $config['csrf_session_key']);

if (session_status() === PHP_SESSION_NONE) {
    session_name(ADMIN_SESSION_NAME);
    session_start();
}

$pdo = require __DIR__ . '/db.php';

function isAdminSignedIn(): bool
{
    return !empty($_SESSION[ADMIN_SESSION_KEY]);
}

function getAdminUser(): ?array
{
    return $_SESSION[ADMIN_SESSION_KEY] ?? null;
}

function loginAdmin(string $password): bool
{
    global $pdo;

    $stmt = $pdo->prepare('SELECT id, email, display_name, password_hash, role FROM admin_users WHERE is_active = 1 ORDER BY id ASC LIMIT 1');
    $stmt->execute();
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        return false;
    }

    $_SESSION[ADMIN_SESSION_KEY] = [
        'id' => (int) $user['id'],
        'email' => $user['email'],
        'display_name' => $user['display_name'] ?: 'Admin',
        'role' => $user['role'],
    ];

    $update = $pdo->prepare('UPDATE admin_users SET last_login_at = NOW() WHERE id = :id');
    $update->execute([':id' => $user['id']]);

    return true;
}

function requireAdmin(): void
{
    if (!isAdminSignedIn()) {
        header('Location: index.php');
        exit;
    }
}

function getCsrfToken(): string
{
    if (empty($_SESSION[CSRF_SESSION_KEY])) {
        $_SESSION[CSRF_SESSION_KEY] = bin2hex(random_bytes(16));
    }

    return $_SESSION[CSRF_SESSION_KEY];
}

function validateCsrfToken(string $token): bool
{
    return !empty($_SESSION[CSRF_SESSION_KEY]) && hash_equals($_SESSION[CSRF_SESSION_KEY], $token);
}

function abortJson(int $status, string $message): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}
