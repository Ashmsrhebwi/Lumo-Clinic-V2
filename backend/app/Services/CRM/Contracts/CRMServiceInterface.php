<?php

namespace App\Services\CRM\Contracts;

use App\Services\CRM\DTOs\LeadDTO;

/**
 * CRM Service Interface
 * 
 * Defines the contract for all CRM integrations (Zoho, Bitrix24, etc.)
 * This ensures consistent behavior across different CRM providers.
 */
interface CRMServiceInterface
{
    /**
     * Create a new lead in the CRM
     *
     * @param LeadDTO $lead
     * @return array|null CRM response data or null on failure
     */
    public function createLead(LeadDTO $lead): ?array;

    /**
     * Check if a lead already exists in the CRM
     *
     * @param string $email
     * @param string $phone
     * @return bool
     */
    public function leadExists(string $email, string $phone): bool;

    /**
     * Get lead details from CRM
     *
     * @param string $leadId
     * @return array|null
     */
    public function getLead(string $leadId): ?array;

    /**
     * Update existing lead in CRM
     *
     * @param string $leadId
     * @param array $data
     * @return array|null
     */
    public function updateLead(string $leadId, array $data): ?array;

    /**
     * Test CRM connection
     *
     * @return bool
     */
    public function testConnection(): bool;
}
