<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'Lumo_clinic_new');
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
echo "Connected successfully\n";

$result = mysqli_query($conn, "SELECT * FROM treatments");
while ($row = mysqli_fetch_assoc($result)) {
    echo "Treatment: {$row['slug']} (ID: {$row['id']})\n";
}

$result = mysqli_query($conn, "SELECT * FROM navbar_items");
while ($row = mysqli_fetch_assoc($result)) {
    echo "Nav Item Name: " . $row['label'] . " (ID: {$row['id']}) | URL: " . ($row['custom_url'] ?: 'NULL') . " | Treatment ID: " . ($row['treatment_id'] ?: 'NULL') . "\n";
}
mysqli_close($conn);
