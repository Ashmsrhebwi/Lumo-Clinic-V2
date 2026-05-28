<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'Lumo_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());

$result = mysqli_query($conn, "SELECT COUNT(*) as count FROM treatments");
$row = mysqli_fetch_assoc($result);
echo "Total treatments: " . $row['count'] . "\n";

$result = mysqli_query($conn, "SELECT id, slug FROM treatments");
while ($row = mysqli_fetch_assoc($result)) {
    echo "TREATMENT ID: {$row['id']} | Slug: {$row['slug']}\n";
}

$result = mysqli_query($conn, "SELECT COUNT(*) as count FROM navbar_items");
$row = mysqli_fetch_assoc($result);
echo "Total navbar items: " . $row['count'] . "\n";

$result = mysqli_query($conn, "SELECT id, label, custom_url, treatment_id FROM navbar_items");
while ($row = mysqli_fetch_assoc($result)) {
    $labelArr = json_decode($row['label'], true);
    $label = $labelArr['en'] ?? $row['label'];
    echo "ITEM ID: {$row['id']} | Label: $label | URL: " . ($row['custom_url'] ?: 'NULL') . " | Treatment ID: " . ($row['treatment_id'] ?: 'NULL') . "\n";
}

mysqli_close($conn);
