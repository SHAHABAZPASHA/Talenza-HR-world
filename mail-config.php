<?php
// Shared mail configuration for all website form handlers.
return [
    'smtp_host' => 'smtp.hostinger.com',
    'smtp_auth' => true,
    'smtp_username' => 'info@silvoratalenzaworld.com',
    'smtp_password' => 'Info@silvoratalenza1',
    'smtp_secure' => 'ssl',
    'smtp_port' => 465,
    'smtp_fallback_secure' => 'tls',
    'smtp_fallback_port' => 587,

    'from_email' => 'info@silvoratalenzaworld.com',
    'from_name' => 'Silvora Talenza World Website',

    // Keep the primary recipient here only.
    'recipient_email' => 'info@silvoratalenzaworld.com',

    // Optional additional recipients for future expansion.
    'recipients' => [
        // 'hr@silvoratalenzaworld.com',
        // 'sales@silvoratalenzaworld.com',
    ],

    // Optional BCC recipients for internal visibility.
    'bcc' => [
        // 'support@silvoratalenzaworld.com',
    ],

    'company_name' => 'Silvora Talenza World LLC',
    'company_phone' => '+971 58 589 5827',
    'website_url' => 'https://www.silvoratalenzaworld.com',
    'logo_url' => 'https://www.silvoratalenzaworld.com/img/TALENZA_logo_v2.png',

    'auto_reply_enabled' => true,
    'submission_cooldown_seconds' => 35,
    'allowed_attachment_extensions' => ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'webp'],
    'max_attachment_size_bytes' => 5 * 1024 * 1024,
    'max_attachment_count' => 5,
];
