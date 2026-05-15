<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;

class SocialLinkController extends Controller
{
    public function index()
    {
        return response()->json(
            SocialLink::where('is_active', true)->get()
        );
    }
}
