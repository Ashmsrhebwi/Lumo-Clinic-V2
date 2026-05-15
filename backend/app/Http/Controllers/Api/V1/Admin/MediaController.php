<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
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
        $filename = time() . '_' . $file->getClientOriginalName();
        
        $path = $file->storeAs('uploads', $filename, 'public');

        $media = Media::create([
            'filename' => $filename,
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
