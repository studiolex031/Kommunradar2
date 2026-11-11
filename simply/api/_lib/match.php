<?php
declare(strict_types=1);

/**
 * Deterministisk matchning för "Missade uppdrag" – PHP-versionen av server/match.ts.
 * Länslistan (counties.json) är samma fil som TypeScript-versionen använder och
 * kopieras hit av byggskriptet, så de två kan inte glida isär.
 */

const KR_ALL_COUNTIES = 'alla';
const KR_MIN_KEYWORD = 3;
const KR_MAX_KEYWORD = 40;
const KR_MAX_KEYWORDS = 8;

function kr_counties(): array
{
    static $counties = null;
    if ($counties === null) {
        $counties = json_decode((string) file_get_contents(__DIR__ . '/counties.json'), true);
        if (!is_array($counties) || !$counties) {
            throw new RuntimeException('counties.json saknas eller är trasig');
        }
    }
    return $counties;
}

function kr_county(string $id): ?array
{
    foreach (kr_counties() as $county) {
        if ($county['id'] === $id) {
            return $county;
        }
    }
    return null;
}

function kr_county_by_nuts(string $code): ?array
{
    foreach (kr_counties() as $county) {
        if ($county['nuts'] === $code) {
            return $county;
        }
    }
    return null;
}

/** @return array{ok:bool, keywords?:string[], error?:string} */
function kr_parse_keywords(string $raw): array
{
    $unique = [];
    foreach (preg_split('/[,;\n]/u', $raw) ?: [] as $part) {
        $keyword = preg_replace('/\s+/u', ' ', mb_strtolower(trim($part), 'UTF-8'));
        if ($keyword !== '' && !in_array($keyword, $unique, true)) {
            $unique[] = $keyword;
        }
    }
    if (!$unique) {
        return ['ok' => false, 'error' => 'Ange minst ett sökord.'];
    }
    if (count($unique) > KR_MAX_KEYWORDS) {
        return ['ok' => false, 'error' => 'Ange högst ' . KR_MAX_KEYWORDS . ' sökord.'];
    }
    foreach ($unique as $keyword) {
        $length = mb_strlen($keyword, 'UTF-8');
        if ($length < KR_MIN_KEYWORD) {
            return ['ok' => false, 'error' => "\"{$keyword}\" är för kort – använd minst " . KR_MIN_KEYWORD . ' tecken per sökord.'];
        }
        if ($length > KR_MAX_KEYWORD) {
            return ['ok' => false, 'error' => 'Sökord får vara högst ' . KR_MAX_KEYWORD . ' tecken.'];
        }
        if (!preg_match('/^[\p{L}\p{N} \-&\/]+$/u', $keyword)) {
            return ['ok' => false, 'error' => "\"{$keyword}\" innehåller tecken som inte stöds."];
        }
    }
    return ['ok' => true, 'keywords' => $unique];
}

function kr_snippet(string $text, int $index, int $length): string
{
    $total = mb_strlen($text, 'UTF-8');
    $start = max(0, $index - 40);
    $end = min($total, $index + $length + 60);
    $body = trim(preg_replace('/\s+/u', ' ', mb_substr($text, $start, $end - $start, 'UTF-8')));
    return ($start > 0 ? '…' : '') . $body . ($end < $total ? '…' : '');
}

function kr_match_keywords(array $notice, array $keywords): array
{
    $reasons = [];
    $fields = ['titel' => $notice['title'], 'beskrivning' => $notice['description']];
    foreach ($keywords as $keyword) {
        foreach ($fields as $field => $text) {
            $index = mb_strpos(mb_strtolower($text, 'UTF-8'), $keyword, 0, 'UTF-8');
            if ($index !== false) {
                $reasons[] = ['keyword' => $keyword, 'field' => $field, 'snippet' => kr_snippet($text, $index, mb_strlen($keyword, 'UTF-8'))];
                break; // ett skäl per sökord räcker; titel går före beskrivning
            }
        }
    }
    return $reasons;
}

function kr_has_word(string $haystack, string $word): bool
{
    $from = 0;
    $wordLength = mb_strlen($word, 'UTF-8');
    while (true) {
        $index = mb_strpos($haystack, $word, $from, 'UTF-8');
        if ($index === false) {
            return false;
        }
        $before = $index === 0 ? '' : mb_substr($haystack, $index - 1, 1, 'UTF-8');
        // Ortnamn får följas av genitiv-s ("Lunds kommun") men inte stå mitt i ett annat ord.
        $after = preg_replace('/^s(?![\p{L}])/u', '', mb_substr($haystack, $index + $wordLength, null, 'UTF-8'));
        $beforeOk = $before === '' || !preg_match('/[\p{L}\p{N}]/u', $before);
        $afterOk = $after === '' || !preg_match('/^[\p{L}\p{N}]/u', $after);
        if ($beforeOk && $afterOk) {
            return true;
        }
        $from = $index + 1;
    }
}

function kr_county_from_text(string $text): ?array
{
    $hay = mb_strtolower($text, 'UTF-8');
    if (trim($hay) === '') {
        return null;
    }
    $found = [];
    foreach (kr_counties() as $county) {
        foreach ($county['places'] as $place) {
            if (kr_has_word($hay, $place)) {
                $found[] = $county;
                break;
            }
        }
    }
    // Flera olika län i samma text = tvetydigt. Hellre "okänt" än en gissning.
    return count($found) === 1 ? $found[0] : null;
}

function kr_resolve_county(array $notice): array
{
    $byNuts = [];
    foreach (array_unique($notice['placeCodes']) as $code) {
        if (preg_match('/^SE\d{3}$/', $code) && ($county = kr_county_by_nuts($code))) {
            $byNuts[] = $county;
        }
    }
    if ($byNuts) {
        $names = array_map(fn ($county) => "{$county['name']} ({$county['nuts']})", $byNuts);
        return ['status' => 'confirmed', 'countyId' => $byNuts[0]['id'], 'via' => 'utförandeort', 'detail' => 'Utförandeort ' . implode(', ', $names)];
    }
    if ($byCity = kr_county_from_text($notice['city'])) {
        return ['status' => 'confirmed', 'countyId' => $byCity['id'], 'via' => 'ort', 'detail' => 'Upphandlarens ort: ' . $notice['city']];
    }
    if ($byBuyer = kr_county_from_text($notice['buyer'])) {
        return ['status' => 'confirmed', 'countyId' => $byBuyer['id'], 'via' => 'upphandlare', 'detail' => 'Upphandlare: ' . $notice['buyer']];
    }
    return ['status' => 'unknown', 'detail' => 'Annonsen anger inget län som går att avgöra säkert'];
}

function kr_confirmed_county_ids(array $notice, array $primary): array
{
    $ids = [];
    foreach ($notice['placeCodes'] as $code) {
        if ($county = kr_county_by_nuts($code)) {
            $ids[$county['id']] = true;
        }
    }
    if ($ids) {
        return array_keys($ids);
    }
    return $primary['status'] === 'confirmed' ? [$primary['countyId']] : [];
}

/** @return array{hits: array, unknownCounty: array} */
function kr_match_notices(array $notices, array $keywords, string $countyId): array
{
    $hits = [];
    $unknown = [];
    foreach ($notices as $notice) {
        $reasons = kr_match_keywords($notice, $keywords);
        if (!$reasons) {
            continue;
        }
        $county = kr_resolve_county($notice);
        if ($countyId === KR_ALL_COUNTIES) {
            $hits[] = ['notice' => $notice, 'keywords' => $reasons, 'county' => $county];
            continue;
        }
        $ids = kr_confirmed_county_ids($notice, $county);
        if (in_array($countyId, $ids, true)) {
            $wanted = kr_county($countyId);
            if ($county['status'] === 'confirmed' && $county['countyId'] !== $countyId && $wanted) {
                $county = ['status' => 'confirmed', 'countyId' => $countyId, 'via' => 'utförandeort', 'detail' => "Utförandeort {$wanted['name']} ({$wanted['nuts']})"];
            }
            $hits[] = ['notice' => $notice, 'keywords' => $reasons, 'county' => $county];
        } elseif (!$ids) {
            $unknown[] = ['notice' => $notice, 'keywords' => $reasons, 'county' => $county];
        }
    }
    $newest = fn ($a, $b) => strcmp($b['notice']['posted'], $a['notice']['posted']);
    usort($hits, $newest);
    usort($unknown, $newest);
    return ['hits' => $hits, 'unknownCounty' => $unknown];
}
