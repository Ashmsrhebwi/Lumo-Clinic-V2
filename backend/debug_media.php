<?php
/**
 * Debug script: Run with `php debug_media.php` from the backend directory.
 * Logs all SQL queries executed by the treatment media eager load.
 */
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Http\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

$queries = [];
DB::listen(function ($query) use (&$queries) {
    $queries[] = $query->sql;
});

echo "=== Testing Treatment with('media:id,path') ===\n";
try {
    $results = \App\Models\Treatment::where('is_active', true)
        ->select('id', 'slug', 'category', 'title', 'media_id', 'description', 'features', 'success_rate', 'duration', 'template_type', 'order')
        ->with('media:id,path')
        ->orderBy('order')
        ->limit(12)
        ->get();
    echo "Success. Rows: " . count($results) . "\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}

echo "\n=== SQL Queries Executed ===\n";
foreach ($queries as $i => $sql) {
    echo ($i+1) . ". $sql\n";
}
