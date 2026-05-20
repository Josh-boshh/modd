<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
require_once __DIR__ . '/../auth.php';

if (!isAdminSignedIn()) {
    http_response_code(403);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $subs = $pdo->query('SELECT email, subscribed_at FROM subscribers ORDER BY subscribed_at DESC')->fetchAll();
    jsonResponse(['subscribers' => $subs]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Only GET and POST are allowed', 405);
}

$data = parseJsonBody();
$action = $data['action'] ?? '';
$email = trim((string) ($data['email'] ?? ''));
if ($email === '') {
    jsonError('Email is required', 400);
}

if ($action === 'remove') {
    $delete = $pdo->prepare('DELETE FROM subscribers WHERE email = :email');
    $delete->execute([':email' => $email]);
    jsonResponse(['success' => true]);
}

$insert = $pdo->prepare('INSERT INTO subscribers (email, subscribed_at) VALUES (:email, NOW())');
try {
    $insert->execute([':email' => $email]);
    jsonResponse(['success' => true]);
} catch (PDOException $exception) {
    if ($exception->errorInfo[1] === 1062) {
        jsonResponse(['success' => false, 'message' => 'Subscriber already exists']);
    }
    jsonError('Unable to save subscriber', 500);
}
