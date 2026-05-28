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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                    <title>Lumo Clinic - Reset Password</title>
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
                                    You are receiving this email because we received a password reset request for your account.
                                </p>

                                <div style='text-align: center; margin: 40px 0;'>
                                    <a href='{$this->resetUrl}' style='display: inline-block; background: #06B6D4; color: #1E1C4B; padding: 18px 40px; text-decoration: none; border-radius: 16px; font-weight: 900; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 10px 30px rgba(6, 182, 212, 0.3);'>Reset Password</a>
                                </div>

                                <p style='color: rgba(255, 255, 255, 0.4); font-size: 14px; margin: 30px 0 20px 0;'>
                                    This password reset link will expire in 60 minutes.
                                </p>

                                <div style='margin: 30px 0; padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);'>
                                    <p style='color: rgba(255, 255, 255, 0.3); font-size: 12px; margin: 0 0 10px 0; line-height: 1.5;'>
                                        If you're having trouble clicking the button, copy and paste the URL below into your web browser:
                                    </p>
                                    <p style='color: rgba(6, 182, 212, 0.8); font-size: 11px; margin: 0; word-break: break-all; font-family: monospace;'>{$this->resetUrl}</p>
                                </div>
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
