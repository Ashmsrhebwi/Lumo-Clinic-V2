<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FaqController extends Controller
{
    public function index()
    {
        return $this->success(Faq::all());
    }

    public function store(Request $request)
    {
        $fields = ['question', 'answer'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'question' => 'required|array',
            'answer' => 'required|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $faq = Faq::create($data);
        return $this->success($faq, 'FAQ created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);
        $fields = ['question', 'answer'];
        $data = $this->prepareMultilingualData($request->all(), $fields);
        
        $validator = Validator::make($data, [
            'question' => 'nullable|array',
            'answer' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $faq->update($data);
        return $this->success($faq, 'FAQ updated successfully');
    }

    public function destroy($id)
    {
        Faq::findOrFail($id)->delete();
        return $this->success(null, 'FAQ deleted successfully');
    }
}
