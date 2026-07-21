<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', '0');
error_reporting(E_ALL);

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

$config = SilvoraMailer::config();

if (!SilvoraMailer::isSameOriginRequest()) {
    SilvoraMailer::writeLog([
        'datetime' => gmdate('c'),
        'form_name' => 'Unknown',
        'sender_email' => '',
        'recipient' => implode(',', SilvoraMailer::recipients($config)),
        'status' => 'blocked',
        'error' => 'Origin mismatch',
    ]);
    http_response_code(403);
    echo 'Request blocked.';
    exit;
}

$honeypot = trim((string) ($_POST['_website'] ?? ''));
$timestamp = (int) ($_POST['_ts'] ?? 0);
if ($honeypot !== '') {
    http_response_code(400);
    echo 'Invalid request.';
    exit;
}
if ($timestamp > 0 && (time() - $timestamp) < 2) {
    http_response_code(429);
    echo 'Please wait a moment and submit again.';
    exit;
}

function post_value(string $key): string
{
    return SilvoraMailer::sanitizeText((string) ($_POST[$key] ?? ''));
}

$name = post_value('name');
$email = SilvoraMailer::sanitizeEmail((string) ($_POST['email'] ?? ''));
$phone = post_value('phone');
$service = post_value('service');
$subject = post_value('subject');
$message = trim((string) ($_POST['message'] ?? ''));

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo 'Please provide a valid email address.';
    exit;
}

if ($name === '') {
    $name = 'Website Visitor';
}

$formName = 'General Inquiry Form';
if ($service !== '') {
    $formName = $service . ' Form';
}
if ($service === '' && $subject === '' && trim($message) === '' && $email !== '') {
    $formName = 'Newsletter Form';
    $subject = 'Newsletter Subscription Request';
    $message = 'Please subscribe this email to the newsletter list.';
}
if ($subject === '') {
    $subject = 'Website enquiry';
}
if (trim($message) === '') {
    $message = 'No additional message provided.';
}

$normalized = [];
foreach ($_POST as $key => $value) {
    if ($key === '_website' || $key === '_ts') {
        continue;
    }
    if (is_array($value)) {
        $value = implode(', ', array_map(static function ($item) {
            return SilvoraMailer::sanitizeText((string) $item);
        }, $value));
    }
    $clean = SilvoraMailer::sanitizeText((string) $value);
    if ($clean === '') {
        continue;
    }
    $label = ucwords(str_replace('_', ' ', preg_replace('/([a-z])([A-Z])/', '$1 $2', $key)));
    $normalized[$label] = $clean;
}

if (!isset($normalized['Name'])) {
    $normalized['Name'] = $name;
}
if (!isset($normalized['Email'])) {
    $normalized['Email'] = $email;
}
if ($phone !== '' && !isset($normalized['Phone'])) {
    $normalized['Phone'] = $phone;
}
if (!isset($normalized['Service'])) {
    $normalized['Service'] = $service !== '' ? $service : 'General Inquiry';
}
if (!isset($normalized['Message'])) {
    $normalized['Message'] = SilvoraMailer::sanitizeText($message);
}

$attachments = SilvoraMailer::collectAttachments(
    $_FILES,
    ['documents' => 'Document'],
    $config
);

$fingerprint = hash('sha256', strtolower($email) . '|' . $formName . '|' . strtolower(substr(strip_tags($message), 0, 180)));
if (SilvoraMailer::detectDuplicate($fingerprint, (int) $config['submission_cooldown_seconds'])) {
    $responseMessage = 'Your request is already being processed. Please wait a moment before submitting again.';
    if (SilvoraMailer::isAjaxRequest()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['success' => false, 'message' => $responseMessage]);
        exit;
    }
    echo $responseMessage;
    exit;
}

$reference = SilvoraMailer::referenceId();
$payload = [
    'reference' => $reference,
    'form_name' => $formName,
    'subject' => $subject,
    'sender_name' => $name,
    'sender_email' => $email,
    'ip' => SilvoraMailer::clientIp(),
    'user_agent' => SilvoraMailer::userAgent(),
    'fields' => $normalized,
];

$adminMail = new PHPMailer(true);
$status = 'failed';
$errorInfo = '';

try {
    SilvoraMailer::configureMailer($adminMail, $config);
    foreach (SilvoraMailer::recipients($config) as $recipient) {
        $adminMail->addAddress($recipient);
    }
    foreach (SilvoraMailer::bccRecipients($config) as $bcc) {
        $adminMail->addBCC($bcc);
    }

    $adminMail->addReplyTo($email, $name);
    $adminMail->isHTML(true);
    $adminMail->Subject = '[' . $reference . '] ' . $subject;
    $adminMail->Body = SilvoraMailer::buildAdminEmailHtml($payload, $config);
    $adminMail->AltBody = "Reference: {$reference}\nForm: {$formName}\nSender: {$name} <{$email}>\n";

    foreach ($attachments as $file) {
        $adminMail->addAttachment($file['path'], $file['name']);
    }

    SilvoraMailer::sendWithRetry($adminMail, $config);
    $status = 'sent';

    if (!empty($config['auto_reply_enabled']) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $replyMail = new PHPMailer(true);
        SilvoraMailer::configureMailer($replyMail, $config);
        $replyMail->addAddress($email, $name);
        $replyMail->isHTML(true);
        $replyMail->Subject = 'Thank You for Contacting Silvora Talenza World LLC';
        $replyMail->Body = SilvoraMailer::buildAutoReplyHtml($payload, $config);
        $replyMail->AltBody = "Thank you for contacting Silvora Talenza World LLC. Reference: {$reference}.";
        SilvoraMailer::sendWithRetry($replyMail, $config);
    }
} catch (Throwable $e) {
    $errorInfo = $adminMail->ErrorInfo ?: $e->getMessage();
}

SilvoraMailer::writeLog([
    'datetime' => gmdate('c'),
    'form_name' => $formName,
    'sender_email' => $email,
    'recipient' => implode(',', SilvoraMailer::recipients($config)),
    'status' => $status,
    'reference' => $reference,
    'error' => $errorInfo,
]);

if (SilvoraMailer::isAjaxRequest()) {
    header('Content-Type: application/json; charset=utf-8');
    if ($status === 'sent') {
        echo json_encode(['success' => true, 'reference' => $reference, 'message' => 'Your request has been sent successfully.']);
    } else {
        echo json_encode(['success' => false, 'reference' => $reference, 'message' => 'We could not send your message right now. Please try again shortly.']);
    }
    exit;
}

$sent = $status === 'sent';
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Thank You - Silvora Talenza World</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
</head>
<body class="bg-light">
    <div class="container py-5">
        <div class="row justify-content-center">
            <div class="col-lg-7">
                <div class="card shadow border-0">
                    <div class="card-body p-4 text-center">
                        <?php if ($sent): ?>
                            <h3 class="mb-3 text-success">Thank you, <?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>!</h3>
                            <p class="mb-2">Your request has been received successfully.</p>
                            <p class="mb-4">Reference: <strong><?= htmlspecialchars($reference, ENT_QUOTES, 'UTF-8') ?></strong></p>
                        <?php else: ?>
                            <h3 class="mb-3 text-danger">Oops, something went wrong.</h3>
                            <p class="mb-4">We could not send your message right now. Please try again later or contact us at <a href="mailto:<?= htmlspecialchars($config['from_email'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($config['from_email'], ENT_QUOTES, 'UTF-8') ?></a>.</p>
                        <?php endif; ?>
                        <a href="index.html" class="btn btn-primary rounded-pill px-4">Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
