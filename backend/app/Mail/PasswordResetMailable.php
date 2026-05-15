<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PasswordResetMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $resetUrl;

    /**
     * Create a new message instance.
     */
    public function __construct($resetUrl)
    {
        $this->resetUrl = $resetUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reset Your Lumo Clinic Password',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 20px;'>
                    <h1 style='color: #F28522;'>Lumo Clinic</h1>
                    <p>You are receiving this email because we received a password reset request for your account.</p>
                    <div style='text-align: center; margin: 40px 0;'>
                        <a href='{$this->resetUrl}' style='background-color: #F28522; color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold;'>Reset Password</a>
                    </div>
                    <p style='color: #666; font-size: 14px;'>This password reset link will expire in 60 minutes.</p>
                    <hr style='border: none; border-top: 1px solid #eee; margin: 30px 0;' />
                    <p style='font-size: 12px; color: #999;'>If you're having trouble clicking the 'Reset Password' button, copy and paste the URL below into your web browser:</p>
                    <p style='font-size: 12px; color: #999; word-break: break-all;'>{$this->resetUrl}</p>
                </div>
            ",
        );
    }
}
