<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/auth.php';
require_once __DIR__ . '/_lib/account.php';

// POST /api/auth-verify {email, code} – loggar in (och skapar kontot första gången)
kr_require_method('POST');
kr_require_same_site();
$body = kr_body();
$email = kr_normalize_email($body['email'] ?? null);
$code = is_string($body['code'] ?? null) ? preg_replace('/\s+/', '', $body['code']) : '';
if ($email === null || !preg_match('/^\d{6}$/', $code)) {
    kr_json(400, ['error' => 'Ange e-postadressen och den sexsiffriga koden.']);
}
$userId = kr_verify_code($email, $code);
if ($userId === null) {
    kr_json(401, ['error' => 'Koden är fel eller har gått ut. Be om en ny kod.']);
}
kr_start_session($userId);
$find = kr_db()->prepare('SELECT * FROM kr_users WHERE id = ?');
$find->execute([$userId]);
kr_json(200, ['account' => kr_account_view($find->fetch())]);
