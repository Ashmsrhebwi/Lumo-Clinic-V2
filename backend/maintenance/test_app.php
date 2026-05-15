<?php
require __DIR__.'/vendor/autoload.php';
try {
    echo "Class: " . Illuminate\Foundation\Application::class . "\n";
    echo "Method 'configure' exists: " . (method_exists(Illuminate\Foundation\Application::class, 'configure') ? 'YES' : 'NO') . "\n";
    
    // Attempt standard call
    $app = Illuminate\Foundation\Application::configure(basePath: __DIR__);
    echo "Instance: " . get_class($app) . "\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "TRACE: " . $e->getTraceAsString() . "\n";
}
