<?php
/**
 * Lokal testserver som efterliknar .htaccess-reglerna:
 *   php -S 127.0.0.1:8090 -t release/login.kommunradar.online simply/dev-router.php
 * Följer inte med i paketet som laddas upp.
 */
$root = $_SERVER['DOCUMENT_ROOT'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (preg_match('#^/api/_#', $path) || preg_match('#^/api/.*\.php$#', $path)) {
    http_response_code(403);
    return true;
}
if (preg_match('#^/api/([a-z-]+)/?$#', $path, $match)) {
    $file = $root . '/api/' . $match[1] . '.php';
    if (is_file($file)) {
        require $file;
        return true;
    }
}
if (strpos($path, '/api/') === 0) {
    http_response_code(404);
    return true;
}
if ($path !== '/' && is_file($root . $path)) {
    return false; // statisk fil
}
header('Content-Type: text/html; charset=utf-8');
readfile($root . '/index.html');
return true;
