<?php

namespace App\Services\CRM\DTOs;

/**
 * Standardized Lead Data Transfer Object
 * 
 * This DTO ensures consistent data structure across all lead sources
 * and provides type safety for lead submission.
 */
class LeadDTO
{
    private string $type;
    private string $firstName;
    private string $lastName;
    private string $fullName;
    private string $email;
    private string $phone;
    private ?string $country;
    private string $language;
    private ?string $treatment;
    private ?string $subject;
    private ?string $message;
    private ?string $preferredDate;
    private string $source;
    private string $pageUrl;
    private string $ipAddress;
    private ?string $userAgent;
    private array $metadata;

    public function __construct(array $data)
    {
        $this->type = $data['type'] ?? 'booking';
        $this->firstName = $data['first_name'] ?? '';
        $this->lastName = $data['last_name'] ?? '';
        $this->fullName = $data['name'] ?? trim($this->firstName . ' ' . $this->lastName);
        $this->email = $data['email'] ?? '';
        $this->phone = $data['phone'] ?? '';
        $this->country = $data['country'] ?? null;
        $this->language = $data['language'] ?? 'en';
        $this->treatment = $data['treatment'] ?? null;
        $this->subject = $data['subject'] ?? null;
        $this->message = $data['message'] ?? null;
        $this->preferredDate = $data['date'] ?? null;
        $this->source = $data['source'] ?? 'website';
        $this->pageUrl = $data['page_url'] ?? request()->url();
        $this->ipAddress = $data['ip_address'] ?? request()->ip();
        $this->userAgent = $data['user_agent'] ?? request()->userAgent();
        $this->metadata = $data['metadata'] ?? [];
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getFullName(): string
    {
        return $this->fullName;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPhone(): string
    {
        return $this->phone;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function getLanguage(): string
    {
        return $this->language;
    }

    public function getTreatment(): ?string
    {
        return $this->treatment;
    }

    public function getSubject(): ?string
    {
        return $this->subject;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function getPreferredDate(): ?string
    {
        return $this->preferredDate;
    }

    public function getSource(): string
    {
        return $this->source;
    }

    public function getPageUrl(): string
    {
        return $this->pageUrl;
    }

    public function getIpAddress(): string
    {
        return $this->ipAddress;
    }

    public function getUserAgent(): ?string
    {
        return $this->userAgent;
    }

    public function getMetadata(): array
    {
        return $this->metadata;
    }

    /**
     * Convert DTO to array for database storage
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'first_name' => $this->firstName,
            'last_name' => $this->lastName,
            'full_name' => $this->fullName,
            'email' => $this->email,
            'phone' => $this->phone,
            'country' => $this->country,
            'language' => $this->language,
            'treatment' => $this->treatment,
            'subject' => $this->subject,
            'message' => $this->message,
            'preferred_date' => $this->preferredDate,
            'source' => $this->source,
            'page_url' => $this->pageUrl,
            'ip_address' => $this->ipAddress,
            'user_agent' => $this->userAgent,
            'metadata' => json_encode($this->metadata),
        ];
    }

    /**
     * Validate required fields based on lead type
     */
    public function validate(): array
    {
        $errors = [];

        if ($this->type !== 'newsletter' && empty($this->fullName)) {
            $errors['name'] = 'Name is required';
        }

        if (empty($this->email)) {
            $errors['email'] = 'Email is required';
        } elseif (!filter_var($this->email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email format';
        }

        if ($this->type !== 'newsletter' && empty($this->phone)) {
            $errors['phone'] = 'Phone is required';
        }

        if ($this->type === 'booking' && empty($this->treatment)) {
            $errors['treatment'] = 'Treatment is required';
        }

        if ($this->type === 'contact' && empty($this->subject)) {
            $errors['subject'] = 'Subject is required';
        }

        return $errors;
    }
}
