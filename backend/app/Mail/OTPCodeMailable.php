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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Lumo Clinic - Verification Code</title>
                </head>
                <body style='margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #1E1C4B 0%, #12112e 50%, #1a1040 100%);'>
                    <div style='max-width: 600px; margin: 0 auto; padding: 40px 20px;'>
                        <div style='background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); border-radius: 30px; padding: 50px 40px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);'>
                            <!-- Logo -->
                            <div style='text-align: center; margin-bottom: 40px;'>
                                <div style='display: inline-flex; align-items: center; justify-content: center; width: 80px; height: 80px; background: rgba(6, 182, 212, 0.1); border: 2px solid rgba(6, 182, 212, 0.2); border-radius: 24px; margin-bottom: 20px;'>
                                    <span style='font-size: 32px; font-weight: 900; color: #06B6D4; letter-spacing: 2px;'>LC</span>
                                </div>
                                <h1 style='color: #ffffff; font-size: 28px; font-weight: 900; margin: 0; letter-spacing: -0.5px;'>Lumo Clinic</h1>
                            </div>

                            <!-- Content -->
                            <div style='text-align: center;'>
                                <p style='color: rgba(255, 255, 255, 0.6); font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;'>
                                    Your verification code is below. Enter this code to complete your login process.
                                </p>

                                <div style='background: rgba(6, 182, 212, 0.1); border: 2px solid rgba(6, 182, 212, 0.3); border-radius: 20px; padding: 30px; margin: 30px 0;'>
                                    <span style='font-size: 48px; font-weight: 900; letter-spacing: 8px; color: #06B6D4; display: block;'>{$this->otp}</span>
                                </div>

                                <p style='color: rgba(255, 255, 255, 0.4); font-size: 14px; margin: 30px 0 0 0;'>
                                    This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
                                </p>
                            </div>

                            <!-- Footer -->
                            <div style='margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1); text-align: center;'>
                                <p style='color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0;'>© 2026 Lumo Clinic Global. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            ",
        );
    }
}
