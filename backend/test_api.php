<?php

require __DIR__ . '/vendor/autoload.php';

use App\Http\Controllers\Api\V1\Public\InitController;

// Initialize Laravel application
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Testing API Response for Sections ===\n\n";

try {
    $controller = new InitController();
    
    // Call the initFull method
    $response = $controller->initFull();
    
    echo "API Response Status: " . $response->status() . "\n\n";
    
    $data = json_decode($response->content(), true);
    
    echo "=== Full API Response Structure ===\n";
    echo "Top-level keys: " . implode(', ', array_keys($data)) . "\n\n";
    
    if (isset($data['settings'])) {
        echo "Settings keys: " . implode(', ', array_keys($data['settings'])) . "\n\n";
        
        if (isset($data['settings']['sections'])) {
            echo "✅ Settings has 'sections' key\n";
            echo "Type: " . gettype($data['settings']['sections']) . "\n";
            
            if (is_string($data['settings']['sections'])) {
                echo "Value is a JSON string\n";
                $decoded = json_decode($data['settings']['sections'], true);
                if ($decoded) {
                    echo "✅ Successfully decoded JSON\n";
                    if (isset($decoded['sections'])) {
                        echo "✅ Decoded data has nested 'sections' key\n";
                        echo "Number of sections: " . count($decoded['sections']) . "\n";
                        echo "Section keys: " . implode(', ', array_keys($decoded['sections'])) . "\n";
                    } else {
                        echo "⚠️  Decoded data does not have nested 'sections' key\n";
                        echo "Number of sections: " . count($decoded) . "\n";
                        echo "Section keys: " . implode(', ', array_keys($decoded)) . "\n";
                    }
                } else {
                    echo "❌ Failed to decode JSON\n";
                }
            } else {
                echo "Value is an object/array\n";
                if (isset($data['settings']['sections']['sections'])) {
                    echo "✅ Data has nested 'sections' key\n";
                    echo "Number of sections: " . count($data['settings']['sections']['sections']) . "\n";
                    echo "Section keys: " . implode(', ', array_keys($data['settings']['sections']['sections'])) . "\n";
                } else {
                    echo "⚠️  Data does not have nested 'sections' key\n";
                    echo "Number of sections: " . count($data['settings']['sections']) . "\n";
                    echo "Section keys: " . implode(', ', array_keys($data['settings']['sections'])) . "\n";
                }
            }
        } else {
            echo "❌ Settings does NOT have 'sections' key\n";
        }
    } else {
        echo "❌ Response does NOT have 'settings' key\n";
    }
    
    echo "\n=== Sample Section Data ===\n";
    if (isset($data['settings']['sections'])) {
        $sections = $data['settings']['sections'];
        if (is_string($sections)) {
            $sections = json_decode($sections, true);
        }
        $actualSections = $sections['sections'] ?? $sections;
        $firstKey = array_key_first($actualSections);
        if ($firstKey) {
            echo json_encode([$firstKey => $actualSections[$firstKey]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
        }
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}
