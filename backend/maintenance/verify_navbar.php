<?php
$json = file_get_contents('http://127.0.0.1:8000/api/public/nav-links');
$data = json_decode($json, true);
if (!$data) die("Failed to parse JSON\n");

foreach ($data as $section) {
    echo "Section: " . ($section['label']['en'] ?? 'N/A') . "\n";
    if (isset($section['children'])) {
        foreach ($section['children'] as $item) {
            echo "  - " . ($item['label']['en'] ?? 'N/A') . " -> " . ($item['path'] ?? 'N/A') . "\n";
        }
    }
}
