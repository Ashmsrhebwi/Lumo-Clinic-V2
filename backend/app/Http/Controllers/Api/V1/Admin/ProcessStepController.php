<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcessStep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProcessStepController extends Controller
{
    public function index()
    {
        return $this->success(ProcessStep::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $fields = ['title', 'description'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'title' => 'required|array',
            'icon_name' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        if (!isset($data['icon_name']) || is_null($data['icon_name'])) {
            $data['icon_name'] = '';
        }

        $processStep = ProcessStep::create($data);
        return $this->success($processStep, 'Step created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $processStep = ProcessStep::findOrFail($id);
        $fields = ['title', 'description'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'title' => 'nullable|array',
            'icon_name' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'nullable|integer'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        if (array_key_exists('icon_name', $request->all()) && (is_null($request->icon_name) || $request->icon_name === '')) {
            $data['icon_name'] = '';
        }

        $processStep->update($data);
        return $this->success($processStep, 'Step updated successfully');
    }

    public function destroy($id)
    {
        ProcessStep::findOrFail($id)->delete();
        return $this->success(null, 'Step deleted successfully');
    }
}
