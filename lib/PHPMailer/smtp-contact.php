<?php
// PHPMailer SMTP contact form handler for Talenza HR World
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method Not Allowed';
    exit;
}

function field($key) {
    return isset($_POST[$key]) ? trim($_POST[$key]) : '';
}

$name    = field('name');
$email   = field('email');
$phone   = field('phone');
$service = field('service');
$subject = field('subject');
$message = field('message');

if ($name === '' || $email === '' || $subject === '' || $message === '' || $service === '') {
    echo 'Please fill in all required fields.';
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo 'Please provide a valid email address.';
    exit;
}

$email_safe   = str_replace(["\r", "\n"], '', $email);
$subject_safe = str_replace(["\r", "\n"], '', $subject);
$email_subject = 'New enquiry from Talenza website: ' . $subject_safe;

$lines = [];
$lines[] = 'You have received a new enquiry from the Talenza HR World website.';
$lines[] = '';
$lines[] = 'Name: ' . $name;
$lines[] = 'Email: ' . $email_safe;
if ($phone !== '') {
    $lines[] = 'Phone / WhatsApp: ' . $phone;
}
$lines[] = 'Service interested in: ' . $service;
$lines[] = '';
$lines[] = 'Message:';
$lines[] = $message;
$body = implode("\r\n", $lines);

$mail = new PHPMailer(true);

try {
    // SMTP settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.zoho.in';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@talenzaworld.com';
    $mail->Password   = 'Info@talentra2025';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('info@talenzaworld.com', 'Talenza Website');
    $mail->addAddress('info@talenzaworld.com');
    $mail->addReplyTo($email_safe, $name);
    $mail->Subject = $email_subject;
    $mail->Body    = $body;

    $mail->send();
    $sent = true;
} catch (Exception $e) {
    $sent = false;
}

?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Thank You - Talenza HR World</title>
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
                            <p class="mb-4">Your message has been sent to Talenza HR World. Our team will contact you shortly.</p>
                        <?php else: ?>
                            <h3 class="mb-3 text-danger">Oops, something went wrong.</h3>
                            <p class="mb-4">We could not send your message right now. Please try again later or email us directly at <a href="mailto:info@talenzaworld.com">info@talenzaworld.com</a>.</p>
                        <?php endif; ?>
                        <a href="index.html" class="btn btn-primary rounded-pill px-4">Back to Home</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
