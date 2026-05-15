<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$treatments = \App\Models\Treatment::all()->map(function($t) {
    return [
        'id' => $t->id,
        'slug' => $t->slug,
        'title' => $t->title['en'] ?? 'N/A'
    ];
});
echo json_encode($treatments, JSON_PRETTY_PRINT);
