<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/ted.php';

// GET /api/tenders – senaste öppna upphandlingarna från TED
kr_require_method('GET');
try {
    $tenders = kr_fetch_tenders();
    header('Cache-Control: public, max-age=300');
    kr_json(200, ['source' => 'ted', 'tenders' => $tenders]);
} catch (Throwable $error) {
    error_log('kommunradar tenders: ' . $error->getMessage());
    kr_json(200, ['source' => 'unavailable', 'tenders' => [], 'error' => 'Kunde inte hämta TED']);
}
