<?php

require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Media;
use Illuminate\Support\Facades\Storage;

// Media Cleanup (Broken references)
$mediaItems = Media::all();
$brokenMediaCount = 0;
foreach ($mediaItems as $media) {
    if (!$media->file_path || !Storage::disk('public')->exists($media->file_path)) {
        $brokenMediaCount++;
        $media->delete();
    }
}

echo json_encode(['broken_media' => $brokenMediaCount]);
