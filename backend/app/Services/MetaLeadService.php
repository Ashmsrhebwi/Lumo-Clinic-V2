<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaLeadService
{
    protected $accessToken;
    protected $graphVersion;

    public function __construct()
    {
        $this->accessToken = config('services.meta.page_access_token');
        $this->graphVersion = config('services.meta.graph_version', 'v20.0');
    }

    /**
     * Fetch lead details from Meta Graph API.
     *
     * @param string $leadgenId
     * @return array|null
     */
    public function getLeadDetails(string $leadgenId)
    {
        if (!$this->accessToken) {
            Log::error('Meta: Page Access Token not configured.');
            return null;
        }

        $url = "https://graph.facebook.com/{$this->graphVersion}/{$leadgenId}";

        try {
            $response = Http::get($url, [
                'access_token' => $this->accessToken
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Meta: Failed to fetch lead details.', [
                'status' => $response->status(),
                'body' => $response->json(),
                'leadgen_id' => $leadgenId
            ]);
        } catch (\Exception $e) {
            Log::error('Meta: Exception while fetching lead details.', [
                'error' => $e->getMessage(),
                'leadgen_id' => $leadgenId
            ]);
        }

        return null;
    }

    /**
     * Parse Meta field_data into a normalized array.
     *
     * @param array $leadData
     * @return array
     */
    public function normalizeLeadData(array $leadData)
    {
        $normalized = [
            'full_name' => '',
            'email' => '',
            'phone' => '',
            'language' => '',
        ];

        if (isset($leadData['field_data']) && is_array($leadData['field_data'])) {
            foreach ($leadData['field_data'] as $field) {
                $name = $field['name'] ?? '';
                $values = $field['values'] ?? [];
                $value = $values[0] ?? '';

                switch ($name) {
                    case 'full_name':
                    case 'first_name':
                    case 'last_name':
                        $normalized['full_name'] = trim($normalized['full_name'] . ' ' . $value);
                        break;
                    case 'email':
                        $normalized['email'] = $value;
                        break;
                    case 'phone_number':
                        $normalized['phone'] = $value;
                        break;
                    case 'language':
                        $normalized['language'] = $value;
                        break;
                }
            }
        }

        return array_map('trim', $normalized);
    }
}
