<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;
use App\Models\NavbarItem;
use App\Models\NavbarSection;

echo "--- TREATMENTS ---\n";
$treatments = Treatment::all();
foreach ($treatments as $t) {
    echo "ID: {$t->id} | Slug: {$t->slug} | Title: " . ($t->title['en'] ?? 'N/A') . " | Category: " . ($t->category['en'] ?? (is_string($t->category) ? $t->category : 'N/A')) . "\n";
}

echo "\n--- NAVBAR ITEMS ---\n";
$sections = NavbarSection::with('items')->get();
foreach ($sections as $s) {
    echo "Section: " . ($s->label['en'] ?? 'N/A') . "\n";
    foreach ($s->items as $i) {
        $t = $i->treatment_id ? Treatment::find($i->treatment_id) : null;
        echo "  Label: " . ($i->label['en'] ?? 'N/A') . " | Path: {$i->custom_url} | Linked Treatment: " . ($t ? "{$t->slug} (ID: {$t->id})" : "None") . "\n";
    }
}
