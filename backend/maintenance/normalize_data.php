<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../bootstrap/app.php';

use App\Models\Treatment;
use App\Models\Article;
use App\Models\Testimonial;
use App\Models\Result;

$validTitles = [
    'Dental Implant',
    'Hollywood Smile',
    'Male Hair Transplant',
    'Female Hair Transplant',
    'Beard & Moustache Transplant',
    'Eyebrow Transplant'
];

echo "Starting normalization...\n";

$treatments = Treatment::all();
foreach ($treatments as $t) {
    if (!in_array($t->title['en'] ?? '', $validTitles)) {
        echo "Deleting non-canonical treatment: " . ($t->title['en'] ?? 'Untitled') . " (ID: {$t->id})\n";
        $t->delete();
    }
}

$first = Treatment::first();
if (!$first) {
    echo "ERROR: NO CANONICAL TREATMENTS FOUND! Run seeders first.\n";
    exit(1);
}

echo "Canonical treatment ID: {$first->id} ({$first->title['en']})\n";

// Fix Articles
$articles = Article::all();
foreach ($articles as $a) {
    if (!in_array($a->category['en'] ?? '', $validTitles)) {
        echo "Fixing Article category for: " . ($a->title['en'] ?? 'Untitled') . "\n";
        $a->category = $first->title;
        $a->save();
    }
}

// Fix Testimonials
$testimonials = Testimonial::all();
foreach ($testimonials as $tes) {
    if (!$tes->treatment_id || !Treatment::find($tes->treatment_id)) {
        echo "Fixing Testimonial treatment_id for: " . ($tes->patient_name['en'] ?? 'Anonymous') . "\n";
        $tes->treatment_id = $first->id;
        $tes->save();
    }
}

// Fix Results
$results = Result::all();
foreach ($results as $r) {
    if (!$r->treatment_id || !Treatment::find($r->treatment_id)) {
        echo "Fixing Result treatment_id for: " . ($r->patient_name['en'] ?? 'Result') . "\n";
        $r->treatment_id = $first->id;
        $r->save();
    }
}

echo "NORMALIZATION_COMPLETE\n";
