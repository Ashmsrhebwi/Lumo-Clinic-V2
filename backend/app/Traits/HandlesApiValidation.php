<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait HandlesApiValidation
{
    /**
     * Standardized success response.
     */
    protected function success($data, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Standardized error response.
     */
    protected function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Ensure all multilingual fields are initialized with a standard JSON structure.
     */
    protected function prepareMultilingualData(array $data, array $fields): array
    {
        $default = ['en' => '', 'ar' => '', 'fr' => '', 'ru' => ''];

        foreach ($fields as $field) {
            // Skip processing for fields that are known to be arrays of objects (like content_sections)
            if ($field === 'content_sections') continue;

            if (isset($data[$field]) && is_string($data[$field])) {
                // If it's a string, move it to EN and fill others with defaults
                $data[$field] = array_merge($default, ['en' => $data[$field]]);
            } elseif (!isset($data[$field]) || $data[$field] === null || $data[$field] === '') {
                // If missing or null, set to full default structure
                $data[$field] = $default;
            } elseif (is_array($data[$field])) {
                // If it's an associative array (multilingual object), merge with defaults
                // We check if it's NOT a sequential array to avoid corrupting content_sections
                $keys = array_keys($data[$field]);
                $isSequential = $keys === range(0, count($data[$field]) - 1);
                if (!$isSequential) {
                    $data[$field] = array_merge($default, $data[$field]);
                }
            }
        }

        return $data;
    }
}
