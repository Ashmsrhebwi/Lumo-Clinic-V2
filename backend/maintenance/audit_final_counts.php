<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$results = [];

// 4. Content sections for 6 treatments
$slugs = ['dental-implant', 'hollywood-smile', 'male-hair-transplant', 'female-hair-transplant', 'beard-moustache-transplant', 'eyebrow-transplant'];
foreach ($slugs as $s) {
    $t = \App\Models\Treatment::where('slug', $s)->first();
    $results['treatment_content'][$s] = $t ? count($t->content_sections ?? []) : 'N/A';
}

// 6. Results images
$results['results_total'] = \App\Models\Result::count();
$results['results_with_before'] = \App\Models\Result::whereNotNull('before_image_url')->count();
$results['results_with_after'] = \App\Models\Result::whereNotNull('after_image_url')->count();

echo json_encode($results, JSON_PRETTY_PRINT);
