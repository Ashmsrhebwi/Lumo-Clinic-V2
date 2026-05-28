<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;
use App\Models\NavbarSection;
use App\Models\NavbarItem;
use Illuminate\Support\Facades\DB;

echo "--- RESTORATION START ---\n\n";

// 1. Cleanup Dummy Records
Treatment::where('slug', 'like', 'new-treatment%')->delete();
echo "Cleaned dummy 'new-treatment' records.\n";

// 2. Define Required Treatments
$required = [
    [
        'slug' => 'dental-implant',
        'title' => ['en' => 'Dental Implant', 'ar' => 'زراعة الأسنان', 'fr' => 'Implant Dentaire', 'ru' => 'Зубной имплантат'],
        'category' => ['en' => 'Dental', 'ar' => 'طب الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология']
    ],
    [
        'slug' => 'hollywood-smile',
        'title' => ['en' => 'Hollywood Smile', 'ar' => 'ابتسامة هوليود', 'fr' => 'Sourire Hollywood', 'ru' => 'Голливудская улыбка'],
        'category' => ['en' => 'Dental', 'ar' => 'طب الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология']
    ],
    [
        'slug' => 'male-hair-transplant',
        'title' => ['en' => 'Male Hair Transplant', 'ar' => 'زراعة الشعر للرجال', 'fr' => 'Greffe de Cheveux Homme', 'ru' => 'Пересадка волос у мужчин'],
        'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка волос']
    ],
    [
        'slug' => 'female-hair-transplant',
        'title' => ['en' => 'Female Hair Transplant', 'ar' => 'زراعة الشعر للنساء', 'fr' => 'Greffe de Cheveux Femme', 'ru' => 'Пересадка волос у женщин'],
        'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка волос']
    ],
    [
        'slug' => 'beard-moustache-transplant',
        'title' => ['en' => 'Beard & Moustache Transplant', 'ar' => 'زراعة اللحية والشارب', 'fr' => 'Greffe de Barbe et Moustache', 'ru' => 'Пересадка бороды и усов'],
        'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка волос']
    ],
    [
        'slug' => 'eyebrow-transplant',
        'title' => ['en' => 'Eyebrow Transplant', 'ar' => 'زراعة الحواجب', 'fr' => 'Greffe de Sourcils', 'ru' => 'Пересадка бровей'],
        'category' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка волос']
    ],
];

$treatmentIds = [];
foreach ($required as $data) {
    $t = Treatment::updateOrCreate(['slug' => $data['slug']], [
        'title' => $data['title'],
        'category' => $data['category'],
        'description' => ['en' => "Professional {$data['title']['en']} services at Lumo Clinic.", 'ar' => '', 'fr' => '', 'ru' => ''],
        'duration' => ['en' => '1 session', 'ar' => '', 'fr' => '', 'ru' => ''],
        'success_rate' => 99,
        'is_active' => true
    ]);
    $treatmentIds[$data['slug']] = $t->id;
    echo "Ensured treatment: {$data['slug']} (ID: {$t->id})\n";
}

// 3. Update Navbar Links
$sections = [
    'Dental' => [
        'Dental Implant' => 'dental-implant',
        'Hollywood Smile' => 'hollywood-smile'
    ],
    'Hair Transplant' => [
        'Male Hair Transplant' => 'male-hair-transplant',
        'Female Hair Transplant' => 'female-hair-transplant',
        'Beard & Moustache Transplant' => 'beard-moustache-transplant',
        'Eyebrow Transplant' => 'eyebrow-transplant'
    ]
];

foreach ($sections as $secLabel => $items) {
    $section = NavbarSection::where('label->en', $secLabel)->first();
    if (!$section) {
        $section = NavbarSection::create([
            'label' => ['en' => $secLabel, 'ar' => ($secLabel === 'Dental' ? 'طب الأسنان' : 'زراعة الشعر')],
            'order' => 1,
            'is_footer' => false,
            'is_active' => true
        ]);
    }

    foreach ($items as $itemLabel => $slug) {
        NavbarItem::updateOrCreate([
            'label->en' => $itemLabel
        ], [
            'section_id' => $section->id,
            'treatment_id' => $treatmentIds[$slug] ?? null,
            'label' => ['en' => $itemLabel, 'ar' => $itemLabel], // simplistic ar label for now
            'custom_url' => "/treatment/{$slug}",
            'order' => array_search($slug, array_keys($items)),
            'is_active' => true
        ]);
        echo "Linked navbar item '{$itemLabel}' to treatment '{$slug}'.\n";
    }
}

echo "\n--- RESTORATION COMPLETE ---";
