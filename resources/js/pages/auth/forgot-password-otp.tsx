import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ForgotPasswordOtp({ email, success, expires_at }: { email: string; success: string; expires_at: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: email,
        otp: '',
    });

    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.otp.verify'));
    };

    const handleResend = () => {
        setResendDisabled(true);
        setCountdown(60);
        post(route('password.otp.send'), {
            onSuccess: () => {
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setResendDisabled(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            },
        });
    };

    return (
        <>
            <Head title="Verify OTP - Reset Password" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <div className="flex justify-center">
                            <img
                                src="images/mv-oxygen-logo.png"
                                alt="MV Oxygen Trading Logo"
                                className="w-16 h-16"
                            />
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Verify OTP
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Enter the 6-digit OTP sent to your email
                        </p>
                    </div>

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{success}</span>
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm space-y-4">
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                    OTP Code
                                </label>
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    value={data.otp}
                                    onChange={(e) => setData('otp', e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                                    placeholder="000000"
                                />
                                {errors.otp && (
                                    <p className="mt-2 text-sm text-red-600">{errors.otp}</p>
                                )}
                            </div>

                            <div className="text-sm text-gray-500 text-center">
                                <p>OTP expires at: {new Date(expires_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendDisabled}
                                className="text-sm text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {resendDisabled
                                    ? `Resend OTP in ${countdown}s`
                                    : "Didn't receive OTP? Resend"}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                href={route('login')}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
