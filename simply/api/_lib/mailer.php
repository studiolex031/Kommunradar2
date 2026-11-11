<?php
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/http.php';

/** Skickar inloggningskoden. Returnerar false om mejlet inte gick iväg. */
function kr_send_login_code(string $email, string $code): bool
{
    $config = kr_config();
    $subject = 'Din inloggningskod till Kommunradar';
    $text = "Hej!\n\nDin inloggningskod är: {$code}\n\nKoden gäller i 10 minuter och kan bara användas en gång.\n"
        . "Om du inte försökte logga in kan du bortse från det här mejlet.\n\nKommunradar\nhttps://kommunradar.online\n";

    switch ($config['mail_transport']) {
        case 'resend':
            if ($config['resend_api_key'] === '') {
                error_log('kommunradar: resend_api_key saknas');
                return false;
            }
            $response = kr_http_request('POST', 'https://api.resend.com/emails', [
                'from' => $config['mail_from'],
                'to' => [$email],
                'subject' => $subject,
                'text' => $text,
            ], ['Authorization: Bearer ' . $config['resend_api_key']], 10);
            if ($response['status'] < 200 || $response['status'] >= 300) {
                error_log('kommunradar: Resend svarade ' . $response['status']);
                return false;
            }
            return true;

        case 'log': // endast för lokala tester – skriver koden till en fil i stället för att mejla
            return @file_put_contents(kr_data_path('mail.log'), json_encode(['to' => $email, 'code' => $code]) . "\n", FILE_APPEND | LOCK_EX) !== false;

        default:
            $from = $config['mail_from'];
            $address = preg_match('/<([^>]+)>/', $from, $match) ? $match[1] : $from;
            $headers = [
                'From: ' . $from,
                'Reply-To: ' . $address,
                'MIME-Version: 1.0',
                'Content-Type: text/plain; charset=UTF-8',
                'Content-Transfer-Encoding: 8bit',
            ];
            return @mail($email, mb_encode_mimeheader($subject, 'UTF-8'), $text, implode("\r\n", $headers), '-f' . $address);
    }
}
