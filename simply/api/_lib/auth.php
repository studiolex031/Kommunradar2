<?php
declare(strict_types=1);

/**
 * Inloggning med e-post + engångskod, och sessioner.
 *
 * - Koden är 6 siffror, gäller i 10 minuter och får prövas högst 5 gånger.
 * - Koden och sessionsnyckeln sparas bara som hashar, aldrig i klartext.
 * - Kontot skapas först när koden har bekräftats, så ingen kan fylla
 *   databasen med adresser de inte äger.
 */

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/mailer.php';

const KR_CODE_TTL = 600;
const KR_CODE_MAX_ATTEMPTS = 5;
const KR_CODES_PER_EMAIL_HOUR = 5;
const KR_CODES_PER_IP_HOUR = 20;
const KR_CODE_MIN_INTERVAL = 60;

function kr_normalize_email($value): ?string
{
    if (!is_string($value)) {
        return null;
    }
    $email = strtolower(trim($value));
    if ($email === '' || strlen($email) > 190 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
        return null;
    }
    return $email;
}

function kr_code_hash(string $email, string $code): string
{
    return hash_hmac('sha256', 'code|' . $email . '|' . $code, kr_secret());
}

/** Skapar och mejlar en ny kod. Avbryter med felsvar vid för många försök. */
function kr_request_code(string $email): void
{
    $db = kr_db();
    $now = time();
    $db->prepare('DELETE FROM kr_login_codes WHERE created_at < ?')->execute([$now - 86400]);

    $recent = $db->prepare('SELECT COUNT(*) AS n, MAX(created_at) AS latest FROM kr_login_codes WHERE email = ? AND created_at > ?');
    $recent->execute([$email, $now - 3600]);
    $row = $recent->fetch();
    if ($row['latest'] !== null && $now - (int) $row['latest'] < KR_CODE_MIN_INTERVAL) {
        kr_json(429, ['error' => 'Vi skickade nyss en kod. Vänta en minut innan du ber om en ny.']);
    }
    if ((int) $row['n'] >= KR_CODES_PER_EMAIL_HOUR) {
        kr_json(429, ['error' => 'För många koder på kort tid. Försök igen om en timme.']);
    }
    $ipHash = kr_ip_hash();
    $byIp = $db->prepare('SELECT COUNT(*) FROM kr_login_codes WHERE ip_hash = ? AND created_at > ?');
    $byIp->execute([$ipHash, $now - 3600]);
    if ((int) $byIp->fetchColumn() >= KR_CODES_PER_IP_HOUR) {
        kr_json(429, ['error' => 'För många försök. Försök igen om en timme.']);
    }

    $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $id = kr_id();
    // En ny kod gör äldre koder ogiltiga.
    $db->prepare('UPDATE kr_login_codes SET used = 1 WHERE email = ? AND used = 0')->execute([$email]);
    $db->prepare('INSERT INTO kr_login_codes (id, email, code_hash, ip_hash, created_at, expires_at, attempts, used) VALUES (?, ?, ?, ?, ?, ?, 0, 0)')
        ->execute([$id, $email, kr_code_hash($email, $code), $ipHash, $now, $now + KR_CODE_TTL]);

    if (!kr_send_login_code($email, $code)) {
        $db->prepare('DELETE FROM kr_login_codes WHERE id = ?')->execute([$id]);
        kr_json(502, ['error' => 'Kunde inte skicka koden just nu. Försök igen om en stund.']);
    }
}

/** Kontrollerar koden. Returnerar användarens id, eller null om koden är fel/utgången. */
function kr_verify_code(string $email, string $code): ?string
{
    $db = kr_db();
    $now = time();
    $find = $db->prepare('SELECT id, code_hash, attempts FROM kr_login_codes WHERE email = ? AND used = 0 AND expires_at > ? ORDER BY created_at DESC LIMIT 1');
    $find->execute([$email, $now]);
    $row = $find->fetch();
    if (!$row || (int) $row['attempts'] >= KR_CODE_MAX_ATTEMPTS) {
        return null;
    }
    // Räkna försöket innan jämförelsen, så att parallella gissningar inte slinker förbi taket.
    $bump = $db->prepare('UPDATE kr_login_codes SET attempts = attempts + 1 WHERE id = ? AND attempts < ?');
    $bump->execute([$row['id'], KR_CODE_MAX_ATTEMPTS]);
    if ($bump->rowCount() !== 1) {
        return null;
    }
    if (!hash_equals($row['code_hash'], kr_code_hash($email, $code))) {
        return null;
    }
    $use = $db->prepare('UPDATE kr_login_codes SET used = 1 WHERE id = ? AND used = 0');
    $use->execute([$row['id']]);
    if ($use->rowCount() !== 1) {
        return null; // koden hann användas av ett annat anrop
    }

    $user = $db->prepare('SELECT id FROM kr_users WHERE email = ?');
    $user->execute([$email]);
    $userId = $user->fetchColumn();
    if ($userId === false) {
        $userId = kr_id();
        $db->prepare('INSERT INTO kr_users (id, email, created_at, last_login_at, plan, plan_checked_at, profile, profile_updated_at) VALUES (?, ?, ?, ?, ?, 0, NULL, 0)')
            ->execute([$userId, $email, $now, $now, 'free']);
    } else {
        $db->prepare('UPDATE kr_users SET last_login_at = ? WHERE id = ?')->execute([$now, $userId]);
    }
    return (string) $userId;
}

function kr_start_session(string $userId): void
{
    $db = kr_db();
    $now = time();
    $db->prepare('DELETE FROM kr_sessions WHERE expires_at < ?')->execute([$now]);
    $token = bin2hex(random_bytes(32));
    $expires = $now + KR_SESSION_DAYS * 86400;
    $db->prepare('INSERT INTO kr_sessions (token_hash, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)')
        ->execute([hash('sha256', $token), $userId, $now, $expires]);
    kr_set_session_cookie($token, $expires);
}

function kr_set_session_cookie(string $token, int $expires): void
{
    setcookie(KR_SESSION_COOKIE, $token, [
        'expires' => $expires,
        'path' => '/',
        'secure' => kr_is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

/** Inloggad användare (rad ur kr_users) eller null. */
function kr_current_user(): ?array
{
    $token = $_COOKIE[KR_SESSION_COOKIE] ?? '';
    if (!is_string($token) || !preg_match('/^[0-9a-f]{64}$/', $token)) {
        return null;
    }
    $find = kr_db()->prepare('SELECT u.* FROM kr_sessions s JOIN kr_users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?');
    $find->execute([hash('sha256', $token), time()]);
    $user = $find->fetch();
    return $user ?: null;
}

function kr_require_user(): array
{
    $user = kr_current_user();
    if ($user === null) {
        kr_json(401, ['error' => 'Du är inte inloggad.']);
    }
    return $user;
}

function kr_logout(): void
{
    $token = $_COOKIE[KR_SESSION_COOKIE] ?? '';
    if (is_string($token) && preg_match('/^[0-9a-f]{64}$/', $token)) {
        kr_db()->prepare('DELETE FROM kr_sessions WHERE token_hash = ?')->execute([hash('sha256', $token)]);
    }
    kr_set_session_cookie('', time() - 3600);
}
