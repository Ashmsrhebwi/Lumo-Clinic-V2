<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$dbName = config('database.connections.mysql.database');
$keyName = "Tables_in_" . $dbName;

try {
    $tables = DB::select('SHOW TABLES');
} catch (\Exception $e) {
    echo "CRITICAL_ERROR: Could not fetch tables. " . $e->getMessage() . "\n";
    exit(1);
}

$healthy = [];
$broken = [];

foreach ($tables as $table) {
    // Laravel 11/12+ SHOW TABLES returns objects where the key is Tables_in_dbname
    $tableName = array_values((array)$table)[0];
    
    try {
        DB::statement("SELECT 1 FROM `{$tableName}` LIMIT 1");
        $healthy[] = $tableName;
    } catch (\Exception $e) {
        $broken[] = [
            'name' => $tableName,
            'error' => $e->getMessage()
        ];
    }
}

$results = [
    'healthy' => $healthy,
    'broken' => $broken
];

$json = json_encode($results, JSON_PRETTY_PRINT);
file_put_contents('audit_results.json', $json);
echo $json . "\n";
