<?php

namespace App\Services;

use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class OtpService
{
    /**
     * Generate and send OTP to user's email
     */
    public function generateAndSendOtp(User $user): Otp
    {
        // Invalidate any existing OTPs for this user
        Otp::where('user_id', $user->id)
            ->where('used', false)
            ->update(['used' => true]);

        // Generate a 6-digit OTP
        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Create OTP record
        $otp = Otp::create([
            'user_id' => $user->id,
            'email' => $user->email,
            'code' => $code,
            'expires_at' => now()->addMinutes(15), // OTP expires in 15 minutes
            'used' => false,
        ]);

        // Send OTP via email
        Mail::raw("Your password reset OTP is: {$code}\n\nThis OTP will expire in 15 minutes.\n\nIf you did not request this, please ignore this email.", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Password Reset OTP');
        });

        return $otp;
    }

    /**
     * Validate OTP code
     */
    public function validateOtp(string $email, string $code): ?Otp
    {
        $otp = Otp::where('email', $email)
            ->where('code', $code)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        return $otp && $otp->isValid() ? $otp : null;
    }

    /**
     * Mark OTP as used
     */
    public function markOtpAsUsed(Otp $otp): void
    {
        $otp->update(['used' => true]);
    }

    /**
     * Check if user exists with given email
     */
    public function userExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    /**
     * Get user by email
     */
    public function getUserByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }
}
