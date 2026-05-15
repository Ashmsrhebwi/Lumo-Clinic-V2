<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NavbarSection;
use App\Models\NavbarItem;
use App\Models\Treatment;
use Illuminate\Support\Facades\DB;

class NavigationSeeder extends Seeder
{
    public function run()
    {
        // 1. PURGE EXISTING NAVIGATION (Safe with DB statement)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        NavbarItem::truncate();
        NavbarSection::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. FETCH TREATMENTS (Assuming FullTreatmentSeeder already ran)
        $dentalImplant = Treatment::where('slug', 'dental-implant')->first();
        $hollywoodSmile = Treatment::where('slug', 'hollywood-smile')->first();
        $maleHair = Treatment::where('slug', 'male-hair-transplant')->first();
        $femaleHair = Treatment::where('slug', 'female-hair-transplant')->first();
        $beardTransplant = Treatment::where('slug', 'beard-moustache-transplant')->first();
        $eyebrowTransplant = Treatment::where('slug', 'eyebrow-transplant')->first();

        // 3. CREATE SECTIONS & ITEMS
        
        // SECTION: DENTAL
        $dentalSection = NavbarSection::create([
            'label' => ['en' => 'Dental', 'ar' => 'الأسنان', 'fr' => 'Dentaire', 'ru' => 'Стоматология'],
            'order' => 1,
            'is_footer' => true,
            'is_active' => true,
        ]);

        if ($dentalImplant) {
            NavbarItem::create([
                'navbar_section_id' => $dentalSection->id,
                'treatment_id' => $dentalImplant->id,
                'label' => ['en' => 'Dental Implant', 'ar' => 'زراعة الأسنان', 'fr' => 'Implant Dentaire', 'ru' => 'Зубной Имплантат'],
                'order' => 1,
                'is_active' => true,
            ]);
        }

        if ($hollywoodSmile) {
            NavbarItem::create([
                'navbar_section_id' => $dentalSection->id,
                'treatment_id' => $hollywoodSmile->id,
                'label' => ['en' => 'Hollywood Smile', 'ar' => 'ابتسامة هوليود', 'fr' => 'Sourire Hollywoodien', 'ru' => 'Голливудская Улыбка'],
                'order' => 2,
                'is_active' => true,
            ]);
        }

        // SECTION: HAIR TRANSPLANT
        $hairSection = NavbarSection::create([
            'label' => ['en' => 'Hair Transplant', 'ar' => 'زراعة الشعر', 'fr' => 'Greffe de Cheveux', 'ru' => 'Пересадка Волос'],
            'order' => 2,
            'is_footer' => true,
            'is_active' => true,
        ]);

        if ($maleHair) {
            NavbarItem::create([
                'navbar_section_id' => $hairSection->id,
                'treatment_id' => $maleHair->id,
                'label' => ['en' => 'Male Hair Transplant', 'ar' => 'زراعة الشعر للرجال', 'fr' => 'Greffe pour Hommes', 'ru' => 'Пересадка для Мужчин'],
                'order' => 1,
                'is_active' => true,
            ]);
        }

        if ($femaleHair) {
            NavbarItem::create([
                'navbar_section_id' => $hairSection->id,
                'treatment_id' => $femaleHair->id,
                'label' => ['en' => 'Female Hair Transplant', 'ar' => 'زراعة الشعر للنساء', 'fr' => 'Greffe pour Femmes', 'ru' => 'Переساдка для Женщин'],
                'order' => 2,
                'is_active' => true,
            ]);
        }

        if ($beardTransplant) {
            NavbarItem::create([
                'navbar_section_id' => $hairSection->id,
                'treatment_id' => $beardTransplant->id,
                'label' => ['en' => 'Beard & Moustache Transplant', 'ar' => 'زراعة اللحية والشارب', 'fr' => 'Barbe et Moustache', 'ru' => 'Борода и Усы'],
                'order' => 3,
                'is_active' => true,
            ]);
        }

        if ($eyebrowTransplant) {
            NavbarItem::create([
                'navbar_section_id' => $hairSection->id,
                'treatment_id' => $eyebrowTransplant->id,
                'label' => ['en' => 'Eyebrow Transplant', 'ar' => 'زراعة الحواجب', 'fr' => 'Greffe de Sourcils', 'ru' => 'Пересадка Бровей'],
                'order' => 4,
                'is_active' => true,
            ]);
        }

        // SECTION: ABOUT US
        $aboutSection = NavbarSection::create([
            'label' => ['en' => 'About Us', 'ar' => 'من نحن', 'fr' => 'À Propos', 'ru' => 'О Наس'],
            'order' => 3,
            'is_footer' => true,
            'is_active' => true,
        ]);

        NavbarItem::create([
            'navbar_section_id' => $aboutSection->id,
            'custom_url' => '/appointment',
            'label' => ['en' => 'Appointment', 'ar' => 'الموعد', 'fr' => 'Rendez-vous', 'ru' => 'Запись'],
            'order' => 1,
            'is_active' => true,
        ]);

        NavbarItem::create([
            'navbar_section_id' => $aboutSection->id,
            'custom_url' => '/blog',
            'label' => ['en' => 'Blog', 'ar' => 'المدونة', 'fr' => 'Blog', 'ru' => 'Блог'],
            'order' => 2,
            'is_active' => true,
        ]);

        NavbarItem::create([
            'navbar_section_id' => $aboutSection->id,
            'custom_url' => '/contact',
            'label' => ['en' => 'Contact Us', 'ar' => 'اتصل بنا', 'fr' => 'Contactez-nous', 'ru' => 'Контакты'],
            'order' => 3,
            'is_active' => true,
        ]);
    }
}
