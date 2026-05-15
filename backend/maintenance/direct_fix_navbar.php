<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;
use App\Models\NavbarSection;
use App\Models\NavbarItem;
use Illuminate\Support\Facades\DB;

echo "Starting fix...\n";
DB::beginTransaction();
try {
    $treatmentsData = [
        ['slug' => 'dental-implant', 'title' => ['en' => 'Dental Implant', 'ar' => 'زراعة الأسنان', 'fr' => 'Implant Dentaire', 'ru' => 'Имплантация'], 'category' => 'Dental'],
        ['slug' => 'hollywood-smile', 'title' => ['en' => 'Hollywood Smile', 'ar' => 'ابتسامة هوليود', 'fr' => 'Sourire Hollywood', 'ru' => 'Голливудская улыбка'], 'category' => 'Dental'],
        ['slug' => 'male-hair-transplant', 'title' => ['en' => 'Male Hair Transplant', 'ar' => 'زراعة الشعر للرجال', 'fr' => 'Greffe Homme', 'ru' => 'Мужчины'], 'category' => 'Hair Transplant'],
        ['slug' => 'female-hair-transplant', 'title' => ['en' => 'Female Hair Transplant', 'ar' => 'زراعة الشعر للنساء', 'fr' => 'Greffe Femme', 'ru' => 'Женщины'], 'category' => 'Hair Transplant'],
        ['slug' => 'beard-moustache-transplant', 'title' => ['en' => 'Beard & Moustache Transplant', 'ar' => 'زراعة اللحية والشارب', 'fr' => 'Barbe', 'ru' => 'Борода'], 'category' => 'Hair Transplant'],
        ['slug' => 'eyebrow-transplant', 'title' => ['en' => 'Eyebrow Transplant', 'ar' => 'زراعة الحواجب', 'fr' => 'Greffe Sourcils', 'ru' => 'Брови'], 'category' => 'Hair Transplant'],
    ];

    $treatmentIds = [];
    foreach ($treatmentsData as $tData) {
        $treatment = Treatment::where('slug', $tData['slug'])->first();
        if (!$treatment) {
            $treatment = new Treatment();
            $treatment->slug = $tData['slug'];
        }
        $treatment->title = $tData['title'];
        $treatment->category = $tData['category'];
        $treatment->description = ['en' => '...'];
        $treatment->success_rate = 99;
        $treatment->duration = ['en' => '1 Day'];
        $treatment->is_active = true;
        $treatment->order = 1;
        $treatment->save();
        $treatmentIds[$tData['slug']] = $treatment->id;
        echo "Treatment OK: {$tData['slug']} (ID: {$treatment->id})\n";
    }

    // Ensure Sections exist
    $dentalSection = NavbarSection::where('label->en', 'Dental')->first();
    if (!$dentalSection) {
        $dentalSection = NavbarSection::create([
            'label' => ['en' => 'Dental', 'ar' => 'الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология'],
            'order' => 1,
            'is_active' => true,
            'is_footer' => false
        ]);
    }
    
    $hairSection = NavbarSection::where('label->en', 'Hair Transplant')->first();
    if (!$hairSection) {
        $hairSection = NavbarSection::create([
            'label' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка Волос'],
            'order' => 2,
            'is_active' => true,
            'is_footer' => false
        ]);
    }

    echo "Sections OK\n";

    // Link items
    $links = [
        ['section_id' => $dentalSection->id, 'slug' => 'dental-implant', 'label' => ['en' => 'Dental Implant', 'ar' => 'زراعة الأسنان', 'fr' => 'Implant Dentaire', 'ru' => 'Зубной имплантат'], 'order' => 1],
        ['section_id' => $dentalSection->id, 'slug' => 'hollywood-smile', 'label' => ['en' => 'Hollywood Smile', 'ar' => 'ابتسامة هوليود', 'fr' => 'Sourire Hollywood', 'ru' => 'Голливудская улыбка'], 'order' => 2],
        ['section_id' => $hairSection->id, 'slug' => 'male-hair-transplant', 'label' => ['en' => 'Male Hair Transplant', 'ar' => 'زراعة الشعر للرجال', 'fr' => 'Greffe de Cheveux Homme', 'ru' => 'Пересадка волос у мужчин'], 'order' => 1],
        ['section_id' => $hairSection->id, 'slug' => 'female-hair-transplant', 'label' => ['en' => 'Female Hair Transplant', 'ar' => 'زراعة الشعر للنساء', 'fr' => 'Greffe de Cheveux Femme', 'ru' => 'Переساдка волос у женщин'], 'order' => 2],
        ['section_id' => $hairSection->id, 'slug' => 'beard-moustache-transplant', 'label' => ['en' => 'Beard & Moustache Transplant', 'ar' => 'زراعة اللحية والشارب', 'fr' => 'Greffe de Barbe et Moustache', 'ru' => 'Пересадка бороды и усов'], 'order' => 3],
        ['section_id' => $hairSection->id, 'slug' => 'eyebrow-transplant', 'label' => ['en' => 'Eyebrow Transplant', 'ar' => 'زراعة الحواجب', 'fr' => 'Greffe de Sourcils', 'ru' => 'Пересадка бровей'], 'order' => 4],
    ];

    foreach ($links as $link) {
        $item = NavbarItem::where('navbar_section_id', $link['section_id'])
                          ->where('label->en', $link['label']['en'])
                          ->first();
        if (!$item) {
            $item = new NavbarItem();
            $item->navbar_section_id = $link['section_id'];
        }
        $item->treatment_id = $treatmentIds[$link['slug']];
        $item->custom_url = null;
        $item->order = $link['order'];
        $item->is_active = true;
        $item->label = $link['label'];
        $item->save();
        echo "NavbarItem OK: {$link['label']['en']}\n";
    }

    DB::commit();
    echo "SUCCESS: Navbar fixed\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
}
