<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'gravity_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());

$expected_treatments = [
    'dental-implant',
    'hollywood-smile',
    'male-hair-transplant',
    'female-hair-transplant',
    'beard-moustache-transplant',
    'eyebrow-transplant'
];

echo "--- CHECKING EXPECTED TREATMENTS ---\n";
foreach ($expected_treatments as $slug) {
    $result = mysqli_query($conn, "SELECT id, slug FROM treatments WHERE slug = '$slug'");
    $row = mysqli_fetch_assoc($result);
    if ($row) {
        echo "FOUND: $slug (ID: {$row['id']})\n";
    } else {
        echo "MISSING: $slug\n";
    }
}

echo "\n--- CHECKING NAVBAR ITEMS FOR TREATMENTS ---\n";
$result = mysqli_query($conn, "SELECT id, label, treatment_id, custom_url FROM navbar_items");
while ($row = mysqli_fetch_assoc($result)) {
    $labelArr = json_decode($row['label'], true);
    $enLabel = $labelArr['en'] ?? $row['label'];
    echo "ID: {$row['id']} | Label: $enLabel | Treatment ID: " . ($row['treatment_id'] ?: 'NULL') . " | Custom URL: " . ($row['custom_url'] ?: 'NULL') . "\n";
}

mysqli_close($conn);
