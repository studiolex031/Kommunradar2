<?php
declare(strict_types=1);

/**
 * Hämtning från TED – PHP-versionen av server/ted.ts och server/backtest.ts.
 * Användarens sökord skickas aldrig till TED; frågan innehåller bara land,
 * annonstyp och datum. Svaren cachas som filer i api/_data.
 */

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/http.php';
require_once __DIR__ . '/match.php';

const KR_TED_PAGE_SIZE = 250;
const KR_TED_MAX_PAGES = 8;
const KR_TED_WINDOW_DAYS = 30;
const KR_TED_BASE_FIELDS = [
    'publication-number', 'notice-title', 'buyer-name', 'estimated-value', 'deadline-receipt-tenders',
    'buyer-city', 'classification-cpv', 'description-proc', 'publication-date', 'links',
];

const KR_CITY_MAP = [
    'stockholm' => ['stockholm', 'Stockholm', 'Stockholm'],
    'gothenburg' => ['gothenburg', 'Göteborg', 'Västra Götaland'],
    'göteborg' => ['gothenburg', 'Göteborg', 'Västra Götaland'],
    'malmö' => ['malmo', 'Malmö', 'Skåne'],
    'malmo' => ['malmo', 'Malmö', 'Skåne'],
    'uppsala' => ['uppsala', 'Uppsala', 'Uppsala'],
    'västerås' => ['vasteras', 'Västerås', 'Västmanland'],
    'örebro' => ['orebro', 'Örebro', 'Örebro'],
    'linköping' => ['linkoping', 'Linköping', 'Östergötland'],
    'helsingborg' => ['helsingborg', 'Helsingborg', 'Skåne'],
    'jönköping' => ['jonkoping', 'Jönköping', 'Jönköpings län'],
    'umeå' => ['umea', 'Umeå', 'Västerbotten'],
    'luleå' => ['lulea', 'Luleå', 'Norrbotten'],
    'lund' => ['lund', 'Lund', 'Skåne'],
    'karlstad' => ['karlstad', 'Karlstad', 'Värmland'],
    'gävle' => ['gavle', 'Gävle', 'Gävleborg'],
    'sundsvall' => ['sundsvall', 'Sundsvall', 'Västernorrland'],
    'visby' => ['visby', 'Region Gotland', 'Gotland'],
    'kalmar' => ['kalmar', 'Kalmar', 'Kalmar län'],
];

function kr_pick_string($value): string
{
    if (is_string($value)) {
        return $value;
    }
    if (is_array($value) && $value) {
        if (array_is_list($value)) {
            return kr_pick_string($value[0]);
        }
        return kr_pick_string($value['swe'] ?? $value['eng'] ?? $value['sv'] ?? $value['en'] ?? reset($value));
    }
    return '';
}

function kr_pick_number($value): float
{
    if (is_int($value) || is_float($value)) {
        return is_finite((float) $value) ? (float) $value : 0.0;
    }
    if (is_string($value)) {
        $clean = str_replace(',', '.', preg_replace('/\s/u', '', $value));
        return is_numeric($clean) ? (float) $clean : 0.0;
    }
    if (is_array($value) && $value) {
        return kr_pick_number($value['amount'] ?? $value['value'] ?? reset($value));
    }
    return 0.0;
}

function kr_category_from_cpv(string $cpv): string
{
    $code = substr($cpv, 0, 2);
    if (in_array($code, ['48', '72', '30', '32', '64'], true)) return 'IT & Digitalisering';
    if (in_array($code, ['45', '71', '44'], true)) return 'Bygg & Fastighet';
    if (in_array($code, ['90', '77', '03', '14'], true)) return 'Mark & Miljö';
    if (in_array($code, ['85', '33'], true)) return 'Hälsa & Omsorg';
    if ($code === '80') return 'Utbildning';
    return 'Övrigt';
}

function kr_collect_strings($value, array &$out): void
{
    if (is_string($value)) {
        $out[] = strtoupper(trim($value));
    } elseif (is_array($value)) {
        foreach ($value as $item) {
            kr_collect_strings($item, $out);
        }
    }
}

function kr_source_url(array $raw, string $id, string $lang): string
{
    $links = is_array($raw['links'] ?? null) ? $raw['links'] : [];
    return kr_pick_string($links['html'] ?? null)
        ?: kr_pick_string($links['pdf'] ?? null)
        ?: "https://ted.europa.eu/{$lang}/notice/-/detail/" . rawurlencode($id);
}

function kr_cache_read(string $name, int $maxAge): ?array
{
    $file = kr_data_path($name);
    if (!is_file($file) || time() - (int) filemtime($file) > $maxAge) {
        return null;
    }
    $data = json_decode((string) file_get_contents($file), true);
    return is_array($data) ? $data : null;
}

function kr_cache_write(string $name, array $data): void
{
    $file = kr_data_path($name);
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    if (@file_put_contents($tmp, json_encode($data, JSON_UNESCAPED_UNICODE), LOCK_EX) !== false) {
        @rename($tmp, $file);
    }
}

// ---------------------------------------------------------------- /api/tenders

function kr_status_from_deadline(string $deadline): string
{
    if ($deadline === '') {
        return 'open';
    }
    $days = (int) ceil((strtotime($deadline) - time()) / 86400);
    if ($days < 0) return 'closed';
    if ($days <= 7) return 'closing-soon';
    return 'open';
}

function kr_resolve_place(string $city, string $buyer): array
{
    $hay = mb_strtolower($city . ' ' . $buyer, 'UTF-8');
    foreach (KR_CITY_MAP as $key => [$id, $name, $region]) {
        if (mb_strpos($hay, $key, 0, 'UTF-8') !== false) {
            return ['id' => $id, 'name' => $name, 'region' => $region];
        }
    }
    return ['id' => 'sweden', 'name' => $city ?: 'Sverige', 'region' => 'Övriga Sverige'];
}

/** De 40 senaste öppna annonserna, i samma form som appens Tender-typ. Kastar vid fel. */
function kr_fetch_tenders(): array
{
    $cached = kr_cache_read('cache-tenders.json', 900);
    if ($cached !== null) {
        return $cached;
    }
    $response = kr_http_request('POST', kr_config()['ted_url'], [
        'query' => 'buyer-country = SWE AND notice-type = cn-standard',
        'fields' => KR_TED_BASE_FIELDS,
        'page' => 1,
        'limit' => 40,
        'scope' => 'ACTIVE',
        'paginationMode' => 'PAGE_NUMBER',
    ]);
    if ($response['status'] !== 200 || !is_array($response['json'])) {
        throw new RuntimeException('TED ' . $response['status']);
    }
    $tenders = [];
    foreach (($response['json']['notices'] ?? []) as $index => $notice) {
        $id = kr_pick_string($notice['publication-number'] ?? null) ?: "ted-{$index}";
        $title = kr_pick_string($notice['notice-title'] ?? null) ?: 'Upphandling utan titel';
        $buyer = kr_pick_string($notice['buyer-name'] ?? null) ?: 'Offentlig upphandlare';
        $place = kr_resolve_place(kr_pick_string($notice['buyer-city'] ?? null), $buyer);
        $category = kr_category_from_cpv(kr_pick_string($notice['classification-cpv'] ?? null));
        $description = kr_pick_string($notice['description-proc'] ?? null) ?: "{$title}. Upphandlande myndighet: {$buyer}.";
        $posted = substr(kr_pick_string($notice['publication-date'] ?? null), 0, 10);
        $deadline = substr(kr_pick_string($notice['deadline-receipt-tenders'] ?? null), 0, 10);
        $tenders[] = [
            'id' => "ted-{$id}",
            'title' => $title,
            'municipalityId' => $place['id'],
            'municipalityName' => $place['name'],
            'region' => $place['region'],
            'category' => $category,
            'value' => kr_pick_number($notice['estimated-value'] ?? null),
            'deadline' => $deadline ?: $posted,
            'posted' => $posted,
            'status' => kr_status_from_deadline($deadline),
            'description' => $description,
            'summary' => mb_substr($description, 0, 280, 'UTF-8'),
            'keywords' => array_values(array_filter([$place['name'], $category, 'TED', 'LOU'])),
            'priority' => 7,
            'sourceUrl' => kr_source_url($notice, $id, 'en'),
            'buyer' => $buyer,
            'source' => 'ted',
        ];
    }
    kr_cache_write('cache-tenders.json', $tenders);
    return $tenders;
}

// --------------------------------------------------------------- /api/backtest

function kr_to_notice(array $raw, int $index): array
{
    $id = kr_pick_string($raw['publication-number'] ?? null) ?: "okänd-{$index}";
    $codes = [];
    kr_collect_strings($raw['place-of-performance'] ?? null, $codes);
    return [
        'id' => $id,
        'title' => kr_pick_string($raw['notice-title'] ?? null) ?: 'Upphandling utan titel',
        'description' => kr_pick_string($raw['description-proc'] ?? null),
        'buyer' => kr_pick_string($raw['buyer-name'] ?? null),
        'city' => kr_pick_string($raw['buyer-city'] ?? null),
        'placeCodes' => $codes,
        'posted' => substr(kr_pick_string($raw['publication-date'] ?? null), 0, 10),
        'deadline' => substr(kr_pick_string($raw['deadline-receipt-tenders'] ?? null), 0, 10),
        'value' => kr_pick_number($raw['estimated-value'] ?? null),
        'category' => kr_category_from_cpv(kr_pick_string($raw['classification-cpv'] ?? null)),
        'sourceUrl' => kr_source_url($raw, $id, 'sv'),
    ];
}

function kr_ted_body(string $query, array $variant, int $page): array
{
    return [
        'query' => $query,
        'fields' => $variant['placeField'] ? array_merge(KR_TED_BASE_FIELDS, ['place-of-performance']) : KR_TED_BASE_FIELDS,
        'page' => $page,
        'limit' => KR_TED_PAGE_SIZE,
        'scope' => $variant['scope'],
        'paginationMode' => 'PAGE_NUMBER',
    ];
}

/** 30-dagarsfönstret, cachat i 30 minuter. Kastar om TED inte svarar – aldrig påhittat innehåll. */
function kr_fetch_window(): array
{
    $cached = kr_cache_read('cache-window.json', 1800);
    if ($cached !== null && ($cached['to'] ?? '') === gmdate('Y-m-d')) {
        return $cached;
    }
    $now = time();
    $from = gmdate('Y-m-d', $now - KR_TED_WINDOW_DAYS * 86400);
    $query = 'buyer-country = SWE AND notice-type = cn-standard AND publication-date >= ' . str_replace('-', '', $from);
    $url = kr_config()['ted_url'];
    // Prövas i ordning. Vilken variant som användes redovisas i svaret – aldrig tyst.
    $variants = [
        ['scope' => 'ALL', 'placeField' => true],
        ['scope' => 'ALL', 'placeField' => false],
        ['scope' => 'ACTIVE', 'placeField' => false],
    ];
    $lastStatus = 0;
    foreach ($variants as $variant) {
        $first = kr_http_request('POST', $url, kr_ted_body($query, $variant, 1));
        $lastStatus = $first['status'];
        if ($first['status'] !== 200 || !is_array($first['json'])) {
            continue;
        }
        $rawNotices = $first['json']['notices'] ?? [];
        $total = is_int($first['json']['totalNoticeCount'] ?? null) ? $first['json']['totalNoticeCount'] : count($rawNotices);
        $pageCount = min(KR_TED_MAX_PAGES, max(1, (int) ceil($total / KR_TED_PAGE_SIZE)));
        $bodies = [];
        for ($page = 2; $page <= $pageCount; $page++) {
            $bodies[$page] = kr_ted_body($query, $variant, $page);
        }
        $failed = false;
        foreach (kr_http_post_many($url, $bodies) as $result) {
            if ($result['status'] !== 200 || !is_array($result['json'])) {
                $failed = true;
                $lastStatus = $result['status'];
                break;
            }
            $rawNotices = array_merge($rawNotices, $result['json']['notices'] ?? []);
        }
        if ($failed) {
            continue;
        }
        $notices = [];
        foreach ($rawNotices as $index => $raw) {
            $notice = kr_to_notice($raw, $index);
            $notices[$notice['id']] = $notice; // samma annons en gång
        }
        $window = [
            'from' => $from,
            'to' => gmdate('Y-m-d', $now),
            'notices' => array_values($notices),
            'total' => $total,
            'truncated' => $total > count($notices),
            'scope' => $variant['scope'],
            'hasPlaceOfPerformance' => $variant['placeField'],
        ];
        kr_cache_write('cache-window.json', $window);
        return $window;
    }
    throw new RuntimeException('TED ' . $lastStatus);
}

function kr_present_hit(array $hit, int $now): array
{
    $notice = $hit['notice'];
    $daysLeft = $notice['deadline'] !== ''
        ? (int) ceil((strtotime($notice['deadline'] . 'T23:59:59Z') - $now) / 86400)
        : null;
    return [
        'id' => $notice['id'],
        'title' => $notice['title'],
        'buyer' => $notice['buyer'],
        'category' => $notice['category'],
        'posted' => $notice['posted'],
        'deadline' => $notice['deadline'],
        'daysLeft' => $daysLeft,
        'open' => $daysLeft !== null && $daysLeft >= 0,
        'value' => $notice['value'],
        'sourceUrl' => $notice['sourceUrl'],
        'keywords' => $hit['keywords'],
        'county' => $hit['county'],
    ];
}

function kr_run_backtest(array $keywords, string $countyId): array
{
    $window = kr_fetch_window();
    $result = kr_match_notices($window['notices'], $keywords, $countyId);
    $now = time();
    $present = fn ($hit) => kr_present_hit($hit, $now);
    return [
        'from' => $window['from'],
        'to' => $window['to'],
        'scanned' => count($window['notices']),
        'truncated' => $window['truncated'],
        'includesClosed' => $window['scope'] === 'ALL',
        'usesPlaceOfPerformance' => $window['hasPlaceOfPerformance'],
        'hits' => array_map($present, array_slice($result['hits'], 0, 100)),
        'unknownCounty' => array_map($present, array_slice($result['unknownCounty'], 0, 100)),
    ];
}
