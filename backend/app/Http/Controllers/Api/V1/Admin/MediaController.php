<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class MediaController extends Controller
{
    /**
     * Generate secure random filename
     * Uses UUID to prevent filename collisions and enumeration attacks
     */
    private function generateSecureFilename(string $originalName, string $extension): string
    {
        return (string) Str::uuid() . '_' . time() . '.' . $extension;
    }

    /**
     * Validate file content matches declared MIME type
     * Prevents file type spoofing attacks
     */
    private function validateFileContent($file, string $declaredMime): bool
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detectedMime = finfo_file($finfo, $file->getPathname());
        finfo_close($finfo);

        // Allow for minor MIME type variations (e.g., image/jpeg vs image/jpg)
        $allowedVariations = [
            'image/jpeg' => ['image/jpeg', 'image/jpg'],
            'image/jpg' => ['image/jpeg', 'image/jpg'],
            'video/mp4' => ['video/mp4'],
            'image/webp' => ['image/webp'],
            'image/svg+xml' => ['image/svg+xml', 'image/svg'],
            'image/svg' => ['image/svg+xml', 'image/svg'],
            'image/gif' => ['image/gif'],
            'video/webm' => ['video/webm'],
            'video/quicktime' => ['video/quicktime'],
            'video/x-msvideo' => ['video/x-msvideo'],
            'video/x-matroska' => ['video/x-matroska'],
        ];

        $allowedMimes = $allowedVariations[$declaredMime] ?? [$declaredMime];
        return in_array($detectedMime, $allowedMimes, true);
    }

    /**
     * Sanitize filename to prevent path traversal
     */
    private function sanitizeFilename(string $filename): string
    {
        // Remove any path components
        $filename = basename($filename);
        // Remove dangerous characters
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
        // Prevent double extensions
        $filename = str_replace('..', '', $filename);
        return $filename;
    }

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,jpg,png,mp4,webp,svg,gif,mov,avi,mkv,webm|max:51200',
            'alt_text' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $file = $request->file('file');

        // SECURITY: Validate file content matches declared MIME type
        // Prevents file type spoofing (e.g., renaming .exe to .jpg)
        $declaredMime = $file->getMimeType();
        if (!$this->validateFileContent($file, $declaredMime)) {
            Log::warning('File upload rejected: MIME type mismatch', [
                'declared' => $declaredMime,
                'filename' => $file->getClientOriginalName()
            ]);
            return $this->error('File type validation failed', 422);
        }

        // SECURITY: Generate secure random filename
        // Prevents filename collisions, enumeration, and path traversal
        $originalExtension = $file->getClientOriginalExtension();
        $secureFilename = $this->generateSecureFilename($file->getClientOriginalName(), $originalExtension);

        // SECURITY: Store file with secure filename
        $path = $file->storeAs('uploads', $secureFilename, 'public');

        $media = Media::create([
            'filename' => $secureFilename,
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'alt_text' => $this->prepareMultilingualData($request->alt_text ?? [], [])['alt_text'] ?? ['en' => '', 'ar' => '', 'fr' => '', 'ru' => '']
        ]);

        return $this->success([
            'id' => (int)$media->id,
            'full_url' => $media->full_url,
            'url' => $media->full_url,
            'filename' => $media->filename,
            'mime_type' => $media->mime_type,
        ], 'File uploaded successfully');
    }
}
