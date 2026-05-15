<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Doctor;

class DoctorController extends Controller
{
    public function index()
    {
        return response()->json(
            Doctor::where('is_active', true)->get()
        );
    }
}
