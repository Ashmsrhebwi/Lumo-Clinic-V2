<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Setting;
use App\Models\Treatment;

echo "--- FINAL SANITY CHECK ---\n\n";

// 1. Why Choose Us
$wcu = Setting::where('key', 'why_choose_us_features')->first();
if ($wcu && is_array($wcu->value) && count($wcu->value) > 0) {
    echo "[PASS] Why Choose Us Features exist in DB (Count: " . count($wcu->value) . ")\n";
} else {
    echo "[FAIL] Why Choose Us Features missing or empty!\n";
}

// 2. Treatment Content Blocks
$slugs = ['dental-implant', 'hollywood-smile', 'male-hair-transplant', 'female-hair-transplant', 'beard-moustache-transplant', 'eyebrow-transplant'];
foreach ($slugs as $s) {
    $t = Treatment::where('slug', $s)->first();
    if ($t) {
        $sections = $t->content_sections;
        if (is_array($sections)) {
             echo "[PASS] $s: Content blocks structure is valid array\n";
        } else {
             echo "[FAIL] $s: Content blocks is NOT an array\n";
        }
    } else {
        echo "[FAIL] $s: Treatment missing from DB!\n";
    }
}

// 3. Dummy check
$dummy = Treatment::where('slug', 'new-treatment')->first();
if ($dummy) {
    echo "[FAIL] Dummy treatment 'new-treatment' still exists!\n";
} else {
    echo "[PASS] Dummy treatment 'new-treatment' is GONE\n";
}

echo "\n--- CHECK COMPLETE ---";
