<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use Illuminate\Http\Request;

class TreatmentController extends Controller
{
    public function index()
    {
        $treatments = Treatment::where('is_active', true)->get();
        
        return response()->json($treatments->map(function ($t) {
            return [
                'id' => $t->id,
                'slug' => $t->slug,
                'category' => $t->category,
                'title' => $t->title,
                'image' => $t->image,
                'media_url' => $t->image,
                'beforeAfter' => $t->beforeAfter,
                'description' => $t->description,
                'features' => $t->features,
                'successRate' => $t->success_rate,
                'duration' => $t->duration,
                'template_type' => $t->template_type,
            ];
        }));
    }

    public function show($slug)
    {
        $treatment = Treatment::where('slug', $slug)
                              ->where('is_active', true)
                              ->with(['results', 'testimonials'])
                              ->firstOrFail();

        return response()->json([
            'id' => $treatment->id,
            'slug' => $treatment->slug,
            'category' => $treatment->category,
            'title' => $treatment->title,
            'image' => $treatment->image,
            'media_url' => $treatment->image,
            'beforeAfter' => $treatment->beforeAfter,
            'description' => $treatment->description,
            'features' => $treatment->features,
            'content_sections' => $treatment->content_sections,
            'successRate' => $treatment->success_rate,
            'duration' => $treatment->duration,
            'template_type' => $treatment->template_type,
            'results' => $treatment->results->filter(fn($r) => $r->is_active)->map(fn($r) => [
                'id' => $r->id,
                'before_image_url' => $r->before_image_url,
                'after_image_url' => $r->after_image_url,
                'patient_name' => $r->patient_name,
                'story' => $r->story,
            ]),
            'testimonials' => $treatment->testimonials->filter(fn($t) => $t->is_active)->map(fn($t) => [
                'id' => $t->id,
                'patient_name' => $t->patient_name,
                'feedback' => $t->feedback,
                'rating' => $t->rating,
            ]),
        ]);
    }
}
