<?php
declare(strict_types=1);

require_once __DIR__ . '/common.php';

$hero = $pdo->query('SELECT eyebrow, headline, body FROM hero WHERE id = 1 LIMIT 1')->fetch();
$slides = $pdo->query('SELECT image_url AS img, tag AS role, caption AS name, alt_text AS alt FROM hero_slides WHERE is_active = 1 ORDER BY position ASC')->fetchAll();
$press = $pdo->query('SELECT slug, published_at AS date, category, title, excerpt, image_url AS img, external_url AS url FROM press_releases ORDER BY is_featured DESC, position ASC, published_at DESC')->fetchAll();
$leadershipRows = $pdo->query('SELECT role, name, title, photo_url FROM leadership')->fetchAll();
$leadership = [
    'minister' => ['name' => '', 'title' => '', 'photo' => ''],
    'ministerOfState' => ['name' => '', 'title' => '', 'photo' => ''],
    'permSec' => ['name' => '', 'title' => '', 'photo' => ''],
];
foreach ($leadershipRows as $row) {
    if ($row['role'] === 'minister') {
        $leadership['minister'] = ['name' => $row['name'], 'title' => $row['title'], 'photo' => $row['photo_url']];
    } elseif ($row['role'] === 'minister_of_state') {
        $leadership['ministerOfState'] = ['name' => $row['name'], 'title' => $row['title'], 'photo' => $row['photo_url']];
    } elseif ($row['role'] === 'permanent_secretary') {
        $leadership['permSec'] = ['name' => $row['name'], 'title' => $row['title'], 'photo' => $row['photo_url']];
    }
}

$settings = [];
foreach ($pdo->query('SELECT setting_key, setting_value FROM site_settings') as $row) {
    $settings[$row['setting_key']] = $row['setting_value'];
}

jsonResponse([
    'hero' => $hero ?: ['eyebrow' => '', 'headline' => '', 'body' => ''],
    'slides' => $slides,
    'press' => $press,
    'leadership' => $leadership,
    'settings' => [
        'lastReviewed' => $settings['lastReviewed'] ?? '',
        'ministryName' => $settings['ministryName'] ?? '',
        'country' => $settings['country'] ?? '',
    ],
]);
