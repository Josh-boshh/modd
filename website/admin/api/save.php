<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';
require_once __DIR__ . '/../auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Only POST requests are allowed', 405);
}

$data = parseJsonBody();
$csrfToken = (string) ($data['csrf_token'] ?? '');
$blob = $data['blob'] ?? null;

if (!validateCsrfToken($csrfToken) || !isAdminSignedIn()) {
    jsonError('Authentication failed', 403);
}

if (!is_array($blob)) {
    jsonError('Invalid content payload', 400);
}

try {
    $pdo->beginTransaction();

    $hero = $blob['hero'] ?? [];
    $stmtHero = $pdo->prepare('INSERT INTO hero (id, eyebrow, headline, body) VALUES (1, :eyebrow, :headline, :body) ON DUPLICATE KEY UPDATE eyebrow = :eyebrow, headline = :headline, body = :body');
    $stmtHero->execute([
        ':eyebrow' => $hero['eyebrow'] ?? '',
        ':headline' => $hero['headline'] ?? '',
        ':body' => $hero['body'] ?? '',
    ]);

    $pdo->exec('DELETE FROM hero_slides');
    $insertSlide = $pdo->prepare('INSERT INTO hero_slides (position, image_url, tag, caption, alt_text, is_active) VALUES (:position, :image_url, :tag, :caption, :alt_text, 1)');
    foreach ($blob['slides'] ?? [] as $position => $slide) {
        $insertSlide->execute([
            ':position' => $position,
            ':image_url' => $slide['img'] ?? '',
            ':tag' => $slide['role'] ?? '',
            ':caption' => $slide['name'] ?? '',
            ':alt_text' => $slide['alt'] ?? '',
        ]);
    }

    $pdo->exec('DELETE FROM press_releases');
    $insertPress = $pdo->prepare('INSERT INTO press_releases (slug, published_at, category, title, excerpt, image_url, external_url, is_featured, position) VALUES (:slug, :published_at, :category, :title, :excerpt, :image_url, :external_url, 0, :position)');
    foreach ($blob['press'] ?? [] as $position => $press) {
        $slug = trim((string) ($press['slug'] ?? '')) ?: preg_replace('/[^a-z0-9]+/i', '-', strtolower(trim($press['title'] ?? 'untitled'))) . '-' . ($position + 1);
        $insertPress->execute([
            ':slug' => substr($slug, 0, 120),
            ':published_at' => $press['date'] ?? date('Y-m-d'),
            ':category' => $press['category'] ?? 'Press Office',
            ':title' => $press['title'] ?? '',
            ':excerpt' => $press['excerpt'] ?? '',
            ':image_url' => $press['img'] ?? '',
            ':external_url' => $press['url'] ?? '',
            ':position' => $position,
        ]);
    }

    $upsertLeadership = $pdo->prepare('INSERT INTO leadership (role, name, title, photo_url) VALUES (:role, :name, :title, :photo_url) ON DUPLICATE KEY UPDATE name = :name, title = :title, photo_url = :photo_url');
    $leadership = $blob['leadership'] ?? [];
    $rows = [
        ['role' => 'minister', 'data' => $leadership['minister'] ?? []],
        ['role' => 'minister_of_state', 'data' => $leadership['ministerOfState'] ?? []],
        ['role' => 'permanent_secretary', 'data' => $leadership['permSec'] ?? []],
    ];
    foreach ($rows as $row) {
        $upsertLeadership->execute([
            ':role' => $row['role'],
            ':name' => $row['data']['name'] ?? '',
            ':title' => $row['data']['title'] ?? '',
            ':photo_url' => $row['data']['photo'] ?? '',
        ]);
    }

    $settings = $blob['settings'] ?? [];
    $upsertSetting = $pdo->prepare('INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value) ON DUPLICATE KEY UPDATE setting_value = :value');
    foreach (['ministryName', 'country', 'lastReviewed'] as $key) {
        $upsertSetting->execute([
            ':key' => $key,
            ':value' => $settings[$key] ?? '',
        ]);
    }

    $pdo->commit();
    jsonResponse(['success' => true]);
} catch (Throwable $ex) {
    $pdo->rollBack();
    jsonError('Unable to save content: ' . $ex->getMessage(), 500);
}
