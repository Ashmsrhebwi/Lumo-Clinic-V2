<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Article;

echo "--- BLOG DATA VERIFICATION ---\n\n";

$blogs = Article::with('treatment')->latest()->get();

foreach ($blogs as $blog) {
    echo "Blog ID: {$blog->id}\n";
    echo "Title: " . $blog->title['en'] . "\n";
    echo "Treatment ID: " . ($blog->treatment_id ?? 'NULL') . "\n";
    echo "Treatment Title: " . ($blog->treatment ? $blog->treatment->title['en'] : 'NONE') . "\n";
    echo "Treatment Slug: " . ($blog->treatment ? $blog->treatment->slug : 'NONE') . "\n";
    echo "---------------------------\n";
}
