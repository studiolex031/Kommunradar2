<?php
declare(strict_types=1);

/** Små hjälpfunktioner för utgående HTTP-anrop (TED, Stripe, Resend). */

function kr_curl(string $method, string $url, $body, array $headers, int $timeout)
{
    $handle = curl_init($url);
    $allHeaders = array_merge(['Accept: application/json'], $headers);
    $options = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_FOLLOWLOCATION => false,
    ];
    if (is_array($body)) {
        $allHeaders[] = 'Content-Type: application/json';
        $options[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_UNICODE);
    }
    $options[CURLOPT_HTTPHEADER] = $allHeaders;
    curl_setopt_array($handle, $options);
    return $handle;
}

/** @return array{status:int, json:mixed} status 0 = inget svar */
function kr_http_request(string $method, string $url, $body = null, array $headers = [], int $timeout = 9): array
{
    $handle = kr_curl($method, $url, $body, $headers, $timeout);
    $raw = curl_exec($handle);
    $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    curl_close($handle);
    return ['status' => $raw === false ? 0 : $status, 'json' => is_string($raw) ? json_decode($raw, true) : null];
}

/**
 * Flera POST-anrop parallellt mot samma adress.
 * @param array<int, array> $bodies
 * @return array<int, array{status:int, json:mixed}>
 */
function kr_http_post_many(string $url, array $bodies, int $timeout = 9): array
{
    if (!$bodies) {
        return [];
    }
    $multi = curl_multi_init();
    $handles = [];
    foreach ($bodies as $key => $body) {
        $handles[$key] = kr_curl('POST', $url, $body, [], $timeout);
        curl_multi_add_handle($multi, $handles[$key]);
    }
    do {
        $state = curl_multi_exec($multi, $running);
        if ($running) {
            curl_multi_select($multi, 1.0);
        }
    } while ($running && $state === CURLM_OK);

    $results = [];
    foreach ($handles as $key => $handle) {
        $raw = curl_multi_getcontent($handle);
        $status = (int) curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
        $results[$key] = ['status' => $status, 'json' => is_string($raw) && $raw !== '' ? json_decode($raw, true) : null];
        curl_multi_remove_handle($multi, $handle);
        curl_close($handle);
    }
    curl_multi_close($multi);
    return $results;
}
