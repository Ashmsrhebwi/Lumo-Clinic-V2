<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$required = ['dental-implant', 'hollywood-smile', 'male-hair-transplant', 'female-hair-transplant', 'beard-moustache-transplant', 'eyebrow-transplant'];
$found = \App\Models\Treatment::whereIn('slug', $required)->pluck('slug')->toArray();
$missing = array_diff($required, $found);

echo "Found: " . implode(',', $found) . "\n";
echo "Missing: " . implode(',', $missing) . "\n";

$results = \App\Models\Result::where('is_active', true)->get()->map(function($r) {
    return [
        'id' => $r->id,
        'has_before' => !!$r->before_image_url,
        'has_after' => !!$r->after_image_url,
    ];
});
echo "Results: " . json_encode($results) . "\n";
