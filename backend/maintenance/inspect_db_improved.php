<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'Lumo_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());

echo "=== TREATMENTS ===\n";
$result = mysqli_query($conn, "SELECT id, slug, title FROM treatments");
while ($row = mysqli_fetch_assoc($result)) {
    echo "ID: {$row['id']} | Slug: {$row['slug']} | Title: {$row['title']}\n";
}

echo "\n=== NAVBAR ITEMS ===\n";
$result = mysqli_query($conn, "SELECT id, label, custom_url, treatment_id, section_id FROM navbar_items ORDER BY section_id, `order` ASC");
while ($row = mysqli_fetch_assoc($result)) {
    $label = json_decode($row['label'], true);
    $text = $label['en'] ?? $row['label'];
    echo "ID: {$row['id']} | Section ID: {$row['section_id']} | Label: $text | URL: " . ($row['custom_url'] ?: 'NULL') . " | Treatment ID: " . ($row['treatment_id'] ?: 'NULL') . "\n";
}

mysqli_close($conn);
