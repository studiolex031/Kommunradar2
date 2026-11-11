<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/auth.php';
require_once __DIR__ . '/_lib/account.php';

// GET /api/me – vem är inloggad? ?uppdatera=1 hämtar betalstatus från Stripe direkt
kr_require_method('GET');
$user = kr_current_user();
kr_json(200, ['account' => $user === null ? null : kr_account_view($user, kr_query('uppdatera') === '1')]);
