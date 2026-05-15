<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacebookLead extends Model
{
    protected $fillable = [
        'leadgen_id',
        'page_id',
        'form_id',
        'campaign_id',
        'adset_id',
        'ad_id',
        'platform',
        'full_name',
        'phone',
        'email',
        'language',
        'raw_webhook_payload',
        'raw_lead_payload',
        'bitrix_payload',
        'bitrix_response',
        'bitrix_lead_id',
        'status',
        'attempts',
        'last_error',
        'received_at',
        'sent_to_bitrix_at',
    ];

    protected $casts = [
        'raw_webhook_payload' => 'array',
        'raw_lead_payload' => 'array',
        'bitrix_payload' => 'array',
        'bitrix_response' => 'array',
        'received_at' => 'datetime',
        'sent_to_bitrix_at' => 'datetime',
    ];
}
