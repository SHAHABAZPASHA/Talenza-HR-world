<?php
// Minimal PHPMailer SMTP test for Hostinger
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';

$config = require __DIR__ . '/mail-config.php';
$secure = strtolower(trim((string) ($config['smtp_secure'] ?? '')));

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $config['smtp_host'];
    $mail->SMTPAuth   = (bool) $config['smtp_auth'];
    $mail->Username   = $config['smtp_username'];
    $mail->Password   = $config['smtp_password'];
    if ($secure === 'ssl' || $secure === 'smtps') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    } elseif ($secure === 'tls' || $secure === 'starttls') {
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    }
    $mail->Port       = (int) $config['smtp_port'];

    $mail->setFrom($config['from_email'], 'Silvora Talenza World Test');
    $mail->addAddress($config['recipient_email']);
    $mail->Subject = 'SMTP Test';
    $mail->Body    = 'This is a test email from PHPMailer SMTP.';

    $mail->send();
    echo 'Test email sent successfully.';
} catch (Exception $e) {
    echo 'Test email failed. Error: ', $mail->ErrorInfo;
}
