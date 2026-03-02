<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $to = "info@talenzaworld.com";
    $subject = "New Manpower Request from " . htmlspecialchars($_POST['companyName']);
    $fields = [
        'Company Name' => $_POST['companyName'] ?? '',
        'Sector' => $_POST['sector'] ?? '',
        'Number of Employees Needed' => $_POST['numEmployees'] ?? '',
        'Contact Person' => $_POST['contactPerson'] ?? '',
        'Contact Email' => $_POST['contactEmail'] ?? '',
        'Additional Information' => $_POST['additionalInfo'] ?? '',
        'Job Titles / Roles Needed' => $_POST['jobTitles'] ?? '',
        'Experience Level' => $_POST['experienceLevel'] ?? '',
        'Nationality Preference' => $_POST['nationalityPreference'] ?? '',
        'Gender Preference' => $_POST['genderPreference'] ?? '',
        'Expected Joining Date' => $_POST['joiningDate'] ?? '',
    ];
    $message = "A new manpower request has been submitted:\n\n";
    foreach ($fields as $label => $value) {
        $message .= "$label: " . htmlspecialchars($value) . "\n";
    }
    $headers = "From: noreply@talenzaworld.com\r\n";
    $headers .= "Reply-To: " . htmlspecialchars($_POST['contactEmail']) . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Mail sending failed."]);
    }
    exit;
}
// If accessed directly, show nothing
http_response_code(403);
exit;
?>
