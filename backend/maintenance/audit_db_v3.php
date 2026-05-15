<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;
use App\Models\NavbarItem;

$slugs = [
    'dental-implant',
    'hollywood-smile',
    'male-hair-transplant',
    'female-hair-transplant',
    'beard-moustache-transplant',
    'eyebrow-transplant'
];

echo "--- CANONICAL TREATMENTS IN DB ---\n";
foreach ($slugs as $slug) {
    $t = Treatment::where('slug', $slug)->first();
    if ($t) {
        $cs = count($t->content_sections ?? []);
        echo "SLUG: $slug | ID: {$t->id} | Title: " . ($t->title['en'] ?? 'NULL') . " | ContentSections: $cs\n";
    } else {
        echo "SLUG: $slug | MISSING IN DB! ❌\n";
    }
}

echo "\n--- NAVBAR RESOLUTION ---\n";
$items = NavbarItem::all();
foreach ($slugs as $slug) {
    // Generate probable label from slug
    $targetLabel = ucwords(str_replace('-', ' ', $slug));
    
    // Find item by label or by linked treatment_id
    $t = Treatment::where('slug', $slug)->first();
    $tId = $t ? $t->id : null;
    
    $item = NavbarItem::where('treatment_id', $tId)->first();
    if (!$item) {
        $item = NavbarItem::where('label->en', 'like', "%$targetLabel%")->first();
    }

    if ($item) {
        $path = $item->custom_url ?: 'DYNAMIC(/treatment/' . ($item->treatment->slug ?? 'ERR') . ')';
        $actualLinkedT = $item->treatment_id ? Treatment::find($item->treatment_id) : null;
        echo "Target: $targetLabel | ActualLabel: " . ($item->label['en'] ?? 'NULL') . " | Path: $path | LinkedTreatment: " . ($actualLinkedT ? $actualLinkedT->slug : 'NONE') . " (ID: " . ($item->treatment_id ?? 'NULL') . ")\n";
    } else {
        echo "Target: $targetLabel | NOT FOUND in navbar_items table! ❌\n";
    }
}
