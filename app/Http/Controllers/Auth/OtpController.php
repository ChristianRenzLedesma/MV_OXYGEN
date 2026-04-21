<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Otp;
use App\Services\OtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Mail\OtpVerificationMail;
use Inertia\Inertia;
use Inertia\Response;

class OtpController extends Controller
{
    protected $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Generate and send OTP to user email
     */
    public function send(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::findOrFail($request->user_id);
        
        // Generate 6-digit OTP
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        
        // Store OTP in cache for 10 minutes
        Cache::put("otp_{$user->id}", $otp, 600);
        
        // Send OTP email
        try {
            Mail::to($user->email)->send(new OtpVerificationMail($otp, $user));
            
            return response()->json([
                'message' => 'OTP sent successfully',
                'otp_code' => app()->environment('local') ? $otp : null // Show OTP in local env for testing
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to send OTP: ' . $e->getMessage(),
                'otp_code' => $otp // Fallback: show OTP even if email fails
            ], 500);
        }
    }

    /**
     * Verify OTP and authenticate user
     */
    public function verify(Request $request)
    {
        $request->validate([
            'otp' => 'required|string|size:6',
            'user_id' => 'required|exists:users,id'
        ]);

        $user = User::findOrFail($request->user_id);
        $cachedOtp = Cache::get("otp_{$user->id}");

        if (!$cachedOtp || $cachedOtp !== $request->otp) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP code']);
        }

        // Clear OTP from cache
        Cache::forget("otp_{$user->id}");

        // Mark user as verified and login
        $user->email_verified_at = now();
        $user->save();

        Auth::login($user);

        // Redirect based on user role
        if ($user->role === 'admin') {
            return redirect()->route('dashboard');
        } else {
            return redirect()->route('user.dashboard');
        }
    }

    /**
     * Resend OTP
     */
    public function resend(Request $request)
    {
        return $this->send($request);
    }

    /**
     * Send password reset OTP to user email
     */
    public function sendPasswordResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $user = $this->otpService->getUserByEmail($request->email);

        if (!$user) {
            return back()->withErrors(['email' => 'No account found with this email address.']);
        }

        $otp = $this->otpService->generateAndSendOtp($user);

        return Inertia::render('auth/forgot-password-otp', [
            'email' => $request->email,
            'success' => 'OTP has been sent to your email address. Please check your inbox.',
            'expires_at' => $otp->expires_at->format('Y-m-d H:i:s')
        ]);
    }

    /**
     * Verify password reset OTP
     */
    public function verifyPasswordResetOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $otp = $this->otpService->validateOtp($request->email, $request->otp);

        if (!$otp) {
            return back()->withErrors(['otp' => 'Invalid or expired OTP code.']);
        }

        // Mark OTP as used
        $this->otpService->markOtpAsUsed($otp);

        // Generate a token for password reset
        $token = Str::random(60);

        // Store the token in cache with the email
        Cache::put("password_reset_{$token}", $request->email, now()->addMinutes(60));

        // Redirect to password reset form with token
        return redirect()->route('password.reset', ['token' => $token]);
    }
}
