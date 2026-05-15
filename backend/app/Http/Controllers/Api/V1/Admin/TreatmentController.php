<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TreatmentController extends Controller
{
    private const CANONICAL_MAPPING = [
        'Dental Implant' => 'dental-implant',
        'Hollywood Smile' => 'hollywood-smile',
        'Male Hair Transplant' => 'male-hair-transplant',
        'Female Hair Transplant' => 'female-hair-transplant',
        'Beard & Moustache Transplant' => 'beard-moustache-transplant',
        'Eyebrow Transplant' => 'eyebrow-transplant',
    ];

    public function index()
    {
        return $this->success(Treatment::with('media', 'after_media', 'content_media')->get());
    }

    public function show($id)
    {
        $treatment = Treatment::with(['media', 'after_media', 'content_media'])->findOrFail($id);
        return $this->success($treatment);
    }

    public function store(Request $request)
    {
        $fields = ['title', 'description', 'duration', 'category', 'features', 'content_sections'];
        $data = $this->prepareMultilingualData($request->all(), $fields);

        if (isset($data['successRate']) && !isset($data['success_rate'])) {
            $data['success_rate'] = $data['successRate'];
            unset($data['successRate']);
        }

        $categoryEn = $data['category']['en'] ?? null;
        if ($categoryEn && isset(self::CANONICAL_MAPPING[$categoryEn])) {
            $exists = Treatment::where('category->en', $categoryEn)->exists();
            if ($exists) {
                return $this->error("A treatment record for '{$categoryEn}' already exists. Multiple records per canonical treatment are not allowed.", 422);
            }
            $data['slug'] = self::CANONICAL_MAPPING[$categoryEn];
        }

        $validator = Validator::make($data, [
            'slug' => 'nullable|string|unique:treatments,slug',
            'category' => 'nullable|array',
            'title' => 'nullable|array',
            'media_id' => 'nullable|exists:media,id',
            'content_media_id' => 'nullable|exists:media,id',
            'after_media_id' => 'nullable|exists:media,id',
            'description' => 'nullable|array',
            'success_rate' => 'nullable|numeric|min:0|max:100',
            'duration' => 'nullable|array',
            'features' => 'nullable|array',
            'content_sections' => 'nullable|array',
            'template_type' => 'nullable|in:standard,dental,hair',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        if (!isset($data['slug']) || is_null($data['slug'])) {
            $data['slug'] = '';
        }

        $treatment = Treatment::create($data);
        return $this->success($treatment, 'Treatment created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $treatment = Treatment::findOrFail($id);
        $fields = ['title', 'description', 'duration', 'category', 'features', 'content_sections'];
        $data = $this->prepareMultilingualData($request->all(), $fields);

        if (isset($data['successRate']) && !isset($data['success_rate'])) {
            $data['success_rate'] = $data['successRate'];
            unset($data['successRate']);
        }

        $categoryEn = $data['category']['en'] ?? ($treatment->category['en'] ?? null);
        if ($categoryEn && isset(self::CANONICAL_MAPPING[$categoryEn])) {
            $data['slug'] = self::CANONICAL_MAPPING[$categoryEn];
        }

        unset(
            $data['image'],
            $data['beforeAfter'],
            $data['media_url'],
            $data['id'],
            $data['created_at'],
            $data['updated_at']
        );

        $validator = Validator::make($data, [
            'slug' => 'nullable|string|unique:treatments,slug,' . $id,
            'category' => 'nullable|array',
            'title' => 'nullable|array',
            'media_id' => 'nullable|exists:media,id',
            'content_media_id' => 'nullable|exists:media,id',
            'after_media_id' => 'nullable|exists:media,id',
            'description' => 'nullable|array',
            'success_rate' => 'nullable|numeric|min:0|max:100',
            'duration' => 'nullable|array',
            'features' => 'nullable|array',
            'content_sections' => 'nullable|array',
            'template_type' => 'nullable|in:standard,dental,hair',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        if (array_key_exists('slug', $request->all()) && (is_null($request->slug) || $request->slug === '')) {
            $data['slug'] = '';
        }

        $treatment->update($data);
        return $this->success($treatment, 'Treatment updated successfully');
    }

    public function destroy($id)
    {
        Treatment::destroy($id);
        return $this->success(null, 'Treatment deleted successfully');
    }
}