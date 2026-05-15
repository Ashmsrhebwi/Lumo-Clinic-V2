<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Location;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(
            Location::where('is_active', true)->get()
        );
    }
}
