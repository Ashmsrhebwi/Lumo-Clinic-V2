<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Treatment;

$t = Treatment::where('slug', 'new-treatment')->first();
if ($t) {
    $t->delete();
    echo "Deleted dummy treatment: new-treatment\n";
} else {
    echo "Dummy treatment not found\n";
}
