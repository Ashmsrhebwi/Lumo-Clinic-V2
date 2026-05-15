<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\FacebookLead;
use App\Jobs\ProcessMetaLeadJob;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MetaWebhookController extends Controller
{
    /**
     * Handle Meta Webhook Verification (GET).
     */
    public function verify(Request $request)
    {
        $mode = $request->query('hub_mode');
        $token = $request->query('hub_verify_token');
        $challenge = $request->query('hub_challenge');

        $verifyToken = config('services.meta.webhook_verify_token');

        if ($mode === 'subscribe' && $token === $verifyToken) {
            Log::info('Meta Webhook: Verification successful');
            return response($challenge, 200);
        }

        Log::warning('Meta Webhook: Verification failed', [
            'mode' => $mode,
            'token_match' => $token === $verifyToken
        ]);

        return response('Forbidden', 403);
    }

    /**
     * Handle Meta Webhook Events (POST).
     */
    public function handle(Request $request)
    {
        // 1. Validate Signature (Optional but recommended)
        if (!$this->validateSignature($request)) {
            Log::warning('Meta Webhook: Invalid signature');
            return response('Invalid signature', 403);
        }

        $payload = $request->all();
        Log::info('Meta Webhook: Received event', ['payload_summary' => array_keys($payload)]);

        // 2. Process Lead Ads entries
        if (isset($payload['object']) && $payload['object'] === 'page') {
            foreach ($payload['entry'] as $entry) {
                if (isset($entry['changes'])) {
                    foreach ($entry['changes'] as $change) {
                        if ($change['field'] === 'leadgen') {
                            $this->storeAndDispatchLead($change['value'], $payload);
                        }
                    }
                }
            }
        }

        // Always return 200 quickly
        return response('EVENT_RECEIVED', 200);
    }

    /**
     * Store lead and dispatch background job.
     */
    protected function storeAndDispatchLead(array $value, array $fullPayload)
    {
        $leadgenId = $value['leadgen_id'] ?? null;

        if (!$leadgenId) {
            return;
        }

        // Check for duplicates
        if (FacebookLead::where('leadgen_id', $leadgenId)->exists()) {
            Log::info('Meta Webhook: Duplicate lead detected', ['leadgen_id' => $leadgenId]);
            return;
        }

        try {
            $facebookLead = FacebookLead::create([
                'leadgen_id' => $leadgenId,
                'page_id' => $value['page_id'] ?? null,
                'form_id' => $value['form_id'] ?? null,
                'adgroup_id' => $value['adgroup_id'] ?? null, // Meta sometimes sends adgroup instead of adset
                'ad_id' => $value['ad_id'] ?? null,
                'raw_webhook_payload' => $fullPayload,
                'status' => 'pending',
                'received_at' => now(),
            ]);

            // Dispatch job - use dispatchSync if you want immediate execution, 
            // but we use dispatch() which defaults to queue if configured.
            // If queues are not configured, it will run synchronously in sync driver.
            ProcessMetaLeadJob::dispatch($facebookLead);

        } catch (\Exception $e) {
            Log::error('Meta Webhook: Error storing lead', [
                'error' => $e->getMessage(),
                'leadgen_id' => $leadgenId
            ]);
        }
    }

    /**
     * Validate Meta X-Hub-Signature-256.
     */
    protected function validateSignature(Request $request)
    {
        $signature = $request->header('X-Hub-Signature-256');
        $appSecret = config('services.meta.app_secret');

        if (!$signature || !$appSecret) {
            // If secret is not configured, we might allow it for initial testing but log warning
            if (!$appSecret) Log::warning('Meta Webhook: META_APP_SECRET not configured');
            return true; // Or return false if you want to strictly enforce
        }

        $expectedSignature = 'sha256=' . hash_hmac('sha256', $request->getContent(), $appSecret);

        return hash_equals($expectedSignature, $signature);
    }
}
