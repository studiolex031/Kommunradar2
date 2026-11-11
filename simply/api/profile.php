<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/auth.php';
require_once __DIR__ . '/_lib/account.php';

// GET /api/profile – hämta profilen · PUT /api/profile {profile} – spara den
$method = kr_require_method('GET', 'PUT');
$user = kr_require_user();

if ($method === 'PUT') {
    kr_require_same_site();
    $profile = kr_clean_profile(kr_body()['profile'] ?? null);
    if ($profile === null) {
        kr_json(400, ['error' => 'Profilen kunde inte sparas – kontrollera fälten.']);
    }
    $now = time();
    kr_db()->prepare('UPDATE kr_users SET profile = ?, profile_updated_at = ? WHERE id = ?')
        ->execute([json_encode($profile, JSON_UNESCAPED_UNICODE), $now, $user['id']]);
    kr_json(200, ['profile' => $profile, 'updatedAt' => $now]);
}

$stored = is_string($user['profile']) ? json_decode($user['profile'], true) : null;
kr_json(200, [
    'profile' => is_array($stored) ? kr_clean_profile($stored) : null,
    'updatedAt' => (int) $user['profile_updated_at'],
]);
