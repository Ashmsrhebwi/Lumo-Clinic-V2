<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Services\Bitrix24Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LeadController extends Controller
{
    public function store(Request $request, Bitrix24Service $bitrix24Service)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:booking,contact,newsletter',
            'name' => 'required_unless:type,newsletter|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => ['required_unless:type,newsletter', 'string', 'regex:/^\+[1-9]\d{7,19}$/'],
            'treatment' => 'string|max:255|nullable',
            'subject' => 'string|max:255|nullable',
            'message' => 'string|max:5000|nullable',
            'date' => 'date_format:Y-m-d|nullable',
            'language' => 'nullable|string|in:ar,en,fr,ru,Arabic,English,French,Russian',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Get only validated data to prevent unexpected field injection
        $validated = $validator->validated();
        
        // Normalize phone number (E.164-ish)
        if (isset($validated['phone']) && is_string($validated['phone'])) {
            $validated['phone'] = preg_replace('/[^\d+]/', '', $validated['phone']);
        }
        
        // Sanitize all string inputs to prevent XSS
        foreach ($validated as $key => $value) {
            if (is_string($value)) {
                $validated[$key] = strip_tags($value);
            }
        }

        // Handle database constraints for newsletter leads
        if (($validated['type'] ?? '') === 'newsletter') {
            $validated['name'] = $validated['name'] ?? 'Website Subscriber';
            $validated['phone'] = $validated['phone'] ?? 'N/A';
        }
        
        $dbData = $validated;
        unset($dbData['language']);
        
        $lead = Lead::create($dbData);
        
        // Send to Bitrix24
        $bitrix24Service->createLead($validated);


        return response()->json(['message' => 'Lead submitted successfully', 'lead' => $lead]);
    }
}
