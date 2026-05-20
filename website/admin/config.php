<?php
declare(strict_types=1);

return [
    'db' => [
        'host' => '127.0.0.1',
        'name' => 'fmod_prod',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
    'session_name' => 'fmod_admin_session',
    'csrf_session_key' => 'fmod_admin_csrf_token',
    'admin_session_key' => 'fmod_admin_user',
];
