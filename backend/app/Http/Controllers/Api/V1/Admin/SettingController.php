<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return $this->success($settings);
    }

    public function updateBatch(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        foreach ($request->settings as $item) {
            $key = $item['key'] ?? null;
            $value = $item['value'] ?? null;
            if ($key) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }

        return $this->success(null, 'Settings updated successfully');
    }
}
