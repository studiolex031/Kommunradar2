<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/auth.php';

// POST /api/auth-request {email} – mejlar en engångskod
kr_require_method('POST');
kr_require_same_site();
$email = kr_normalize_email(kr_body()['email'] ?? null);
if ($email === null) {
    kr_json(400, ['error' => 'Ange en giltig e-postadress.']);
}
kr_request_code($email);
kr_json(200, ['ok' => true]);
