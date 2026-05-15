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

$output = "--- CANONICAL TREATMENTS IN DB ---\n";
foreach ($slugs as $slug) {
    $t = Treatment::where('slug', $slug)->first();
    if ($t) {
        $cs = count($t->content_sections ?? []);
        $output .= "SLUG: $slug | ID: {$t->id} | Title: " . ($t->title['en'] ?? 'NULL') . " | ContentSections: $cs\n";
    } else {
        $output .= "SLUG: $slug | MISSING IN DB! ❌\n";
    }
}

$output .= "\n--- NAVBAR RESOLUTION ---\n";
foreach ($slugs as $slug) {
    $targetLabel = ucwords(str_replace('-', ' ', $slug));
    $t = Treatment::where('slug', $slug)->first();
    $tId = $t ? $t->id : null;
    
    $item = NavbarItem::where('treatment_id', $tId)->first();
    if (!$item) {
        $item = NavbarItem::where('label->en', 'like', "%$targetLabel%")->first();
    }

    if ($item) {
        $path = $item->custom_url ?: 'DYNAMIC(/treatment/' . ($item->treatment->slug ?? 'ERR') . ')';
        $actualLinkedT = $item->treatment_id ? Treatment::find($item->treatment_id) : null;
        $output .= "Target: $targetLabel | ActualLabel: " . ($item->label['en'] ?? 'NULL') . " | Path: $path | LinkedTreatment: " . ($actualLinkedT ? $actualLinkedT->slug : 'NONE') . " (ID: " . ($item->treatment_id ?? 'NULL') . ")\n";
    } else {
        $output .= "Target: $targetLabel | NOT FOUND in navbar_items table! ❌\n";
    }
}

file_put_contents('audit_results.txt', $output);
echo "Audit complete. Results in audit_results.txt\n";
