<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
$ts = \App\Models\Treatment::all();
foreach($ts as $t) {
    $catEn = is_array($t->category) ? ($t->category['en'] ?? 'N/A') : $t->category;
    echo "ID: {$t->id} | Category: {$catEn} | Slug: {$t->slug}\n";
}
