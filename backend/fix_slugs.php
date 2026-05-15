<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$mapping = [
    'Dental Implant' => 'dental-implant',
    'Hollywood Smile' => 'hollywood-smile',
    'Male Hair Transplant' => 'male-hair-transplant',
    'Female Hair Transplant' => 'female-hair-transplant',
    'Beard & Moustache Transplant' => 'beard-moustache-transplant',
    'Eyebrow Transplant' => 'eyebrow-transplant',
];

$ts = \App\Models\Treatment::all();
foreach($ts as $t) {
    $catEn = is_array($t->category) ? ($t->category['en'] ?? null) : $t->category;
    if ($catEn && isset($mapping[$catEn])) {
        $canonicalSlug = $mapping[$catEn];
        if ($t->slug !== $canonicalSlug) {
            echo "Updating ID: {$t->id} | {$catEn} | old slug: {$t->slug} -> new slug: {$canonicalSlug}\n";
            $t->slug = $canonicalSlug;
            $t->save();
        }
    }
}
echo "Done.\n";
