<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/http.php';

const KR_PLAN_CACHE = 3600;

/**
 * Slår upp om e-postadressen har en aktiv eller pågående prenumeration i Stripe.
 * Returnerar 'pro', 'free', eller null om det inte går att avgöra (ingen nyckel
 * inställd eller Stripe svarar inte) – då lämnas den sparade statusen orörd.
 */
function kr_stripe_plan(string $email): ?string
{
    $config = kr_config();
    $key = $config['stripe_secret_key'];
    if ($key === '') {
        return null;
    }
    $base = rtrim($config['stripe_api_base'], '/');
    $auth = ['Authorization: Bearer ' . $key];

    $customers = kr_http_request('GET', $base . '/v1/customers?limit=10&email=' . rawurlencode($email), null, $auth, 8);
    if ($customers['status'] !== 200 || !is_array($customers['json']['data'] ?? null)) {
        error_log('kommunradar: Stripe customers svarade ' . $customers['status']);
        return null;
    }
    foreach ($customers['json']['data'] as $customer) {
        $id = $customer['id'] ?? '';
        if (!is_string($id) || !preg_match('/^cus_[A-Za-z0-9]+$/', $id)) {
            continue;
        }
        $subs = kr_http_request('GET', $base . '/v1/subscriptions?limit=20&status=all&customer=' . rawurlencode($id), null, $auth, 8);
        if ($subs['status'] !== 200 || !is_array($subs['json']['data'] ?? null)) {
            error_log('kommunradar: Stripe subscriptions svarade ' . $subs['status']);
            return null;
        }
        foreach ($subs['json']['data'] as $subscription) {
            if (in_array($subscription['status'] ?? '', ['active', 'trialing'], true)) {
                return 'pro';
            }
        }
    }
    return 'free';
}

/** Användarens plan, uppdaterad från Stripe högst en gång i timmen (eller direkt med $force). */
function kr_user_plan(array $user, bool $force = false): array
{
    $now = time();
    $age = $now - (int) $user['plan_checked_at'];
    $configured = kr_config()['stripe_secret_key'] !== '';
    if ($configured && ($age > KR_PLAN_CACHE || ($force && $age > 60))) {
        $plan = kr_stripe_plan($user['email']);
        if ($plan !== null) {
            kr_db()->prepare('UPDATE kr_users SET plan = ?, plan_checked_at = ? WHERE id = ?')->execute([$plan, $now, $user['id']]);
            $user['plan'] = $plan;
            $user['plan_checked_at'] = $now;
        }
    }
    return [
        'plan' => $user['plan'] === 'pro' ? 'pro' : 'free',
        // false = Stripe-kopplingen är inte inställd eller har aldrig svarat, så "free" är inte bekräftat
        'planVerified' => (int) $user['plan_checked_at'] > 0,
    ];
}
