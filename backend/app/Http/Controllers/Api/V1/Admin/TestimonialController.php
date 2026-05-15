<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    public function index()
    {
        return $this->success(Testimonial::with('treatment')->get());
    }

    public function store(Request $request)
    {
        $fields = ['patient_name', 'feedback'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'treatment_id' => 'nullable|exists:treatments,id',
            'patient_name' => 'required|array',
            'feedback' => 'required|array',
            'rating' => 'nullable|integer|min:1|max:5',
            'image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $testimonial = Testimonial::create($data);
        return $this->success($testimonial, 'Testimonial created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $fields = ['patient_name', 'feedback'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'treatment_id' => 'nullable|exists:treatments,id',
            'patient_name' => 'required|array',
            'feedback' => 'required|array',
            'rating' => 'nullable|integer|min:1|max:5',
            'image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $testimonial->update($data);
        return $this->success($testimonial, 'Testimonial updated successfully');
    }

    public function destroy($id)
    {
        Testimonial::destroy($id);
        return $this->success(null, 'Testimonial deleted successfully');
    }
}
