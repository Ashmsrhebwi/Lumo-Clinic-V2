<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;

class ProcessStepController extends Controller
{
    public function index()
    {
        return response()->json(
            ProcessStep::where('is_active', true)->orderBy('order')->get()
        );
    }
}
