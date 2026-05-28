<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Setting;

// Initialize Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Final Migration: Wrapping sections for Frontend ===\n\n";

try {
    $sectionTitles = DB::table('section_titles')->get();
    
    $transformedData = [];
    foreach ($sectionTitles as $row) {
        $title = is_string($row->title) ? json_decode($row->title, true) : $row->title;
        $subtitle = is_string($row->subtitle) ? json_decode($row->subtitle, true) : $row->subtitle;
        
        $transformedData[$row->key] = [
            'title' => $title,
            'subtitle' => $subtitle
        ];
    }

    // --- هنا التعديل الجوهري: تغليف البيانات ---
    // الـ Frontend يتوقع هيكل { "sections": { ... } }
    $finalData = ['sections' => $transformedData];
    
    $existing = Setting::where('key', 'sections')->first();
    
    if ($existing) {
        $existing->value = json_encode($finalData);
        $existing->save();
        echo "✅ تم تحديث جدول الإعدادات بالهيكل الجديد بنجاح!\n";
    } else {
        Setting::create([
            'key' => 'sections',
            'value' => json_encode($finalData)
        ]);
        echo "✅ تم إنشاء السجل الجديد بالهيكل الصحيح بنجاح!\n";
    }

    echo "\n✨ المهمة اكتملت! الـ API سيرسل الآن الهيكل الصحيح للـ Frontend.\n";
    
} catch (\Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    exit(1);
}