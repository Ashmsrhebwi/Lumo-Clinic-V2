<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Result;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResultController extends Controller
{
    public function index()
    {
        return $this->success(Result::with(['treatment', 'beforeMedia', 'afterMedia'])->get());
    }

    public function store(Request $request)
    {
        $fields = ['patient_name', 'story'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'patient_name' => 'required|array',
            'story' => 'nullable|array',
            'treatment_id' => 'required|exists:treatments,id',
            'before_media_id' => 'nullable|exists:media,id',
            'after_media_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $result = Result::create($data);
        return $this->success($result, 'Result created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $result = Result::findOrFail($id);
        $fields = ['patient_name', 'story'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'patient_name' => 'required|array',
            'story' => 'nullable|array',
            'treatment_id' => 'required|exists:treatments,id',
            'before_media_id' => 'nullable|exists:media,id',
            'after_media_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $result->update($data);
        return $this->success($result, 'Result updated successfully');
    }

    public function destroy($id)
    {
        Result::destroy($id);
        return $this->success(null, 'Result deleted successfully');
    }
}
