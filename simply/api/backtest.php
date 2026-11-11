<?php
declare(strict_types=1);
require_once __DIR__ . '/_lib/ted.php';

// GET /api/backtest?ord=städ,lokalvård&lan=skane
kr_require_method('GET');

$rawKeywords = kr_query('ord');
if (strlen($rawKeywords) > 800) {
    kr_json(400, ['error' => 'För många sökord.']);
}
$parsed = kr_parse_keywords($rawKeywords);
if (!$parsed['ok']) {
    kr_json(400, ['error' => $parsed['error']]);
}
$county = kr_query('lan') ?: KR_ALL_COUNTIES;
if ($county !== KR_ALL_COUNTIES && kr_county($county) === null) {
    kr_json(400, ['error' => 'Okänt län.']);
}

try {
    $result = kr_run_backtest($parsed['keywords'], $county);
} catch (Throwable $error) {
    // Inget påhittat resultat om TED inte svarar – sidan visar felet i stället.
    error_log('kommunradar backtest: ' . $error->getMessage());
    kr_json(502, ['error' => 'TED svarar inte just nu. Försök igen om en stund.']);
}
header('Cache-Control: public, max-age=600');
kr_json(200, array_merge(['keywords' => $parsed['keywords'], 'county' => $county], $result));
