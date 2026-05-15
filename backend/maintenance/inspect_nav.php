<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\NavbarSection;
use App\Models\NavbarItem;
use App\Models\Treatment;

$sections = NavbarSection::with('items')->get();

echo "NAVBAR SECTIONS AND ITEMS:\n";
foreach ($sections as $section) {
    echo "Section: " . json_encode($section->label) . " (ID: {$section->id})\n";
    foreach ($section->items as $item) {
        $path = $item->custom_url ?: '#';
        if ($item->treatment_id) {
            $treatment = Treatment::find($item->treatment_id);
            if ($treatment) {
                $path = "/treatment/{$treatment->slug}";
            } else {
                $path = "!!! TREATMENT NOT FOUND (ID: {$item->treatment_id}) !!!";
            }
        }
        echo "  - Item: " . json_encode($item->label) . "\n";
        echo "    Path: {$path}\n";
        echo "    Treatment ID: " . ($item->treatment_id ?: 'NULL') . "\n";
        echo "    Custom URL: " . ($item->custom_url ?: 'NULL') . "\n";
    }
}

echo "\nTREATMENTS:\n";
foreach (Treatment::all() as $t) {
    echo "ID: {$t->id} | Slug: {$t->slug} | Title: " . json_encode($t->title) . "\n";
}
