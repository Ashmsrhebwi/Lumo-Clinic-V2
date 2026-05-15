<?php

$url = 'http://localhost:8000/api/v1/public/init-full';

echo "Testing init-full endpoint: $url\n";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    echo "FAILURE: Endpoint returned HTTP $httpCode\n";
    // Try file_get_contents as fallback
    $response = @file_get_contents($url);
    if ($response === false) {
        die("STALEMATE: Could not connect to the backend server. Is 'php artisan serve' running?\n");
    }
}

$data = json_decode($response, true);

if (isset($data['status']) && $data['status'] === 'success') {
    echo "SUCCESS: API responded with success.\n";
    
    $treatmentCount = isset($data['data']['treatments']) ? count($data['data']['treatments']) : 0;
    $navbarCount = isset($data['data']['navbar']) ? count($data['data']['navbar']) : 0;
    
    echo "Audit Totals:\n";
    echo " - Treatments: $treatmentCount\n";
    echo " - Navbar Items: $navbarCount\n";
    
    if ($treatmentCount > 0 && $navbarCount > 0) {
        echo "VERIFICATION PASSED: Core data is present and active.\n";
    } else {
        echo "VERIFICATION FAILED: Missing core data in API response.\n";
    }
} else {
    echo "FAILURE: Malformed API response.\n";
    print_r($data);
}
