<?php

namespace App\Jobs;

use App\Models\FacebookLead;
use App\Services\Bitrix24Service;
use App\Services\MetaLeadService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessMetaLeadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $facebookLead;

    /**
     * Create a new job instance.
     */
    public function __construct(FacebookLead $facebookLead)
    {
        $this->facebookLead = $facebookLead;
    }

    /**
     * Execute the job.
     */
    public function handle(MetaLeadService $metaService, Bitrix24Service $bitrixService): void
    {
        if ($this->facebookLead->status === 'sent' || $this->facebookLead->status === 'duplicate') {
            return;
        }

        $this->facebookLead->update(['status' => 'processing']);
        $this->facebookLead->increment('attempts');

        try {
            // 1. Fetch lead details from Meta
            $leadData = $metaService->getLeadDetails($this->facebookLead->leadgen_id);

            if (!$leadData) {
                $this->facebookLead->update([
                    'status' => 'failed',
                    'last_error' => 'Failed to fetch lead details from Meta Graph API'
                ]);
                return;
            }

            $this->facebookLead->update(['raw_lead_payload' => $leadData]);

            // 2. Normalize data
            $normalizedData = $metaService->normalizeLeadData($leadData);
            
            $this->facebookLead->update([
                'full_name' => $normalizedData['full_name'],
                'email' => $normalizedData['email'],
                'phone' => $normalizedData['phone'],
                'language' => $normalizedData['language'],
                'platform' => $leadData['platform'] ?? 'FACEBOOK',
            ]);

            // 3. Send to Bitrix
            $bitrixResponse = $bitrixService->createFacebookLead($this->facebookLead->toArray());

            if ($bitrixResponse && isset($bitrixResponse['result'])) {
                $this->facebookLead->update([
                    'status' => 'sent',
                    'bitrix_response' => $bitrixResponse,
                    'bitrix_lead_id' => $bitrixResponse['result'],
                    'sent_to_bitrix_at' => now(),
                ]);
            } else {
                $this->facebookLead->update([
                    'status' => 'failed',
                    'bitrix_response' => $bitrixResponse,
                    'last_error' => 'Bitrix24 sync failed or returned no lead ID'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('ProcessMetaLeadJob: Exception', [
                'error' => $e->getMessage(),
                'leadgen_id' => $this->facebookLead->leadgen_id
            ]);

            $this->facebookLead->update([
                'status' => 'failed',
                'last_error' => $e->getMessage()
            ]);
        }
    }
}
