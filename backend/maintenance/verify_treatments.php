<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;

$treatments = Treatment::all();
echo "Total Treatments: " . $treatments->count() . "\n\n";

foreach ($treatments as $t) {
    echo "ID: " . $t->id . "\n";
    echo "Title: " . ($t->title['en'] ?? 'N/A') . "\n";
    echo "Slug: " . $t->slug . "\n";
    echo "Features Count: " . (is_array($t->features) ? count($t->features) : 0) . "\n";
    echo "Sections Count: " . (is_array($t->content_sections) ? count($t->content_sections) : 0) . "\n";
    echo "Success Rate: " . ($t->success_rate ?? 'N/A') . "%\n";
    echo "Duration: " . ($t->duration['en'] ?? 'N/A') . "\n";
    echo "---------------------------\n";
}
