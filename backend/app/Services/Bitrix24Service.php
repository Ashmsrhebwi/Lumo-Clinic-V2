<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class Bitrix24Service
{
    protected $webhookUrl;
    protected $assignedById;
    protected $sourceId;

    public function __construct()
    {
        $this->webhookUrl = config('services.bitrix24.webhook_url');
        $this->assignedById = config('services.bitrix24.assigned_by_id', 1);
        $this->sourceId = config('services.bitrix24.source_id', 'WEB');
    }

    /**
     * Create a new lead in Bitrix24.
     *
     * @param array $data ['name', 'email', 'phone', 'treatment', 'message', 'date', 'language']
     * @return array|null
     */
    public function createLead(array $data)
    {
        if (!$this->webhookUrl) {
            Log::error('Bitrix24: Webhook URL not configured.');
            return null;
        }

        $type = $data['type'] ?? 'booking';
        $name = $data['name'] ?? ($type === 'newsletter' ? 'Website Subscriber' : 'Unknown');
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $subject = $data['subject'] ?? '';
        $message = $data['message'] ?? '';
        $treatment = $data['treatment'] ?? '';
        $date = $data['date'] ?? '';

        $title = "Website Booking - " . ($treatment ?: 'General');
        $comments = "Source: Website Booking\n";

        if ($type === 'contact') {
            $title = "Website Contact - " . ($subject ?: 'General Inquiry');
            $comments = "Source: Website Contact Form\n";
            $comments .= "Subject: " . ($subject ?: 'N/A') . "\n";
            $comments .= "Message: " . ($message ?: 'N/A');
        } elseif ($type === 'newsletter') {
            $title = "Website Newsletter Subscription";
            $comments = "Source: Website Newsletter Form\n";
            $comments .= "Email: " . $email;
        } else {
            $comments .= "Selected Treatment: " . ($treatment ?: 'N/A') . "\n";
            if ($date) {
                $comments .= "Preferred Date: " . $date . "\n";
            }
            if ($message) {
                $comments .= "User Message: " . $message;
            }
        }

        $languageMap = [
            'Arabic' => '61',
            'English' => '63',
            'French' => '65',
            'Russian' => '67',
        ];
        
        $languageAliases = [
            'ar' => 'Arabic',
            'en' => 'English',
            'fr' => 'French',
            'ru' => 'Russian',
            'Arabic' => 'Arabic',
            'English' => 'English',
            'French' => 'French',
            'Russian' => 'Russian',
        ];
        
        $incomingLanguage = $data['language'] ?? 'en';
        $langKey = $languageAliases[$incomingLanguage] ?? 'English';
        $languageId = $languageMap[$langKey] ?? null;
        
        $treatmentMap = [
            'Dental Implants' => '77',
            'Hollywood Smile' => '79',
            'Male Hair Transplant' => '81',
            'Female Hair Transplant' => '83',
            'Beard & Moustache Transplant' => '85',
            'Eyebrow Transplant' => '87',
        ];
        
        $interestedForIds = [];
        
        if (!empty($data['treatment']) && isset($treatmentMap[$data['treatment']])) {
            $interestedForIds = [$treatmentMap[$data['treatment']]];
        }

        $fields = [
            'fields' => [
                'TITLE' => $title,
                'NAME' => $name,
                'PHONE' => [
                    ['VALUE' => $phone, 'VALUE_TYPE' => 'WORK']
                ],
                'EMAIL' => [
                    ['VALUE' => $email, 'VALUE_TYPE' => 'WORK']
                ],
                'COMMENTS' => $comments,
                'ASSIGNED_BY_ID' => $this->assignedById,
                'SOURCE_ID' => $this->sourceId,
                'UF_CRM_1775549013' => $languageId,
                'UF_CRM_1775725170' => $interestedForIds,
            ],
            'params' => [
                'REGISTER_SONET_EVENT' => 'Y'
            ]
        ];

        try {
            $response = Http::post($this->webhookUrl, $fields);

            if ($response->successful()) {
                Log::info('Bitrix24: Lead created successfully.', [
                    'response' => $response->json(),
                    'sent_language_id' => $languageId,
                    'sent_language_key' => $langKey,
                ]);
                return $response->json();
            } else {
                Log::error('Bitrix24: Failed to create lead.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'fields' => $fields
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Bitrix24: Exception during lead creation.', [
                'error' => $e->getMessage()
            ]);
        }

        return null;
    }
    public function createFacebookLead(array $data)
{
    if (!$this->webhookUrl) {
        Log::error('Bitrix24: Webhook URL not configured.');
        return null;
    }

    $name = $data['full_name'] ?? 'Facebook Lead';
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $platform = $data['platform'] ?? 'FACEBOOK';
    $formId = $data['form_id'] ?? 'N/A';
    $pageId = $data['page_id'] ?? 'N/A';
    $leadgenId = $data['leadgen_id'] ?? 'N/A';
    $language = $data['language'] ?? null;

    $title = "Meta Lead Ads - {$platform}";

    $comments = "Source: {$platform} Lead Ads\n";
    $comments .= "Form ID: {$formId}\n";
    $comments .= "Page ID: {$pageId}\n";
    $comments .= "Leadgen ID: {$leadgenId}\n";

    if ($language) {
        $comments .= "Language: {$language}\n";
    }

    $fields = [
        'fields' => [
            'TITLE' => $title,
            'NAME' => $name,
            'PHONE' => [
                ['VALUE' => $phone, 'VALUE_TYPE' => 'WORK']
            ],
            'EMAIL' => [
                ['VALUE' => $email, 'VALUE_TYPE' => 'WORK']
            ],
            'COMMENTS' => $comments,
            'ASSIGNED_BY_ID' => $this->assignedById,
            'SOURCE_ID' => 'FACEBOOK',
        ],
        'params' => [
            'REGISTER_SONET_EVENT' => 'Y'
        ]
    ];

    try {
        $response = Http::post($this->webhookUrl, $fields);

        if ($response->successful()) {
            Log::info('Bitrix24: Facebook lead created successfully.', [
                'response' => $response->json(),
                'leadgen_id' => $leadgenId,
            ]);
            return $response->json();
        }

        Log::error('Bitrix24: Failed to create Facebook lead.', [
            'status' => $response->status(),
            'body' => $response->body(),
            'leadgen_id' => $leadgenId,
        ]);
    } catch (\Exception $e) {
        Log::error('Bitrix24: Exception during Facebook lead creation.', [
            'error' => $e->getMessage(),
            'leadgen_id' => $leadgenId,
        ]);
    }

    return null;
    }
}