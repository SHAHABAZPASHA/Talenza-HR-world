<?php

use PHPMailer\PHPMailer\PHPMailer;

final class SilvoraMailer
{
    public static function config(): array
    {
        $config = require __DIR__ . '/mail-config.php';

        if (!isset($config['recipients']) || !is_array($config['recipients'])) {
            $config['recipients'] = [];
        }
        if (!isset($config['bcc']) || !is_array($config['bcc'])) {
            $config['bcc'] = [];
        }
        if (!isset($config['allowed_attachment_extensions']) || !is_array($config['allowed_attachment_extensions'])) {
            $config['allowed_attachment_extensions'] = ['pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'webp'];
        }
        if (!isset($config['max_attachment_size_bytes'])) {
            $config['max_attachment_size_bytes'] = 5 * 1024 * 1024;
        }
        if (!isset($config['max_attachment_count'])) {
            $config['max_attachment_count'] = 5;
        }
        if (!isset($config['submission_cooldown_seconds'])) {
            $config['submission_cooldown_seconds'] = 35;
        }
        if (!isset($config['auto_reply_enabled'])) {
            $config['auto_reply_enabled'] = true;
        }
        if (!isset($config['website_url'])) {
            $config['website_url'] = 'https://www.silvoratalenzaworld.com';
        }
        if (!isset($config['logo_url'])) {
            $config['logo_url'] = $config['website_url'] . '/img/TALENZA_logo_v2.png';
        }
        if (!isset($config['company_name'])) {
            $config['company_name'] = 'Silvora Talenza World LLC';
        }
        if (!isset($config['company_phone'])) {
            $config['company_phone'] = '+971 58 589 5827';
        }

        return $config;
    }

    public static function sanitizeText(string $value): string
    {
        $value = trim($value);
        $value = preg_replace('/[\x00-\x1F\x7F]/u', ' ', $value);
        return preg_replace('/\s+/u', ' ', (string) $value) ?? '';
    }

    public static function sanitizeEmail(string $email): string
    {
        $email = trim($email);
        $email = str_replace(["\r", "\n"], '', $email);
        return filter_var($email, FILTER_SANITIZE_EMAIL) ?: '';
    }

    public static function isSameOriginRequest(): bool
    {
        $host = $_SERVER['HTTP_HOST'] ?? '';
        if ($host === '') {
            return true;
        }

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        $referer = $_SERVER['HTTP_REFERER'] ?? '';

        if ($origin !== '' && stripos($origin, $host) === false) {
            return false;
        }
        if ($referer !== '' && stripos($referer, $host) === false) {
            return false;
        }

        return true;
    }

    public static function clientIp(): string
    {
        $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        foreach ($keys as $key) {
            if (empty($_SERVER[$key])) {
                continue;
            }
            $value = trim((string) $_SERVER[$key]);
            if ($key === 'HTTP_X_FORWARDED_FOR') {
                $parts = explode(',', $value);
                $value = trim((string) ($parts[0] ?? ''));
            }
            if ($value !== '') {
                return $value;
            }
        }
        return 'unknown';
    }

    public static function userAgent(): string
    {
        return self::sanitizeText((string) ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown'));
    }

    public static function referenceId(): string
    {
        try {
            $token = strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
        } catch (Throwable $error) {
            $token = strtoupper(substr(md5((string) microtime(true)), 0, 6));
        }

        return 'STW-' . gmdate('Ymd-His') . '-' . $token;
    }

    public static function isAjaxRequest(): bool
    {
        $requestedWith = strtolower((string) ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? ''));
        $accept = strtolower((string) ($_SERVER['HTTP_ACCEPT'] ?? ''));
        return $requestedWith === 'xmlhttprequest' || strpos($accept, 'application/json') !== false;
    }

    public static function collectAttachments(array $files, array $fieldLabels, array $config): array
    {
        $attachments = [];
        $allowed = array_map('strtolower', $config['allowed_attachment_extensions']);
        $maxSize = (int) $config['max_attachment_size_bytes'];
        $maxCount = (int) $config['max_attachment_count'];

        foreach ($fieldLabels as $field => $label) {
            if (!isset($files[$field])) {
                continue;
            }

            $entry = $files[$field];
            if (is_array($entry['name'])) {
                $count = count($entry['name']);
                for ($i = 0; $i < $count; $i++) {
                    if (count($attachments) >= $maxCount) {
                        break;
                    }
                    $file = [
                        'name' => (string) ($entry['name'][$i] ?? ''),
                        'tmp_name' => (string) ($entry['tmp_name'][$i] ?? ''),
                        'type' => (string) ($entry['type'][$i] ?? ''),
                        'error' => (int) ($entry['error'][$i] ?? UPLOAD_ERR_NO_FILE),
                        'size' => (int) ($entry['size'][$i] ?? 0),
                    ];
                    $parsed = self::validateAttachment($file, $label, $allowed, $maxSize);
                    if ($parsed !== null) {
                        $attachments[] = $parsed;
                    }
                }
                continue;
            }

            if (count($attachments) >= $maxCount) {
                break;
            }

            $file = [
                'name' => (string) ($entry['name'] ?? ''),
                'tmp_name' => (string) ($entry['tmp_name'] ?? ''),
                'type' => (string) ($entry['type'] ?? ''),
                'error' => (int) ($entry['error'] ?? UPLOAD_ERR_NO_FILE),
                'size' => (int) ($entry['size'] ?? 0),
            ];
            $parsed = self::validateAttachment($file, $label, $allowed, $maxSize);
            if ($parsed !== null) {
                $attachments[] = $parsed;
            }
        }

        return $attachments;
    }

    private static function validateAttachment(array $file, string $label, array $allowedExtensions, int $maxSize): ?array
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || ($file['size'] ?? 0) <= 0) {
            return null;
        }
        if (($file['size'] ?? 0) > $maxSize) {
            return null;
        }

        $name = (string) ($file['name'] ?? 'attachment');
        $ext = strtolower((string) pathinfo($name, PATHINFO_EXTENSION));
        if ($ext === '' || !in_array($ext, $allowedExtensions, true)) {
            return null;
        }

        return [
            'path' => (string) $file['tmp_name'],
            'name' => $label . ' - ' . basename($name),
            'type' => (string) ($file['type'] ?? 'application/octet-stream'),
        ];
    }

    public static function detectDuplicate(string $fingerprint, int $cooldownSeconds): bool
    {
        $dir = __DIR__ . DIRECTORY_SEPARATOR . 'logs';
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        $file = $dir . DIRECTORY_SEPARATOR . 'mail-dedupe.json';
        $now = time();
        $payload = [];

        if (is_file($file)) {
            $json = @file_get_contents($file);
            $decoded = json_decode((string) $json, true);
            if (is_array($decoded)) {
                $payload = $decoded;
            }
        }

        foreach ($payload as $key => $timestamp) {
            if (!is_int($timestamp) || ($now - $timestamp) > $cooldownSeconds) {
                unset($payload[$key]);
            }
        }

        if (isset($payload[$fingerprint]) && ($now - (int) $payload[$fingerprint]) <= $cooldownSeconds) {
            return true;
        }

        $payload[$fingerprint] = $now;
        @file_put_contents($file, json_encode($payload, JSON_UNESCAPED_SLASHES));

        return false;
    }

    public static function writeLog(array $entry): void
    {
        $dir = __DIR__ . DIRECTORY_SEPARATOR . 'logs';
        if (!is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }
        $line = json_encode($entry, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($line !== false) {
            @file_put_contents($dir . DIRECTORY_SEPARATOR . 'mail.log', $line . PHP_EOL, FILE_APPEND);
        }
    }

    public static function configureMailer(PHPMailer $mail, array $config): void
    {
        $mail->isSMTP();
        $mail->Host = (string) $config['smtp_host'];
        $mail->SMTPAuth = (bool) $config['smtp_auth'];
        $mail->Username = (string) $config['smtp_username'];
        $mail->Password = (string) $config['smtp_password'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = (int) $config['smtp_port'];
        $mail->CharSet = 'UTF-8';
        $mail->Timeout = 20;
        $mail->SMTPKeepAlive = false;
        $mail->setFrom((string) $config['from_email'], (string) $config['from_name']);
    }

    public static function recipients(array $config): array
    {
        $raw = array_merge(
            [(string) ($config['recipient_email'] ?? '')],
            (array) ($config['recipients'] ?? [])
        );
        $out = [];
        foreach ($raw as $email) {
            $clean = self::sanitizeEmail((string) $email);
            if ($clean !== '' && filter_var($clean, FILTER_VALIDATE_EMAIL)) {
                $out[$clean] = true;
            }
        }
        return array_keys($out);
    }

    public static function bccRecipients(array $config): array
    {
        $out = [];
        foreach ((array) ($config['bcc'] ?? []) as $email) {
            $clean = self::sanitizeEmail((string) $email);
            if ($clean !== '' && filter_var($clean, FILTER_VALIDATE_EMAIL)) {
                $out[$clean] = true;
            }
        }
        return array_keys($out);
    }

    public static function htmlSummary(array $fields): string
    {
        $rows = '';
        foreach ($fields as $label => $value) {
            $labelSafe = htmlspecialchars((string) $label, ENT_QUOTES, 'UTF-8');
            $valueSafe = nl2br(htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8'));
            $rows .= '<tr><td style="padding:8px 10px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;width:34%;">' . $labelSafe . '</td><td style="padding:8px 10px;border:1px solid #e2e8f0;">' . $valueSafe . '</td></tr>';
        }
        return '<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px;color:#1f2937;">' . $rows . '</table>';
    }

    public static function buildAdminEmailHtml(array $payload, array $config): string
    {
        $company = htmlspecialchars((string) $config['company_name'], ENT_QUOTES, 'UTF-8');
        $logo = htmlspecialchars((string) $config['logo_url'], ENT_QUOTES, 'UTF-8');
        $website = htmlspecialchars((string) $config['website_url'], ENT_QUOTES, 'UTF-8');
        $email = htmlspecialchars((string) $config['from_email'], ENT_QUOTES, 'UTF-8');
        $phone = htmlspecialchars((string) $config['company_phone'], ENT_QUOTES, 'UTF-8');

        $metaRows = [
            'Reference Number' => $payload['reference'],
            'Submission Date & Time (UTC)' => gmdate('Y-m-d H:i:s') . ' UTC',
            'Form Type' => $payload['form_name'],
            'Subject' => $payload['subject'],
            'Sender Name' => $payload['sender_name'],
            'Sender Email' => $payload['sender_email'],
            'IP Address' => $payload['ip'],
            'User Agent' => $payload['user_agent'],
        ];

        $meta = self::htmlSummary($metaRows);
        $details = self::htmlSummary($payload['fields']);

        return '<!doctype html><html><body style="margin:0;background:#f3f6fb;padding:20px;">'
            . '<div style="max-width:820px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:12px;overflow:hidden;">'
            . '<div style="padding:18px 22px;background:#173f8a;color:#ffffff;">'
            . '<img src="' . $logo . '" alt="' . $company . '" style="height:48px;vertical-align:middle;">'
            . '<div style="font-family:Arial,sans-serif;font-size:20px;font-weight:700;margin-top:8px;">' . $company . '</div>'
            . '<div style="font-family:Arial,sans-serif;font-size:13px;opacity:.88;">New Website Form Submission</div>'
            . '</div>'
            . '<div style="padding:18px 22px;font-family:Arial,sans-serif;">'
            . '<h2 style="margin:0 0 12px;color:#0f172a;font-size:18px;">Submission Summary</h2>'
            . $meta
            . '<h3 style="margin:18px 0 10px;color:#0f172a;font-size:16px;">Submitted Information</h3>'
            . $details
            . '</div>'
            . '<div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;font-family:Arial,sans-serif;font-size:13px;color:#334155;">'
            . '<strong>' . $company . '</strong><br>'
            . 'Website: <a href="' . $website . '">' . $website . '</a><br>'
            . 'Email: <a href="mailto:' . $email . '">' . $email . '</a><br>'
            . 'Phone: <a href="tel:+971585895827">' . $phone . '</a>'
            . '</div></div></body></html>';
    }

    public static function buildAutoReplyHtml(array $payload, array $config): string
    {
        $company = htmlspecialchars((string) $config['company_name'], ENT_QUOTES, 'UTF-8');
        $logo = htmlspecialchars((string) $config['logo_url'], ENT_QUOTES, 'UTF-8');
        $website = htmlspecialchars((string) $config['website_url'], ENT_QUOTES, 'UTF-8');
        $email = htmlspecialchars((string) $config['from_email'], ENT_QUOTES, 'UTF-8');
        $phone = htmlspecialchars((string) $config['company_phone'], ENT_QUOTES, 'UTF-8');
        $name = htmlspecialchars((string) $payload['sender_name'], ENT_QUOTES, 'UTF-8');
        $ref = htmlspecialchars((string) $payload['reference'], ENT_QUOTES, 'UTF-8');

        return '<!doctype html><html><body style="margin:0;background:#f3f6fb;padding:20px;">'
            . '<div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #dbe4f0;border-radius:12px;overflow:hidden;">'
            . '<div style="padding:18px 22px;background:#173f8a;color:#ffffff;">'
            . '<img src="' . $logo . '" alt="' . $company . '" style="height:46px;vertical-align:middle;">'
            . '<div style="font-family:Arial,sans-serif;font-size:20px;font-weight:700;margin-top:8px;">' . $company . '</div>'
            . '</div>'
            . '<div style="padding:22px;font-family:Arial,sans-serif;color:#0f172a;">'
            . '<h2 style="margin:0 0 10px;font-size:20px;">Thank You for Contacting Silvora Talenza World LLC</h2>'
            . '<p style="margin:0 0 12px;line-height:1.6;">Dear ' . $name . ',<br>Thank you for your submission. We have received your request and our team will review it shortly.</p>'
            . '<p style="margin:0 0 12px;line-height:1.6;">Your reference number is <strong>' . $ref . '</strong>. We typically respond within 1 business day.</p>'
            . '<p style="margin:0;line-height:1.6;">If this was urgent, you may call us directly at <a href="tel:+971585895827">' . $phone . '</a>.</p>'
            . '</div>'
            . '<div style="padding:14px 22px;background:#f8fafc;border-top:1px solid #e2e8f0;font-family:Arial,sans-serif;font-size:13px;color:#334155;">'
            . '<strong>' . $company . '</strong><br>'
            . 'Website: <a href="' . $website . '">' . $website . '</a><br>'
            . 'Email: <a href="mailto:' . $email . '">' . $email . '</a><br>'
            . 'Phone: <a href="tel:+971585895827">' . $phone . '</a>'
            . '</div></div></body></html>';
    }
}
