<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;

$coreSlugs = [
    'dental-implant',
    'hollywood-smile',
    'male-hair-transplant',
    'female-hair-transplant',
    'beard-moustache-transplant',
    'eyebrow-transplant'
];

echo "--- DATA CLEANUP START ---\n";

// 1. Delete invalid/dummy treatments
$toDelete = Treatment::whereNotIn('slug', $coreSlugs)->get();
foreach ($toDelete as $t) {
    echo "Deleting dummy treatment: {$t->slug}\n";
    $t->delete();
}

// 2. Initialize default content for core 6 if empty
foreach ($coreSlugs as $slug) {
    $t = Treatment::where('slug', $slug)->first();
    if (!$t) {
        echo "Warning: Core treatment $slug MISSING. Recreating basic record...\n";
        $t = new Treatment();
        $t->slug = $slug;
        $t->is_active = true;
    }

    $titleEn = ucwords(str_replace('-', ' ', $slug));
    $t->title = ['en' => $titleEn, 'ar' => $titleEn, 'fr' => $titleEn, 'ru' => $titleEn];
    
    // Normalize Category
    if (str_contains($slug, 'dental') || str_contains($slug, 'smile')) {
        $t->category = ['en' => 'Dental', 'ar' => 'طب الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология'];
    } else {
        $t->category = ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка волос'];
    }

    // Initialize content_sections if empty or null
    if (empty($t->content_sections)) {
        echo "Initializing content_sections for $slug...\n";
        $t->content_sections = [
            [
                'title' => ['en' => 'Premium Treatment Experience', 'ar' => 'تجربة علاج متميزة'],
                'subtitle' => ['en' => 'Unmatched Quality', 'ar' => 'جودة لا مثيل لها'],
                'description' => ['en' => 'Our clinic provides world-class expertise using the latest global technologies. Each procedure is tailored to your unique anatomical needs ensuring natural and lasting results.', 'ar' => 'تقدم عيادتنا خبرة عالمية المستوى باستخدام أحدث التقنيات العالمية. يتم تصميم كل إجراء وفقًا لاحتياجاتك التشريحية الفريدة لضمان نتائج طبيعية ودائمة.'],
                'image' => 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
            ],
            [
                'title' => ['en' => 'Advanced Technology & Precision', 'ar' => 'التكنولوجيا المتقدمة والدقة'],
                'subtitle' => ['en' => 'Modern Innovation', 'ar' => 'ابتكار حديث'],
                'description' => ['en' => 'We utilize high-precision medical equipment to minimize recovery time and maximize success rates. Your safety and comfort are our primary priorities throughout the journey.', 'ar' => 'نحن نستخدم معدات طبية عالية الدقة لتقليل وقت التعافي وزيادة معدلات النجاح. سلامتك وراحتك هي أولوياتنا الأساسية طوال الرحلة.'],
                'image' => 'https://images.unsplash.com/photo-1471864190281-ad5fe9bb0724?auto=format&fit=crop&q=80&w=800'
            ]
        ];
    }

    // Ensure description is not empty
    if (empty($t->description) || ($t->description['en'] ?? '') == '') {
        $t->description = [
            'en' => "Experience elite care for $titleEn with our internationally recognized specialists.",
            'ar' => "جرب النخبة في رعاية $titleEn مع المتخصصين المعترف بهم دوليًا."
        ];
    }

    $t->save();
}

echo "--- DATA CLEANUP COMPLETE ---\n";
