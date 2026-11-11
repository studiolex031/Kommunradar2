<?php
declare(strict_types=1);

/**
 * Gemensam start för alla API-filer på login.kommunradar.online.
 * Laddar inställningar, databasen och hjälpfunktioner för svar och skydd.
 */

error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

const KR_LIB = __DIR__;
const KR_DATA = __DIR__ . '/../_data';
const KR_SESSION_COOKIE = 'kr_session';
const KR_SESSION_DAYS = 30;
const KR_MAX_BODY = 65536;

set_exception_handler(function (Throwable $error): void {
    error_log('kommunradar: ' . get_class($error) . ': ' . $error->getMessage() . ' @ ' . $error->getFile() . ':' . $error->getLine());
    kr_json(500, ['error' => 'Något gick fel. Försök igen om en stund.']);
});

/** @return never */
function kr_json(int $status, array $data): void
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        if (!kr_has_header('Cache-Control')) {
            header('Cache-Control: no-store');
        }
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function kr_has_header(string $name): bool
{
    foreach (headers_list() as $line) {
        if (stripos($line, $name . ':') === 0) {
            return true;
        }
    }
    return false;
}

function kr_config(): array
{
    static $config = null;
    if ($config === null) {
        $defaults = [
            'db_dsn' => '',
            'db_user' => '',
            'db_pass' => '',
            'mail_transport' => 'mail', // 'mail' (webbhotellets egen), 'resend' eller 'log' (endast test)
            'mail_from' => 'Kommunradar <hej@kommunradar.online>',
            'resend_api_key' => '',
            'stripe_secret_key' => '',
            'stripe_api_base' => 'https://api.stripe.com',
            'ted_url' => 'https://api.ted.europa.eu/v3/notices/search',
        ];
        $file = KR_LIB . '/config.php';
        $config = array_merge($defaults, is_file($file) ? (array) require $file : []);
    }
    return $config;
}

function kr_data_path(string $name): string
{
    if (!is_dir(KR_DATA) && !@mkdir(KR_DATA, 0700, true)) {
        throw new RuntimeException('Kan inte skapa datamappen api/_data');
    }
    return KR_DATA . '/' . $name;
}

/** Hemlig nyckel för kod- och IP-hashar. Skapas automatiskt första gången. */
function kr_secret(): string
{
    static $secret = null;
    if ($secret === null) {
        $file = kr_data_path('secret.php');
        if (!is_file($file)) {
            $value = bin2hex(random_bytes(32));
            if (@file_put_contents($file, "<?php return '" . $value . "';\n", LOCK_EX) === false) {
                throw new RuntimeException('Mappen api/_data är inte skrivbar');
            }
            @chmod($file, 0600);
        }
        $secret = (string) require $file;
        if (strlen($secret) < 32) {
            throw new RuntimeException('Ogiltig hemlig nyckel i api/_data/secret.php');
        }
    }
    return $secret;
}

function kr_db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $config = kr_config();
        if ($config['db_dsn'] === '') {
            throw new RuntimeException('Databasen är inte inställd (db_dsn saknas i config.php)');
        }
        $pdo = new PDO($config['db_dsn'], $config['db_user'] ?: null, $config['db_pass'] ?: null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        kr_migrate($pdo);
    }
    return $pdo;
}

/** Skapar tabellerna första gången. Samma SQL fungerar i MySQL och SQLite. */
function kr_migrate(PDO $pdo): void
{
    $marker = kr_data_path('schema-v1.done');
    if (is_file($marker)) {
        return;
    }
    $suffix = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql' ? ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4' : '';
    $tables = [
        'CREATE TABLE IF NOT EXISTS kr_users (
            id CHAR(32) NOT NULL PRIMARY KEY,
            email VARCHAR(190) NOT NULL UNIQUE,
            created_at INTEGER NOT NULL,
            last_login_at INTEGER NOT NULL,
            plan VARCHAR(16) NOT NULL,
            plan_checked_at INTEGER NOT NULL,
            profile TEXT NULL,
            profile_updated_at INTEGER NOT NULL
        )',
        'CREATE TABLE IF NOT EXISTS kr_login_codes (
            id CHAR(32) NOT NULL PRIMARY KEY,
            email VARCHAR(190) NOT NULL,
            code_hash CHAR(64) NOT NULL,
            ip_hash CHAR(64) NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL,
            attempts INTEGER NOT NULL,
            used INTEGER NOT NULL
        )',
        'CREATE TABLE IF NOT EXISTS kr_sessions (
            token_hash CHAR(64) NOT NULL PRIMARY KEY,
            user_id CHAR(32) NOT NULL,
            created_at INTEGER NOT NULL,
            expires_at INTEGER NOT NULL
        )',
    ];
    foreach ($tables as $sql) {
        $pdo->exec($sql . $suffix);
    }
    @file_put_contents($marker, date('c') . "\n");
}

function kr_id(): string
{
    return bin2hex(random_bytes(16));
}

function kr_require_method(string ...$methods): string
{
    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    if (!in_array($method, $methods, true)) {
        header('Allow: ' . implode(', ', $methods));
        kr_json(405, ['error' => 'Metoden stöds inte.']);
    }
    return $method;
}

/**
 * Skydd för anrop som ändrar något: egen header (kan inte sättas av ett
 * formulär på en annan sajt) och kontroll att anropet kommer från vår egen adress.
 */
function kr_require_same_site(): void
{
    if (($_SERVER['HTTP_X_KOMMUNRADAR'] ?? '') !== '1') {
        kr_json(403, ['error' => 'Otillåtet anrop.']);
    }
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        $originHost = parse_url($origin, PHP_URL_HOST);
        $originPort = parse_url($origin, PHP_URL_PORT);
        $own = strtolower($_SERVER['HTTP_HOST'] ?? '');
        $candidate = strtolower((string) $originHost . ($originPort ? ':' . $originPort : ''));
        if ($candidate !== $own) {
            kr_json(403, ['error' => 'Otillåtet anrop.']);
        }
    }
}

function kr_body(): array
{
    $raw = file_get_contents('php://input', false, null, 0, KR_MAX_BODY + 1);
    if ($raw === false || strlen($raw) > KR_MAX_BODY) {
        kr_json(413, ['error' => 'För mycket data.']);
    }
    $data = json_decode($raw === '' ? '{}' : $raw, true);
    if (!is_array($data)) {
        kr_json(400, ['error' => 'Ogiltig begäran.']);
    }
    return $data;
}

function kr_is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || strtolower($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https';
}

function kr_ip_hash(): string
{
    return hash_hmac('sha256', 'ip|' . ($_SERVER['REMOTE_ADDR'] ?? ''), kr_secret());
}

function kr_query(string $name): string
{
    $value = $_GET[$name] ?? '';
    return is_string($value) ? $value : '';
}
