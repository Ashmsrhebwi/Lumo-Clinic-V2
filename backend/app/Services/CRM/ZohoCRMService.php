<?php

namespace App\Services\CRM;

use App\Services\CRM\Contracts\CRMServiceInterface;
use App\Services\CRM\DTOs\LeadDTO;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Zoho CRM Service
 * 
 * Enterprise-grade service for Zoho CRM lead integration.
 * Implements OAuth 2.0 authentication and provides robust error handling.
 */
class ZohoCRMService implements CRMServiceInterface
{
    private string $clientId;
    private string $clientSecret;
    private string $redirectUri;
    private string $refreshToken;
    private string $accessToken;
    private string $apiDomain;
    private string $organizationId;
    private string $leadModule;

    public function __construct()
    {
        $this->clientId = config('services.zoho.client_id');
        $this->clientSecret = config('services.zoho.client_secret');
        $this->redirectUri = config('services.zoho.redirect_uri');
        $this->refreshToken = config('services.zoho.refresh_token');
        $this->apiDomain = config('services.zoho.api_domain', 'https://www.zohoapis.com');
        $this->organizationId = config('services.zoho.organization_id');
        $this->leadModule = config('services.zoho.lead_module', 'Leads');
        
        // Get access token from cache or generate new one
        $this->accessToken = $this->getAccessToken();
    }

    /**
     * Get valid access token (cached or refreshed)
     */
    private function getAccessToken(): ?string
    {
        $cacheKey = 'zoho_access_token';
        
        // Try to get from cache first
        $token = Cache::get($cacheKey);
        if ($token) {
            return $token;
        }

        // Refresh token if not in cache
        return $this->refreshAccessToken();
    }

    /**
     * Refresh access token using refresh token
     */
    private function refreshAccessToken(): ?string
    {
        if (!$this->refreshToken) {
            Log::error('Zoho CRM: Refresh token not configured');
            return null;
        }

        try {
            $response = Http::asForm()->post("{$this->apiDomain}/oauth/v2/token", [
                'refresh_token' => $this->refreshToken,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'grant_type' => 'refresh_token',
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $accessToken = $data['access_token'] ?? null;
                
                if ($accessToken) {
                    // Cache for 50 minutes (tokens expire in 1 hour)
                    Cache::put('zoho_access_token', $accessToken, 50 * 60);
                    Log::info('Zoho CRM: Access token refreshed successfully');
                    return $accessToken;
                }
            }

            Log::error('Zoho CRM: Failed to refresh access token', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
        } catch (\Exception $e) {
            Log::error('Zoho CRM: Exception during token refresh', [
                'error' => $e->getMessage(),
            ]);
        }

        return null;
    }

    /**
     * Create a new lead in Zoho CRM
     *
     * @param LeadDTO $lead
     * @return array|null
     */
    public function createLead(LeadDTO $lead): ?array
    {
        if (!$this->accessToken) {
            Log::error('Zoho CRM: No access token available');
            return null;
        }

        $zohoLeadData = $this->mapToZohoFormat($lead);

        try {
            $url = "{$this->apiDomain}/crm/v2/{$this->leadModule}";
            
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$this->accessToken}",
                'Content-Type' => 'application/json',
            ])->post($url, [
                'data' => [$zohoLeadData],
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $leadId = $data['data'][0]['details']['id'] ?? null;
                
                Log::info('Zoho CRM: Lead created successfully', [
                    'lead_id' => $leadId,
                    'email' => $lead->getEmail(),
                    'type' => $lead->getType(),
                ]);

                return $data;
            }

            Log::error('Zoho CRM: Failed to create lead', [
                'status' => $response->status(),
                'body' => $response->body(),
                'email' => $lead->getEmail(),
            ]);

            // If token expired, try once more with refreshed token
            if ($response->status() === 401 || $response->status() === 403) {
                $this->accessToken = $this->refreshAccessToken();
                if ($this->accessToken) {
                    return $this->createLead($lead);
                }
            }
        } catch (\Exception $e) {
            Log::error('Zoho CRM: Exception during lead creation', [
                'error' => $e->getMessage(),
                'email' => $lead->getEmail(),
            ]);
        }

        return null;
    }

    /**
     * Check if a lead already exists in Zoho CRM
     *
     * @param string $email
     * @param string $phone
     * @return bool
     */
    public function leadExists(string $email, string $phone): bool
    {
        if (!$this->accessToken) {
            return false;
        }

        try {
            // Search by email first
            $url = "{$this->apiDomain}/crm/v2/{$this->leadModule}/search";
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$this->accessToken}",
            ])->get($url, [
                'criteria' => "(Email:equals:{$email})",
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (!empty($data['data'])) {
                    return true;
                }
            }

            // Search by phone if email not found
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$this->accessToken}",
            ])->get($url, [
                'criteria' => "(Phone:equals:{$phone})",
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return !empty($data['data']);
            }
        } catch (\Exception $e) {
            Log::error('Zoho CRM: Exception during lead existence check', [
                'error' => $e->getMessage(),
                'email' => $email,
            ]);
        }

        return false;
    }

    /**
     * Get lead details from Zoho CRM
     *
     * @param string $leadId
     * @return array|null
     */
    public function getLead(string $leadId): ?array
    {
        if (!$this->accessToken) {
            return null;
        }

        try {
            $url = "{$this->apiDomain}/crm/v2/{$this->leadModule}/{$leadId}";
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$this->accessToken}",
            ])->get($url);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Zoho CRM: Failed to get lead', [
                'status' => $response->status(),
                'lead_id' => $leadId,
            ]);
        } catch (\Exception $e) {
            Log::error('Zoho CRM: Exception during lead retrieval', [
                'error' => $e->getMessage(),
                'lead_id' => $leadId,
            ]);
        }

        return null;
    }

    /**
     * Update existing lead in Zoho CRM
     *
     * @param string $leadId
     * @param array $data
     * @return array|null
     */
    public function updateLead(string $leadId, array $data): ?array
    {
        if (!$this->accessToken) {
            return null;
        }

        try {
            $url = "{$this->apiDomain}/crm/v2/{$this->leadModule}/{$leadId}";
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$this->accessToken}",
                'Content-Type' => 'application/json',
            ])->put($url, [
                'data' => [$data],
            ]);

            if ($response->successful()) {
                Log::info('Zoho CRM: Lead updated successfully', [
                    'lead_id' => $leadId,
                ]);
                return $response->json();
            }

            Log::error('Zoho CRM: Failed to update lead', [
                'status' => $response->status(),
                'lead_id' => $leadId,
            ]);
        } catch (\Exception $e) {
            Log::error('Zoho CRM: Exception during lead update', [
                'error' => $e->getMessage(),
                'lead_id' => $leadId,
            ]);
        }

        return null;
    }

    /**
     * Test Zoho CRM connection
     *
     * @return bool
     */
    public function testConnection(): bool
    {
        if (!$this->accessToken) {
            return false;
        }

        try {
            $url = "{$this->apiDomain}/crm/v2/settings/organizations";
            $response = Http::withHeaders([
                'Authorization' => "Zoho-oauthtoken {$this->accessToken}",
            ])->get($url);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Zoho CRM: Connection test failed', [
                'error' => $e->getMessage(),
            ]);
        }

        return false;
    }

    /**
     * Map LeadDTO to Zoho CRM format
     *
     * @param LeadDTO $lead
     * @return array
     */
    private function mapToZohoFormat(LeadDTO $lead): array
    {
        $data = [
            'Lead_Name' => $lead->getFullName(),
            'Email' => $lead->getEmail(),
            'Phone' => $lead->getPhone(),
            'Lead_Source' => $this->mapSourceToZoho($lead->getSource()),
            'Description' => $this->buildDescription($lead),
            'Lead_Status' => 'New',
        ];

        // Add optional fields
        if ($lead->getCountry()) {
            $data['Country'] = $lead->getCountry();
        }

        if ($lead->getTreatment()) {
            $data['Industry'] = $lead->getTreatment();
        }

        if ($lead->getSubject()) {
            $data['Title'] = $lead->getSubject();
        }

        // Add custom fields for multilingual support
        $data['Language'] = $lead->getLanguage();

        // Add metadata as custom fields if needed
        if (!empty($lead->getMetadata())) {
            $data['Website'] = $lead->getPageUrl();
        }

        return $data;
    }

    /**
     * Map source to Zoho CRM lead source values
     *
     * @param string $source
     * @return string
     */
    private function mapSourceToZoho(string $source): string
    {
        $sourceMap = [
            'website' => 'Website',
            'facebook' => 'Facebook',
            'instagram' => 'Instagram',
            'google' => 'Google Ads',
            'referral' => 'Referral',
            'direct' => 'Direct',
        ];

        return $sourceMap[$source] ?? 'Website';
    }

    /**
     * Build description field for Zoho CRM
     *
     * @param LeadDTO $lead
     * @return string
     */
    private function buildDescription(LeadDTO $lead): string
    {
        $description = "Source: {$lead->getSource()}\n";
        $description .= "Page URL: {$lead->getPageUrl()}\n";
        $description .= "Language: {$lead->getLanguage()}\n";

        if ($lead->getType() === 'booking') {
            $description .= "Type: Booking Request\n";
            if ($lead->getTreatment()) {
                $description .= "Treatment: {$lead->getTreatment()}\n";
            }
            if ($lead->getPreferredDate()) {
                $description .= "Preferred Date: {$lead->getPreferredDate()}\n";
            }
        } elseif ($lead->getType() === 'contact') {
            $description .= "Type: Contact Inquiry\n";
            if ($lead->getSubject()) {
                $description .= "Subject: {$lead->getSubject()}\n";
            }
        } elseif ($lead->getType() === 'newsletter') {
            $description .= "Type: Newsletter Subscription\n";
        }

        if ($lead->getMessage()) {
            $description .= "\nMessage:\n{$lead->getMessage()}";
        }

        return $description;
    }
}
