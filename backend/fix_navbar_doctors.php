<?php

use App\Models\NavbarSection;
use App\Models\NavbarItem;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- ALL NAVBAR SECTIONS ---\n";
$sections = NavbarSection::all();
foreach ($sections as $s) {
    echo "ID: {$s->id} | Label(en): " . ($s->label['en'] ?? 'N/A') . " | Footer: " . ($s->is_footer ? 'YES' : 'NO') . " | Active: " . ($s->is_active ? 'YES' : 'NO') . "\n";
}

echo "\n--- ITEMS IN 'About Us' SECTIONS ---\n";
$aboutSections = NavbarSection::where('label->en', 'About Us')->get();
foreach ($aboutSections as $as) {
    echo "Section ID: {$as->id} (Footer: " . ($as->is_footer ? 'YES' : 'NO') . ")\n";
    
    // Ensure Contact Us is order 4 in THIS section
    NavbarItem::where('navbar_section_id', $as->id)
        ->where('label->en', 'Contact Us')
        ->update(['order' => 4]);

    // Update/Create Our Doctors in THIS section
    $item = NavbarItem::updateOrCreate(
        [
            'navbar_section_id' => $as->id,
            'label->en' => 'Our Doctors'
        ],
        [
            'label' => [
                'en' => 'Our Doctors',
                'ar' => 'أطباؤنا',
                'fr' => 'Nos Docteurs',
                'ru' => 'Наши врачи'
            ],
            'custom_url' => '/doctors',
            'order' => 3,
            'is_active' => true,
            'open_in_new_tab' => false
        ]
    );
    echo "   -> 'Our Doctors' saved/updated (ID: {$item->id}, Active: 1, Order: 3)\n";

    $items = NavbarItem::where('navbar_section_id', $as->id)->orderBy('order')->get();
    foreach ($items as $v) {
        echo "      - " . ($v->label['en'] ?? 'N/A') . " (id: {$v->id}, order: {$v->order}, active: ".($v->is_active?'1':'0').", url: {$v->custom_url})\n";
    }
}

echo "\n--- API SIMULATION ---\n";
$controller = new \App\Http\Controllers\Api\V1\Public\InitController();
$resp = $controller->initFull();
$navLinks = $resp->getData()->navLinks;
foreach ($navLinks as $nav) {
    echo "Link Group: " . $nav->label->en . " (id: {$nav->id})\n";
    if (isset($nav->children)) {
        foreach ($nav->children as $child) {
            echo "   - " . $child->label->en . " (id: {$child->id}, path: {$child->path})\n";
        }
    }
}
