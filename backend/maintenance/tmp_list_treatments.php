<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$treatments = DB::table('treatments')->get();
foreach ($treatments as $t) {
    $title = json_decode($t->title, true);
    $title_en = $title['en'] ?? 'No Title';
    echo "ID: {$t->id} | Slug: {$t->slug} | Title (EN): {$title_en}\n";
}
