<?php

require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$models = [
    'App\Models\Treatment' => ['title', 'description', 'content_sections'],
    'App\Models\Result' => ['patient_name', 'story'],
    'App\Models\Testimonial' => ['patient_name', 'feedback'],
    'App\Models\Article' => ['title', 'content', 'excerpt'],
    'App\Models\Doctor' => ['name', 'bio', 'specialty', 'specialties', 'languages'],
    'App\Models\Location' => ['city', 'address', 'country', 'hours'],
    'App\Models\Faq' => ['question', 'answer'],
    'App\Models\Stat' => ['label', 'value'],
    'App\Models\ProcessStep' => ['title', 'description'],
    'App\Models\Setting' => ['value'],
];

$forbidden = [
    'Fucking' => 'Exceptional',
    'TEST' => 'Official Content',
    'asd' => '',
    'qwe' => '',
    'dummy' => 'Professional',
    'Lorem Ipsum' => 'Quality medical care for international patients.',
];

function cleanValue($value, $forbidden) {
    if (is_null($value)) return null;
    
    if (is_array($value)) {
        foreach ($value as $k => $v) {
            $value[$k] = cleanValue($v, $forbidden);
        }
        return $value;
    }
    
    if (is_string($value)) {
        foreach ($forbidden as $search => $replace) {
            // Case-insensitive replacement for specific words
            if ($search === 'asd' || $search === 'qwe') {
                // For 'asd'/'qwe', replace only if it's the full word or at least looks like trash
                if (strtolower(trim($value)) === $search) {
                    return $replace;
                }
                // Also handle common trash patterns
                $value = preg_replace('/\b' . preg_quote($search, '/') . '\b/i', $replace, $value);
            } else {
                $value = str_ireplace($search, $replace, $value);
            }
        }
        return trim($value);
    }
    
    return $value;
}

echo "Starting Safe Cleanup...\n";

$cleanedCount = 0;

foreach ($models as $class => $fields) {
    if (!class_exists($class)) {
        echo "Skipping $class (not found)\n";
        continue;
    }
    
    $records = $class::all();
    foreach ($records as $record) {
        $updated = false;
        foreach ($fields as $field) {
            $original = $record->$field;
            $cleaned = cleanValue($original, $forbidden);
            
            if ($original !== $cleaned) {
                // If the cleaned value is empty but it's a critical field, use a better placeholder
                if (empty($cleaned) && in_array($field, ['title', 'name', 'patient_name', 'label'])) {
                    $cleaned = "Official " . ucfirst($field);
                }
                
                $record->$field = $cleaned;
                $updated = true;
            }
        }
        
        if ($updated) {
            $record->save();
            $cleanedCount++;
            echo "Cleaned ID {$record->id} in " . (new ReflectionClass($class))->getShortName() . "\n";
        }
    }
}

echo "Done! Cleaned $cleanedCount records.\n";
