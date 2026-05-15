<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(
            Testimonial::where('is_active', true)
                ->with('treatment')
                ->get()
                ->map(fn($t) => [
                    'id' => $t->id,
                    'treatment_id' => $t->treatment_id,
                    'patient_name' => $t->patient_name,
                    'feedback' => $t->feedback,
                    'rating' => $t->rating,
                    'treatment' => $t->treatment ? [
                        'id' => $t->treatment->id,
                        'title' => $t->treatment->title,
                        'slug' => $t->treatment->slug,
                        'category' => $t->treatment->category,
                    ] : null,
                    'text' => $t->feedback, // for compatibility
                    'name' => $t->patient_name // for compatibility
                ])
        );
    }
}
