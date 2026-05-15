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
        echo "SLUG: $slug | ID: {$t->id} | Title: " . $t->title['en'] . " | Has Content: " . (isset($t->content_sections) && count($t->content_sections) > 0 ? 'YES' : 'NO') . "\n";
    } else {
        echo "SLUG: $slug | MISSING IN DB! ❌\n";
    }
}

echo "\n--- NAVBAR RESOLUTION ---\n";
foreach ($slugs as $slug) {
    $label = ucwords(str_replace('-', ' ', $slug));
    $item = NavbarItem::where('label->en', $label)->first();
    if (!$item) {
        // Try more fuzzy match for label
        $item = NavbarItem::where('label->en', 'like', "%$label%")->first();
    }
    
    if ($item) {
        $path = $item->custom_url;
        $tId = $item->treatment_id;
        $t = $tId ? Treatment::find($tId) : null;
        echo "Label: $label | Path in DB: $path | Linked Treatment ID: $tId (" . ($t ? $t->slug : 'None') . ")\n";
    } else {
        echo "Label: $label | NOT FOUND in navbar_items table! ❌\n";
    }
}
