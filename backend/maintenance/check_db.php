<?php

require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "Default Connection: " . DB::getDefaultConnection() . "\n";
$config = config('database.connections.' . DB::getDefaultConnection());
echo "Config: " . json_encode($config) . "\n";

try {
    DB::connection()->getPdo();
    echo "Connection Success!\n";
} catch (\Exception $e) {
    echo "Connection Failed: " . $e->getMessage() . "\n";
}
