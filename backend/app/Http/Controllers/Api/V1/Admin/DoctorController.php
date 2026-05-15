<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DoctorController extends Controller
{
    public function index()
    {
        return $this->success(Doctor::all());
    }

    public function store(Request $request)
    {
        $fields = ['specialty', 'bio', 'specialties', 'languages'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'name' => 'required|string',
            'specialty' => 'nullable',
            'rating' => 'nullable|numeric|min:0|max:5',
            'experience' => 'nullable|string',
            'patients' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
            'bio' => 'nullable',
            'specialties' => 'nullable',
            'languages' => 'nullable'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $doctor = Doctor::create($data);
        return $this->success($doctor, 'Doctor created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);
        $fields = ['specialty', 'bio', 'specialties', 'languages'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'name' => 'required|string',
            'specialty' => 'nullable',
            'rating' => 'nullable|numeric|min:0|max:5',
            'experience' => 'nullable|string',
            'patients' => 'nullable|string',
            'image_id' => 'nullable|exists:media,id',
            'is_active' => 'boolean',
            'bio' => 'nullable',
            'specialties' => 'nullable',
            'languages' => 'nullable'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $doctor->update($data);
        return $this->success($doctor, 'Doctor updated successfully');
    }

    public function destroy($id)
    {
        Doctor::findOrFail($id)->delete();
        return $this->success(null, 'Doctor deleted successfully');
    }
}
