<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OTPCodeMailable extends Mailable
{
    use Queueable, SerializesModels;

    public $otp;

    /**
     * Create a new message instance.
     */
    public function __construct($otp)
    {
        $this->otp = $otp;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Lumo Clinic Verification Code',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #eee; border-radius: 20px; text-align: center;'>
                    <h1 style='color: #F28522;'>Lumo Clinic</h1>
                    <p style='color: #666; font-size: 16px;'>Your verification code is:</p>
                    <div style='margin: 30px 0; background: #f9f9f9; padding: 20px; border-radius: 12px;'>
                        <span style='font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1E1C4B;'>{$this->otp}</span>
                    </div>
                    <p style='color: #999; font-size: 14px;'>This code will expire in 10 minutes.</p>
                </div>
            ",
        );
    }
}
