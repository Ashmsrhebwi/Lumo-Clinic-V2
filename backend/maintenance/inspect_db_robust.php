<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'gravity_clinic_new');
if (!$conn) die("Connection failed: " . mysqli_connect_error());

echo "=== TREATMENTS ===\n";
$result = mysqli_query($conn, "SELECT id, slug, title FROM treatments");
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $titleArr = json_decode($row['title'], true);
        $title = $titleArr['en'] ?? $row['title'] ?? 'N/A';
        echo "ID: {$row['id']} | Slug: {$row['slug']} | Title: $title\n";
    }
} else {
    echo "Query failed: " . mysqli_error($conn) . "\n";
}

echo "\n=== NAVBAR ITEMS ===\n";
$result = mysqli_query($conn, "SELECT id, label, custom_url, treatment_id, section_id FROM navbar_items");
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $labelArr = json_decode($row['label'], true);
        $label = $labelArr['en'] ?? $row['label'] ?? 'N/A';
        $path = $row['custom_url'] ?: 'NULL';
        $treatment_id = $row['treatment_id'] ?: 'NULL';
        echo "ID: {$row['id']} | Label: $label | URL: $path | Treatment ID: $treatment_id\n";
    }
} else {
    echo "Query failed: " . mysqli_error($conn) . "\n";
}

mysqli_close($conn);
