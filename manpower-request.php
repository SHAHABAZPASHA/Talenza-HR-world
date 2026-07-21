<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

ini_set('display_errors', '0');
error_reporting(E_ALL);

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';
require __DIR__ . '/mailer.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$config = SilvoraMailer::config();

if (!SilvoraMailer::isSameOriginRequest()) {
    SilvoraMailer::writeLog([
        'datetime' => gmdate('c'),
        'form_name' => 'Manpower Request Form',
        'sender_email' => '',
        'recipient' => implode(',', SilvoraMailer::recipients($config)),
        'status' => 'blocked',
        'error' => 'Origin mismatch',
    ]);
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Request blocked.']);
    exit;
}

$honeypot = trim((string) ($_POST['_website'] ?? ''));
$timestamp = (int) ($_POST['_ts'] ?? 0);
if ($honeypot !== '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
    exit;
}
if ($timestamp > 0 && (time() - $timestamp) < 2) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'Please wait a moment and submit again.']);
    exit;
}

$fields = [
    'Company Name' => SilvoraMailer::sanitizeText((string) ($_POST['companyName'] ?? '')),
    'Sector' => SilvoraMailer::sanitizeText((string) ($_POST['sector'] ?? '')),
    'Number of Employees Needed' => SilvoraMailer::sanitizeText((string) ($_POST['numEmployees'] ?? '')),
    'Contact Person' => SilvoraMailer::sanitizeText((string) ($_POST['contactPerson'] ?? '')),
    'Contact Email' => SilvoraMailer::sanitizeEmail((string) ($_POST['contactEmail'] ?? '')),
    'Additional Information' => SilvoraMailer::sanitizeText((string) ($_POST['additionalInfo'] ?? '')),
    'Job Titles / Roles Needed' => SilvoraMailer::sanitizeText((string) ($_POST['jobTitles'] ?? '')),
    'Experience Level' => SilvoraMailer::sanitizeText((string) ($_POST['experienceLevel'] ?? '')),
    'Nationality Preference' => SilvoraMailer::sanitizeText((string) ($_POST['nationalityPreference'] ?? '')),
    'Gender Preference' => SilvoraMailer::sanitizeText((string) ($_POST['genderPreference'] ?? '')),
    'Expected Joining Date' => SilvoraMailer::sanitizeText((string) ($_POST['joiningDate'] ?? '')),
];

if ($fields['Company Name'] === '' || $fields['Contact Person'] === '' || $fields['Contact Email'] === '') {
    echo json_encode(['success' => false, 'message' => 'Please fill required fields.']);
    exit;
}
if (!filter_var($fields['Contact Email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Please provide a valid contact email.']);
    exit;
}

$attachments = SilvoraMailer::collectAttachments(
    $_FILES,
    [
        'companyProfile' => 'Company Profile',
        'vatCertificate' => 'VAT Certificate',
        'tradeLicence' => 'Trade Licence',
        'emiratesId' => 'Emirates ID',
    ],
    $config
);

$fingerprint = hash('sha256', strtolower($fields['Contact Email']) . '|manpower|' . strtolower($fields['Company Name']) . '|' . strtolower(substr($fields['Additional Information'], 0, 180)));
if (SilvoraMailer::detectDuplicate($fingerprint, (int) $config['submission_cooldown_seconds'])) {
    echo json_encode(['success' => false, 'message' => 'Your request is already being processed. Please wait a moment before submitting again.']);
    exit;
}

$reference = SilvoraMailer::referenceId();
$payload = [
    'reference' => $reference,
    'form_name' => 'Manpower Request Form',
    'subject' => 'New Manpower Request',
    'sender_name' => $fields['Contact Person'],
    'sender_email' => $fields['Contact Email'],
    'ip' => SilvoraMailer::clientIp(),
    'user_agent' => SilvoraMailer::userAgent(),
    'fields' => $fields,
];

$mail = new PHPMailer(true);
$status = 'failed';
$errorInfo = '';

try {
    SilvoraMailer::configureMailer($mail, $config);
    foreach (SilvoraMailer::recipients($config) as $recipient) {
        $mail->addAddress($recipient);
    }
    foreach (SilvoraMailer::bccRecipients($config) as $bcc) {
        $mail->addBCC($bcc);
    }

    $mail->addReplyTo($fields['Contact Email'], $fields['Contact Person']);
    $mail->isHTML(true);
    $mail->Subject = '[' . $reference . '] New Manpower Request - ' . $fields['Company Name'];
    $mail->Body = SilvoraMailer::buildAdminEmailHtml($payload, $config);
    $mail->AltBody = "Reference: {$reference}\nForm: Manpower Request\nCompany: {$fields['Company Name']}\n";

    foreach ($attachments as $file) {
        $mail->addAttachment($file['path'], $file['name']);
    }

    SilvoraMailer::sendWithRetry($mail, $config);
    $status = 'sent';

    if (!empty($config['auto_reply_enabled'])) {
        $replyMail = new PHPMailer(true);
        SilvoraMailer::configureMailer($replyMail, $config);
        $replyMail->addAddress($fields['Contact Email'], $fields['Contact Person']);
        $replyMail->isHTML(true);
        $replyMail->Subject = 'Thank You for Contacting Silvora Talenza World LLC';
        $replyMail->Body = SilvoraMailer::buildAutoReplyHtml($payload, $config);
        $replyMail->AltBody = "Thank you for contacting Silvora Talenza World LLC. Reference: {$reference}.";
        SilvoraMailer::sendWithRetry($replyMail, $config);
    }
} catch (Throwable $e) {
    $errorInfo = $mail->ErrorInfo ?: $e->getMessage();
}

SilvoraMailer::writeLog([
    'datetime' => gmdate('c'),
    'form_name' => 'Manpower Request Form',
    'sender_email' => $fields['Contact Email'],
    'recipient' => implode(',', SilvoraMailer::recipients($config)),
    'status' => $status,
    'reference' => $reference,
    'error' => $errorInfo,
]);

if ($status === 'sent') {
    echo json_encode(['success' => true, 'reference' => $reference, 'message' => 'Your manpower request has been submitted.']);
    exit;
}

echo json_encode(['success' => false, 'reference' => $reference, 'message' => 'Unable to send your request right now. Please try again shortly.']);
exit;
