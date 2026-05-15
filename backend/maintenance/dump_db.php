<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'gravity_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());

echo "=== TREATMENTS ===\n";
$result = mysqli_query($conn, "SELECT id, slug, title FROM treatments");
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        var_dump($row);
    }
}

echo "\n=== NAVBAR ITEMS ===\n";
$result = mysqli_query($conn, "SELECT id, label, custom_url, treatment_id FROM navbar_items");
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        var_dump($row);
    }
}
mysqli_close($conn);
