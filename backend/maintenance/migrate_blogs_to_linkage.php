<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Article;
use App\Models\Treatment;

echo "--- BLOG RELATION NORMALIZATION START ---\n\n";

$articles = Article::all();
$treatments = Treatment::all();

foreach ($articles as $article) {
    $category = (array)$article->category;
    if (!$category || !isset($category['en'])) {
        echo "Article ID {$article->id}: Missing English category title. Skipping.\n";
        continue;
    }

    $catEn = $category['en'];
    $match = $treatments->first(function ($t) use ($catEn) {
        return $t->title['en'] === $catEn;
    });

    if ($match) {
        $article->treatment_id = $match->id;
        $article->save();
        echo "Article ID {$article->id}: Matched '{$catEn}' to Treatment ID {$match->id} ✅\n";
    } else {
        echo "Article ID {$article->id}: No match found for '{$catEn}' ❌\n";
    }
}

echo "\n--- NORMALIZATION COMPLETE ---";
