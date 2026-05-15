<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Stat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StatController extends Controller
{
    public function index()
    {
        return $this->success(Stat::all());
    }

    public function store(Request $request)
    {
        $fields = ['label'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'value' => 'required', // Relax numeric slightly to allow string representations, but still required
            'suffix' => 'nullable|string',
            'label' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        // Safe defaults to prevent 'cannot be null' DB errors
        $data['value'] = $data['value'] ?? 0;
        $data['suffix'] = $data['suffix'] ?? '';
        $data['label'] = $data['label'] ?? ['en' => ''];
        $data['is_active'] = $request->boolean('is_active', true);

        // Fillable only
        $fillable = ['label', 'value', 'suffix', 'is_active'];
        $data = array_intersect_key($data, array_flip($fillable));
        
        $stat = Stat::create($data);
        return $this->success($stat, 'Stat created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $stat = Stat::findOrFail($id);
        $fields = ['label'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'value' => 'required', 
            'suffix' => 'nullable|string',
            'label' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        // Fillable only
        $fillable = ['label', 'value', 'suffix', 'is_active'];
        $data = array_intersect_key($data, array_flip($fillable));

        // Sanitize to prevent null in non-nullable columns
        // Always provide a non-null fallback if explicitly null or missing from request but important for DB
        if (array_key_exists('suffix', $data) && is_null($data['suffix'])) {
            $data['suffix'] = '';
        }
        if (array_key_exists('value', $data) && is_null($data['value'])) {
            $data['value'] = 0;
        }

        // Add additional catch-all for missing fields if the user expects an update to be partially complete
        // but the DB won't allow nulls.

        $stat->update($data);
        return $this->success($stat, 'Stat updated successfully');
    }

    public function destroy($id)
    {
        Stat::findOrFail($id)->delete();
        return $this->success(null, 'Stat deleted successfully');
    }
}
