<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Setting;

// Initialize Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Checking Plastic Section Keys ===\n\n";

try {
    // Get sections from settings
    $sectionsSetting = Setting::where('key', 'sections')->first();
    
    if (!$sectionsSetting) {
        echo "❌ No sections key found.\n";
        exit(1);
    }
    
    $value = $sectionsSetting->value;
    if (is_string($value)) {
        $value = json_decode($value, true);
    }
    
    $sections = $value['sections'] ?? $value;
    
    echo "=== All Plastic-Related Keys in Database ===\n";
    $plasticKeys = array_filter(array_keys($sections), function($key) {
        return strpos($key, 'plastic') === 0;
    });
    
    sort($plasticKeys);
    
    foreach ($plasticKeys as $key) {
        echo "- $key\n";
    }
    
    echo "\n=== Frontend Expected Keys ===\n";
    echo "- plastic.hero\n";
    echo "- plastic.journey\n";
    echo "- plastic.procedures (commented)\n";
    echo "- plastic.treatments (commented)\n";
    echo "- plastic.cta (commented)\n";
    
    echo "\n=== Key Mapping Analysis ===\n";
    $expectedKeys = ['plastic.hero', 'plastic.journey'];
    
    foreach ($expectedKeys as $expected) {
        $dbKey = str_replace('.', '_', $expected);
        if (isset($sections[$dbKey])) {
            echo "✅ $expected -> $dbKey (found)\n";
        } else {
            echo "❌ $expected -> $dbKey (NOT found)\n";
            // Try plastic_surgery_ prefix
            $surgeryKey = 'plastic_surgery_' . str_replace('plastic.', '', $expected);
            if (isset($sections[$surgeryKey])) {
                echo "   ⚠️  Alternative found: $surgeryKey\n";
            }
        }
    }
    
    echo "\n=== Sample Data ===\n";
    foreach ($plasticKeys as $key) {
        if (isset($sections[$key])) {
            echo "\n--- $key ---\n";
            echo json_encode($sections[$key], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
        }
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
