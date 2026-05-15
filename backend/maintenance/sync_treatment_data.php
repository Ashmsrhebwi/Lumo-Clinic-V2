<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;

$targetMappings = [
    'Dental Implant' => 'dental-implant',
    'Hollywood Smile' => 'hollywood-smile',
    'Male Hair Transplant' => 'male-hair-transplant',
    'Female Hair Transplant' => 'female-hair-transplant',
    'Beard & Moustache Transplant' => 'beard-moustache-transplant',
    'Eyebrow Transplant' => 'eyebrow-transplant',
];

echo "COMMENCING CANONICAL SLUG SYNCHRONIZATION...\n";
echo "===========================================\n";

$treatments = Treatment::all();
$updated = [];
$skipped = [];
$missing = array_keys($targetMappings);

foreach ($treatments as $t) {
    // Get the English category name correctly
    $cat = null;
    $rawCat = $t->getRawOriginal('category');
    
    if ($rawCat) {
        $decoded = json_decode($rawCat, true);
        if (json_last_error() === JSON_ERROR_NONE && isset($decoded['en'])) {
            $cat = $decoded['en'];
        } else {
            $cat = $rawCat; // Fallback for plain string
        }
    }

    if ($cat && isset($targetMappings[$cat])) {
        $expectedSlug = $targetMappings[$cat];
        $oldSlug = $t->slug;
        
        if ($oldSlug !== $expectedSlug) {
            $t->slug = $expectedSlug;
            $t->save();
            $updated[] = "ID {$t->id} [{$cat}]: {$oldSlug} -> {$expectedSlug}";
        } else {
            $skipped[] = "ID {$t->id} [{$cat}]: Already synchronized ({$expectedSlug})";
        }
        
        // Remove from missing list
        $missing = array_filter($missing, fn($m) => $m !== $cat);
    }
}

echo "\n--- UPDATED ---\n";
foreach ($updated as $line) echo "+ {$line}\n";

echo "\n--- SKIPPED ---\n";
foreach ($skipped as $line) echo ". {$line}\n";

if (!empty($missing)) {
    echo "\n--- MISSING CATEGORIES (NOT FOUND IN DB) ---\n";
    foreach ($missing as $m) echo "! {$m}\n";
}

echo "\nDONE.\n";
