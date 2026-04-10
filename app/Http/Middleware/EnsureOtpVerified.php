<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureOtpVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        
        // Check if user is authenticated and has verified email
        if ($user && !$user->email_verified_at) {
            // Redirect to OTP verification page with user_id
            return redirect()->route('email.verification.otp')
                ->with('status', 'Please verify your email before accessing the dashboard.')
                ->with('otp_error', 'Email verification required. Please check your email for the OTP code.')
                ->with('user_id', $user->id);
        }

        return $next($request);
    }
}
