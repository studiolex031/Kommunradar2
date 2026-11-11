<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/stripe.php';
require_once __DIR__ . '/match.php';

/** Det appen får veta om kontot. */
function kr_account_view(array $user, bool $refreshPlan = false): array
{
    return array_merge(['email' => $user['email'], 'createdAt' => (int) $user['created_at']], kr_user_plan($user, $refreshPlan));
}

function kr_clean_text($value, int $max): ?string
{
    if ($value === null) {
        return '';
    }
    if (!is_string($value)) {
        return null;
    }
    $text = trim(preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value) ?? '');
    return mb_strlen($text, 'UTF-8') > $max ? null : $text;
}

/**
 * Validerar profilen fält för fält och släpper bara igenom det vi känner till.
 * Returnerar null om något fält är ogiltigt.
 */
function kr_clean_profile($input): ?array
{
    if (!is_array($input)) {
        return null;
    }
    $name = kr_clean_text($input['name'] ?? null, 120);
    $company = kr_clean_text($input['company'] ?? null, 160);
    if ($name === null || $company === null) {
        return null;
    }

    $keywords = [];
    $rawKeywords = $input['keywords'] ?? [];
    if (!is_array($rawKeywords)) {
        return null;
    }
    if ($rawKeywords) {
        foreach ($rawKeywords as $keyword) {
            if (!is_string($keyword)) {
                return null;
            }
        }
        $parsed = kr_parse_keywords(implode(',', $rawKeywords));
        if (!$parsed['ok']) {
            return null;
        }
        $keywords = $parsed['keywords'];
    }

    $county = $input['county'] ?? KR_ALL_COUNTIES;
    if (!is_string($county) || ($county !== KR_ALL_COUNTIES && kr_county($county) === null)) {
        return null;
    }

    $saved = [];
    $rawSaved = $input['saved'] ?? [];
    if (!is_array($rawSaved) || count($rawSaved) > 500) {
        return null;
    }
    foreach ($rawSaved as $id) {
        if (!is_string($id) || !preg_match('/^[A-Za-z0-9_\-]{1,80}$/', $id)) {
            return null;
        }
        $saved[$id] = true;
    }

    return ['name' => $name, 'company' => $company, 'keywords' => $keywords, 'county' => $county, 'saved' => array_keys($saved)];
}
