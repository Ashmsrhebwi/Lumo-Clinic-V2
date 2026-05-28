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
        // SECURITY: Enhanced validation to prevent injection attacks
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:booking,contact,newsletter',
            'name' => 'required_unless:type,newsletter|string|max:255|regex:/^[\p{L}\s\-\.\']+$/u',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => ['required_unless:type,newsletter', 'string', 'regex:/^\+[1-9]\d{7,19}$/'],
            'treatment' => 'nullable|string|max:255|regex:/^[a-zA-Z0-9\s\-]+$/',
            'subject' => 'nullable|string|max:255|regex:/^[a-zA-Z0-9\s\-\.\,\?!]+$/',
            'message' => 'nullable|string|max:5000',
            'date' => 'nullable|date_format:Y-m-d|after:today',
            'language' => 'nullable|string|in:ar,en,fr,ru',
        ], [
            'name.regex' => 'Name contains invalid characters',
            'phone.regex' => 'Phone number must be in international format (e.g., +1234567890)',
            'treatment.regex' => 'Treatment name contains invalid characters',
            'subject.regex' => 'Subject contains invalid characters',
            'date.after' => 'Date must be in the future',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // SECURITY: Get only validated data to prevent unexpected field injection
        $validated = $validator->validated();
        
        // SECURITY: Normalize phone number (E.164 format)
        if (isset($validated['phone']) && is_string($validated['phone'])) {
            $validated['phone'] = preg_replace('/[^\d+]/', '', $validated['phone']);
        }
        
        // SECURITY: Sanitize all string inputs to prevent XSS and injection attacks
        foreach ($validated as $key => $value) {
            if (is_string($value)) {
                // Remove potentially dangerous characters
                $validated[$key] = strip_tags($value);
                // Remove null bytes
                $validated[$key] = str_replace("\0", '', $validated[$key]);
                // Trim whitespace
                $validated[$key] = trim($validated[$key]);
            }
        }

        // Handle database constraints for newsletter leads
        if (($validated['type'] ?? '') === 'newsletter') {
            $validated['name'] = $validated['name'] ?? 'Website Subscriber';
            $validated['phone'] = $validated['phone'] ?? 'N/A';
        }
        
        $dbData = $validated;
        unset($dbData['language']);
        
        // SECURITY: Use fillable model to prevent mass assignment
        $lead = Lead::create($dbData);
        
        // Send to Bitrix24 (non-blocking)
        try {
            $bitrix24Service->createLead($validated);
        } catch (\Exception $e) {
            // Log error but don't fail the request
            \Log::warning('Bitrix24 lead creation failed', ['error' => $e->getMessage()]);
        }

        return response()->json(['message' => 'Lead submitted successfully', 'lead' => $lead]);
    }
}
