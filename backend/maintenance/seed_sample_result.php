<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Result;
use App\Models\Treatment;
use App\Models\Media;

// Clear Sarah J results
Result::where('patient_name->en', 'Sarah J.')->delete();

$treatment = Treatment::where('slug', 'hollywood-smile')->first();
if (!$treatment) {
    echo "Treatment not found\n";
    exit;
}

// Create sample media with external URLs in path (for demo)
$beforeMedia = Media::create([
    'filename' => 'before.jpg',
    'path' => 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    'mime_type' => 'image/jpeg',
    'size' => 1024,
    'alt_text' => ['en' => 'Before Hollywood Smile']
]);

$afterMedia = Media::create([
    'filename' => 'after.jpg',
    'path' => 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800',
    'mime_type' => 'image/jpeg',
    'size' => 1024,
    'alt_text' => ['en' => 'After Hollywood Smile']
]);

Result::create([
    'treatment_id' => $treatment->id,
    'before_media_id' => $beforeMedia->id,
    'after_media_id' => $afterMedia->id,
    'patient_name' => ['en' => 'Sarah J.', 'ar' => 'سارة ج.', 'fr' => 'Sarah J.', 'ru' => 'Сара Дж.'],
    'story' => [
        'en' => 'My confidence has completely changed after the Hollywood Smile procedure at Gravity Clinic.',
        'ar' => 'لقد تغيرت ثقتي بنفسي تمامًا بعد إجراء ابتسامة هوليود في جرافتي كلينك.',
        'fr' => 'Ma confiance a complètement changé après la procédure Hollywood Smile à la Gravity Clinic.',
        'ru' => 'Моя уверенность полностью изменилась после процедуры "Голливудская улыбка" в клинике "Гравити".'
    ],
    'is_active' => true
]);

echo "Created sample real result for Sarah J.\n";
