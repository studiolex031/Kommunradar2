<?php
/**
 * Inställningar för login.kommunradar.online.
 *
 * 1. Kopiera den här filen till config.php (samma mapp).
 * 2. Fyll i databasuppgifterna från Simplys kontrollpanel.
 * 3. Lägg in Stripe-nyckeln om Pro ska låsas upp automatiskt.
 *
 * config.php ska aldrig läggas i Git. Mappen är spärrad för besökare.
 */
return [
    // MySQL-databasen hos Simply (Kontrollpanelen → Databaser)
    'db_dsn' => 'mysql:host=DIN-DATABASVÄRD;dbname=DITT-DATABASNAMN;charset=utf8mb4',
    'db_user' => 'DITT-DATABASNAMN',
    'db_pass' => 'DITT-DATABASLÖSENORD',

    // Avsändare för inloggningskoder. 'mail' = webbhotellets egen mejlfunktion.
    'mail_transport' => 'mail',
    'mail_from' => 'Kommunradar <hej@kommunradar.online>',

    // Valfritt: skicka via Resend i stället (sätt mail_transport till 'resend').
    'resend_api_key' => '',

    // Valfritt: en begränsad Stripe-nyckel (rk_live_...) med läsrätt till Customers
    // och Subscriptions. Utan nyckel visas alla konton som Gratis.
    'stripe_secret_key' => '',
];
