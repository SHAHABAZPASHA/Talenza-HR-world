<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', '0');
error_reporting(E_ALL);

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/../../mailer.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

$config = SilvoraMailer::config();

if (!SilvoraMailer::isSameOriginRequest()) {
    http_response_code(403);
    echo 'Request blocked.';
    exit;
}

function f(string $key): string
{
    return SilvoraMailer::sanitizeText((string) ($_POST[$key] ?? ''));
}

$name = f('name');
$email = SilvoraMailer::sanitizeEmail((string) ($_POST['email'] ?? ''));
$phone = f('phone');
$service = f('service');
$subject = f('subject');
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $service === '' || $message === '') {
    echo 'Please fill in all required fields.';
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo 'Please provide a valid email address.';
    exit;
}

$reference = SilvoraMailer::referenceId();
$fields = [
    'Name' => $name,
    'Email' => $email,
    'Phone / WhatsApp' => $phone,
    'Service' => $service,
    'Message' => SilvoraMailer::sanitizeText($message),
];

$payload = [
    'reference' => $reference,
    'form_name' => $service . ' Form',
    'subject' => $subject,
    'sender_name' => $name,
    'sender_email' => $email,
    'ip' => SilvoraMailer::clientIp(),
    'user_agent' => SilvoraMailer::userAgent(),
    'fields' => $fields,
];

$mail = new PHPMailer(true);
$sent = false;

try {
    SilvoraMailer::configureMailer($mail, $config);
    foreach (SilvoraMailer::recipients($config) as $recipient) {
        $mail->addAddress($recipient);
    }
    foreach (SilvoraMailer::bccRecipients($config) as $bcc) {
        $mail->addBCC($bcc);
    }
    $mail->addReplyTo($email, $name);
    $mail->isHTML(true);
    $mail->Subject = '[' . $reference . '] ' . $subject;
    $mail->Body = SilvoraMailer::buildAdminEmailHtml($payload, $config);
    SilvoraMailer::sendWithRetry($mail, $config);
    $sent = true;

    if (!empty($config['auto_reply_enabled'])) {
        $reply = new PHPMailer(true);
        SilvoraMailer::configureMailer($reply, $config);
        $reply->addAddress($email, $name);
        $reply->isHTML(true);
        $reply->Subject = 'Thank You for Contacting Silvora Talenza World LLC';
        $reply->Body = SilvoraMailer::buildAutoReplyHtml($payload, $config);
        SilvoraMailer::sendWithRetry($reply, $config);
    }
} catch (Throwable $e) {
    $sent = false;
}

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
            <div class="col-lg-6">
                <div class="card shadow border-0">
                    <div class="card-body p-4 text-center">
                        <?php if ($sent): ?>
                            <h3 class="mb-3 text-success">Thank you, <?= htmlspecialchars($name, ENT_QUOTES, 'UTF-8') ?>!</h3>
                            <p class="mb-4">Your message has been sent successfully. Reference: <strong><?= htmlspecialchars($reference, ENT_QUOTES, 'UTF-8') ?></strong></p>
                        <?php else: ?>
                            <h3 class="mb-3 text-danger">Oops, something went wrong.</h3>
                            <p class="mb-4">We could not send your message right now. Please try again later or email us directly at <a href="mailto:<?= htmlspecialchars($config['from_email'], ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($config['from_email'], ENT_QUOTES, 'UTF-8') ?></a>.</p>
                        <?php endif; ?>
                        <a href="index.html" class="btn btn-primary rounded-pill px-4">Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
