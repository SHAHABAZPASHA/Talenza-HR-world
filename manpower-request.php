<?php
// PHPMailer SMTP integration for Manpower Request
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'lib/PHPMailer/src/Exception.php';
require 'lib/PHPMailer/src/PHPMailer.php';
require 'lib/PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $fields = [
        'Company Name' => $_POST['companyName'] ?? '',
        'Sector' => $_POST['sector'] ?? '',
        'Number of Employees Needed' => $_POST['numEmployees'] ?? '',
        'Contact Person' => $_POST['contactPerson'] ?? '',
        'Contact Email' => $_POST['contactEmail'] ?? '',
        'Additional Information' => $_POST['additionalInfo'] ?? '',
            'Company Profile' => $_FILES['companyProfile'] ?? '',
            'VAT Certificate' => $_FILES['vatCertificate'] ?? '',
            'Trade Licence' => $_FILES['tradeLicence'] ?? '',
            'Emirates ID' => $_FILES['emiratesId'] ?? '',
        'Job Titles / Roles Needed' => $_POST['jobTitles'] ?? '',
        'Experience Level' => $_POST['experienceLevel'] ?? '',
        'Nationality Preference' => $_POST['nationalityPreference'] ?? '',
        'Gender Preference' => $_POST['genderPreference'] ?? '',
        'Expected Joining Date' => $_POST['joiningDate'] ?? '',
    ];
    $body = "A new manpower request has been submitted:\n\n";
    foreach ($fields as $label => $value) {
        $body .= "$label: " . htmlspecialchars($value) . "\n";
    }
        // Handle file uploads
        if (isset($_FILES['companyProfile'])) {
            // Process the company profile file
        }
        if (isset($_FILES['vatCertificate'])) {
            // Process the VAT certificate file
        }
        if (isset($_FILES['tradeLicence'])) {
            // Process the trade licence file
        }
        if (isset($_FILES['emiratesId'])) {
            // Process the Emirates ID file
        }

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
        if (!empty($fields['Contact Email'])) {
            $mail->addReplyTo($fields['Contact Email'], $fields['Contact Person']);
        }
        $mail->Subject = 'New Manpower Request from ' . $fields['Company Name'];
        $mail->Body    = $body;

        $mail->send();
        echo json_encode(["success" => true]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "error" => $mail->ErrorInfo]);
    }
    exit;
}
// If accessed directly, show nothing
http_response_code(403);
exit;
?>
