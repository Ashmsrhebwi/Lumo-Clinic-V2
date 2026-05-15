<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;
use App\Models\NavbarSection;
use App\Models\NavbarItem;
use App\Models\Setting;
use App\Models\Result;

$audit = [];

// 1. Why Choose Us
$wcu = Setting::where('key', 'why_choose_us_features')->first();
$audit['wcu_exists'] = !!$wcu;
$audit['wcu_count'] = $wcu && is_array($wcu->value) ? count($wcu->value) : 0;

// 2 & 9. Treatments
$slugs = ['dental-implant', 'hollywood-smile', 'male-hair-transplant', 'female-hair-transplant', 'beard-moustache-transplant', 'eyebrow-transplant'];
$audit['treatments'] = [];
foreach ($slugs as $s) {
    $t = Treatment::where('slug', $s)->first();
    $audit['treatments'][$s] = $t ? [
        'id' => $t->id,
        'cat' => is_array($t->category) ? $t->category['en'] : $t->category,
        'sections' => is_array($t->content_sections) ? count($t->content_sections) : 0
    ] : 'MISSING';
}

// 7. Navbar
$audit['navbar'] = [];
$sections = NavbarSection::where('is_footer', false)->get();
foreach ($sections as $sec) {
    $label = is_array($sec->label) ? $sec->label['en'] : $sec->label;
    $items = [];
    foreach ($sec->items as $item) {
        $items[] = [
            'label' => is_array($item->label) ? $item->label['en'] : $item->label,
            'slug' => $item->treatment ? $item->treatment->slug : null,
            'url' => $item->custom_url
        ];
    }
    $audit['navbar'][$label] = $items;
}

// 6. Results
$audit['results_count'] = Result::count();
$audit['results_with_both_images'] = Result::whereNotNull('before_image_url')->whereNotNull('after_image_url')->count();

header('Content-Type: application/json');
echo json_encode($audit, JSON_PRETTY_PRINT);
