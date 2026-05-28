<?php
$conn = mysqli_connect('127.0.0.1', 'root', '', 'Lumo_clinic_new');

$result = mysqli_query($conn, "SELECT id, label FROM navbar_sections");
while ($row = mysqli_fetch_assoc($result)) {
    $label = json_decode($row['label'], true)['en'] ?? $row['label'];
    echo "SECTION ID: {$row['id']} | Label: $label\n";
}
mysqli_close($conn);
