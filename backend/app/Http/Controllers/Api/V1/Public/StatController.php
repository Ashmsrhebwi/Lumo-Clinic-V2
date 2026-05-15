<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Stat;

class StatController extends Controller
{
    public function index()
    {
        return response()->json(
            Stat::where('is_active', true)->get()
        );
    }
}
