<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$slugs = \App\Models\Treatment::pluck('slug')->toArray();
echo implode(',', $slugs) . "\n";
