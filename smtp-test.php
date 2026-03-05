<?php
// Minimal PHPMailer SMTP test for Hostinger
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', 1);
error_reporting(E_ALL);

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.zoho.in';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@talenzaworld.com';
    $mail->Password   = 'Info@talentra2025';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = 465;

    $mail->setFrom('info@talenzaworld.com', 'Talenza Test');
    $mail->addAddress('info@talenzaworld.com');
    $mail->Subject = 'SMTP Test';
    $mail->Body    = 'This is a test email from PHPMailer SMTP.';

    $mail->send();
    echo 'Test email sent successfully.';
} catch (Exception $e) {
    echo 'Test email failed. Error: ', $mail->ErrorInfo;
}
