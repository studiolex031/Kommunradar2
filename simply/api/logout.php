<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/auth.php';

// POST /api/logout
kr_require_method('POST');
kr_require_same_site();
kr_logout();
kr_json(200, ['ok' => true]);
