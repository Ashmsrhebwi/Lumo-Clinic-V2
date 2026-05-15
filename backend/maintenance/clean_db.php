<?php

require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Result;
use App\Models\Testimonial;
use App\Models\Doctor;
use App\Models\Faq;
use App\Models\Stat;
use App\Models\ProcessStep;
use App\Models\Media;
use Illuminate\Support\Facades\Storage;

$cleaned = [];
$kept = [];

// Results to delete (Empty/New Result)
$resIds = [1, 4, 5];
$cleaned['results'] = Result::whereIn('id', $resIds)->get()->toArray();
Result::whereIn('id', $resIds)->delete();

// Testimonials to delete (Empty/New Patient)
$testIds = [12, 14];
$cleaned['testimonials'] = Testimonial::whereIn('id', $testIds)->get()->toArray();
Testimonial::whereIn('id', $testIds)->delete();

// Doctors to delete (Test/New Doctor)
$docIds = [1, 3, 5, 6, 7, 8, 9];
$cleaned['doctors'] = Doctor::whereIn('id', $docIds)->get()->toArray();
Doctor::whereIn('id', $docIds)->delete();

// FAQs to delete (Empty/Test)
$faqIds = [7, 8, 10];
$cleaned['faqs'] = Faq::whereIn('id', $faqIds)->get()->toArray();
Faq::whereIn('id', $faqIds)->delete();

// Stats to delete (Empty label)
$statIds = [5, 10, 11, 12, 13, 14];
$cleaned['stats'] = Stat::whereIn('id', $statIds)->get()->toArray();
Stat::whereIn('id', $statIds)->delete();

// Process Steps to delete (Empty)
$psIds = [5, 7, 8, 9, 11];
$cleaned['process_steps'] = ProcessStep::whereIn('id', $psIds)->get()->toArray();
ProcessStep::whereIn('id', $psIds)->delete();

// Media Cleanup (Broken references)
$mediaItems = Media::all();
$brokenMediaCount = 0;
foreach ($mediaItems as $media) {
    if (!Storage::disk('public')->exists($media->file_path)) {
        $brokenMediaCount++;
        $media->delete();
    }
}
$cleaned['broken_media_count'] = $brokenMediaCount;

echo json_encode(['cleaned' => count($resIds) + count($testIds) + count($docIds) + count($faqIds) + count($statIds) + count($psIds), 'broken_media' => $brokenMediaCount]);
