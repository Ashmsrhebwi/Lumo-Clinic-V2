<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use App\Models\Setting;

// Initialize Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Checking Sections Data in Settings Table ===\n\n";

try {
    // Check if sections key exists in settings table
    $sectionsSetting = Setting::where('key', 'sections')->first();
    
    if (!$sectionsSetting) {
        echo "❌ No sections key found in settings table.\n";
        exit(1);
    }
    
    echo "✅ Sections key found in settings table.\n\n";
    
    // Get the value
    $value = $sectionsSetting->value;
    echo "Value type: " . gettype($value) . "\n";
    
    // If it's a string, decode it
    if (is_string($value)) {
        echo "Value is a JSON string. Decoding...\n";
        $decoded = json_decode($value, true);
        if ($decoded === null) {
            echo "❌ Failed to decode JSON.\n";
            echo "Raw value: " . substr($value, 0, 200) . "...\n";
            exit(1);
        }
        $value = $decoded;
    }
    
    echo "Decoded value structure:\n";
    echo json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n\n";
    
    // Check if it has the nested structure
    if (isset($value['sections'])) {
        echo "✅ Data has nested 'sections' key.\n";
        echo "Number of sections: " . count($value['sections']) . "\n";
        echo "Section keys: " . implode(', ', array_keys($value['sections'])) . "\n";
    } else {
        echo "⚠️  Data does not have nested 'sections' key.\n";
        echo "Assuming it's already a flat object.\n";
        echo "Number of sections: " . count($value) . "\n";
        echo "Section keys: " . implode(', ', array_keys($value)) . "\n";
    }
    
    // Check section_titles table
    echo "\n=== Checking section_titles Table ===\n\n";
    $sectionTitlesCount = DB::table('section_titles')->count();
    echo "Number of rows in section_titles table: $sectionTitlesCount\n";
    
    if ($sectionTitlesCount > 0) {
        echo "\nSample data from section_titles:\n";
        $sample = DB::table('section_titles')->first();
        echo json_encode($sample, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
