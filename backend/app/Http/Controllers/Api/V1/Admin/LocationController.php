<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    public function index()
    {
        return $this->success(Location::all());
    }

    public function store(Request $request)
    {
        $fields = ['city', 'country', 'address', 'hours'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'city' => 'nullable|array',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        // Fillable only
        $fillable = ['city', 'country', 'address', 'hours', 'phone', 'email', 'is_active', 'map_url'];
        $data = array_intersect_key($data, array_flip($fillable));

        // Ensure non-null defaults for DB constraints
        foreach (['phone', 'email', 'map_url'] as $field) {
            if (!isset($data[$field]) || is_null($data[$field])) {
                $data[$field] = '';
            }
        }

        $location = Location::create($data);
        return $this->success($location, 'Location created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);
        $fields = ['city', 'country', 'address', 'hours'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'city' => 'nullable|array',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        // Fillable only
        $fillable = ['city', 'country', 'address', 'hours', 'phone', 'email', 'is_active', 'map_url'];
        $data = array_intersect_key($data, array_flip($fillable));

        // Ensure non-null defaults for DB constraints
        foreach (['phone', 'email', 'map_url'] as $field) {
            if (array_key_exists($field, $request->all()) && (is_null($request->$field) || $request->$field === '')) {
                $data[$field] = '';
            }
        }

        $location->update($data);
        return $this->success($location, 'Location updated successfully');
    }

    public function destroy($id)
    {
        Location::findOrFail($id)->delete();
        return $this->success(null, 'Location deleted successfully');
    }
}
