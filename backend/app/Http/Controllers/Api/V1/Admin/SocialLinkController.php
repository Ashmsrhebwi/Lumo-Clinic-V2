<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SocialLinkController extends Controller
{
    public function index()
    {
        return $this->success(SocialLink::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'platform' => 'required|string',
            'url' => 'required|url',
            'icon_name' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $link = SocialLink::create($request->all());
        return $this->success($link, 'Link created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $link = SocialLink::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'platform' => 'nullable|string',
            'url' => 'nullable|url',
            'icon_name' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $link->update($request->all());
        return $this->success($link, 'Link updated successfully');
    }

    public function destroy($id)
    {
        SocialLink::findOrFail($id)->delete();
        return $this->success(null, 'Link deleted successfully');
    }
}
