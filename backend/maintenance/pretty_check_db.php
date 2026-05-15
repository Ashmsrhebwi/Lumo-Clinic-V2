<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'gravity_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());

function get_json_en($json) {
    $arr = json_decode($json, true);
    return is_array($arr) ? ($arr['en'] ?? 'N/A') : $json;
}

echo "--- ALL TREATMENTS ---\n";
$result = mysqli_query($conn, "SELECT id, slug, title FROM treatments");
while ($row = mysqli_fetch_assoc($result)) {
    echo "ID: " . str_pad($row['id'], 3) . " | Slug: " . str_pad($row['slug'], 30) . " | Title: " . get_json_en($row['title']) . "\n";
}

echo "\n--- ALL NAVBAR ITEMS ---\n";
$result = mysqli_query($conn, "SELECT id, label, custom_url, treatment_id FROM navbar_items");
while ($row = mysqli_fetch_assoc($result)) {
    echo "ID: " . str_pad($row['id'], 3) . " | Label: " . str_pad(get_json_en($row['label']), 20) . " | URL: " . str_pad($row['custom_url'] ?: 'NULL', 30) . " | Treatment ID: " . ($row['treatment_id'] ?: 'NULL') . "\n";
}

mysqli_close($conn);
