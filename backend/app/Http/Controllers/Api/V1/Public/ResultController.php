<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Result;

class ResultController extends Controller
{
    public function index()
    {
        return response()->json(
            Result::where('is_active', true)
                ->with(['treatment', 'beforeMedia', 'afterMedia'])
                ->get()
                ->map(fn($r) => [
                    'id' => $r->id,
                    'treatment_id' => $r->treatment_id,
                    'patient_name' => $r->patient_name,
                    'story' => $r->story,
                    'before_image_url' => $r->before_image_url,
                    'after_image_url' => $r->after_image_url,
                    'treatment' => $r->treatment ? [
                        'id' => $r->treatment->id,
                        'title' => $r->treatment->title,
                        'slug' => $r->treatment->slug,
                        'category' => $r->treatment->category,
                    ] : null,
                ])
        );
    }
}
