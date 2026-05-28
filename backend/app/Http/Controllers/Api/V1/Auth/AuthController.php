<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\Setting;
use App\Models\NavbarSection;
use App\Models\NavbarItem;
use App\Mail\OTPCodeMailable;
use App\Mail\PasswordResetMailable;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Admin Access Rule — allowed emails are configured via ADMIN_ALLOWED_EMAILS in .env
        $allowedEmails = array_map('trim', explode(',', config('auth.admin_allowed_emails', 'ahmadshahmsardini@gmail.com')));
        if (!in_array($request->email, $allowedEmails, true)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $admin->otp_code = $otp;
        $admin->otp_expires_at = Carbon::now()->addMinutes(10);
        $admin->save();

        // Log OTP Generation details for Audit
        Log::info('[OTP Audit] Login Flow Started', [
            'submitted_email' => $request->email,
            'admin_id' => $admin->id,
            'admin_email' => $admin->email,
            'otp_generated_at' => Carbon::now()->toDateTimeString(),
            'otp_expires_at' => $admin->otp_expires_at ? $admin->otp_expires_at->toDateTimeString() : null,
        ]);

        // Send OTP via Email
        try {
            Log::info('[OTP Audit] Attempting Mail::to', ['recipient' => $admin->email]);
            Mail::to($admin->email)->send(new OTPCodeMailable($otp));
            Log::info('[OTP Audit] Mail Send Succeeded', ['recipient' => $admin->email]);
        } catch (\Exception $e) {
            Log::error('[OTP Audit] Mail Send Failed', [
                'recipient' => $admin->email,
                'error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'Failed to send OTP email. Please check server configuration.'], 500);
        }

        return response()->json([
            'message' => 'OTP sent successfully',
            'requires_otp' => true,
            'email' => $admin->email
        ]);
    }

    public function resendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (!$admin) {
            Log::warning('[OTP Audit] Resend Failed - Admin not found', ['submitted_email' => $request->email]);
            return response()->json(['message' => 'Admin not found'], 404);
        }

        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $admin->otp_code = $otp;
        $admin->otp_expires_at = Carbon::now()->addMinutes(10);
        $admin->save();

        Log::info('[OTP Audit] Resend Flow Started', [
            'submitted_email' => $request->email,
            'admin_id' => $admin->id,
            'admin_email' => $admin->email,
            'otp_generated_at' => Carbon::now()->toDateTimeString(),
        ]);

        try {
            Log::info('[OTP Audit] Attempting Resend Mail::to', ['recipient' => $admin->email]);
            Mail::to($admin->email)->send(new OTPCodeMailable($otp));
            Log::info('[OTP Audit] Resend Mail Succeeded', ['recipient' => $admin->email]);
        } catch (\Exception $e) {
            Log::error('[OTP Audit] Resend Mail Failed', [
                'recipient' => $admin->email,
                'error' => $e->getMessage()
            ]);
            return response()->json(['message' => 'Failed to resend OTP'], 500);
        }

        return response()->json(['message' => 'OTP resent successfully']);
    }

    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin = Admin::where('email', $request->email)->first();
        if (!$admin) {
            // We return success to prevent user enumeration
            return response()->json(['message' => 'Instructions sent if email exists']);
        }

        // Generate Standard Token
        $token = Password::broker('admins')->createToken($admin);

        // Reset Link — correctly resolves FRONTEND_URL from .env
        $frontendUrl = rtrim(env('FRONTEND_URL', config('app.url')), '/') . '/reset-password';
        $resetUrl = $frontendUrl . '?token=' . $token . '&email=' . urlencode($admin->email);

        // Send HTML Email 
        try {
            Mail::to($admin->email)->send(new PasswordResetMailable($resetUrl));
        } catch (\Exception $e) {
            \Log::error('Password Reset Email Failed: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to send reset email. Please contact support.'], 500);
        }

        return response()->json([
            'message' => 'Reset link sent successfully',
            'email' => $admin->email
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $status = Password::broker('admins')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->password = $password; // Using hashed cast in model
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully']);
        }

        return response()->json(['message' => 'Invalid or expired token'], 401);
    }

    public function verifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'code' => 'required|string|size:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $admin = Admin::where('email', $request->email)
            ->where('otp_code', $request->code)
            ->where('otp_expires_at', '>', Carbon::now())
            ->first();

        if (!$admin) {
            return response()->json(['message' => 'Invalid or expired code'], 401);
        }

        // Success - Clear OTP
        $admin->otp_code = null;
        $admin->otp_expires_at = null;
        $admin->save();

        $token = $admin->createToken('admin-access')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => [
                'email' => $admin->email,
                'role' => 'admin'
            ]
        ]);
    }

    public function me(Request $request)
    {
        $admin = auth('sanctum')->user();
        if (!$admin) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return response()->json([
            'email' => $admin->email,
            'role' => 'admin'
        ]);
    }

    public function logout(Request $request)
    {
        // Revoke the current access token to prevent reuse
        // This ensures the token cannot be used after logout
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
