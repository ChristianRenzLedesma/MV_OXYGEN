import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, ArrowLeft, AlertCircle, XCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: string | number | boolean | Blob | File | null | undefined;
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    error?: string;
}

export default function Login({ status, canResetPassword, error }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
            onError: (errors) => {
                // Errors will be automatically displayed by useForm
                console.error('Login failed:', errors);
            },
        });
    };

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-4">
            <Head title="Log in" />
            
            <div className="w-full max-w-6xl px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeInUp" style={{ minHeight: '600px' }}>
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Image Column */}
                        <div className="lg:w-1/2 relative hidden lg:block animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <img 
                                src="/images/hero-image2.png" 
                                alt="Oxygen Tanks" 
                                className="w-full h-full object-cover"
                                style={{ minHeight: '600px' }}
                            />
                            <div 
                                className="absolute inset-0"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(30,136,229,0.3) 0%, rgba(30,136,229,0.1) 100%)'
                                }}
                            />
                        </div>
                        
                        {/* Right Form Column */}
                        <div className="lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
                            <div className="w-full animate-fadeInUp" style={{ maxWidth: '350px', animationDelay: '0.4s' }}>
                                {/* Back to Home */}
                                <div className="mb-3 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                                    <a 
                                        href="/" 
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span>Back to Home</span>
                                    </a>
                                </div>
                                
                                {/* Welcome Title */}
                                <div className="mb-4 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                                    <h1 
                                        className="font-bold mb-1 italic"
                                        style={{ 
                                            fontSize: '2.5rem', 
                                            color: '#1E88E5'
                                        }}
                                    >
                                        Welcome Back!
                                    </h1>
                                </div>

                                {/* Session Status */}
                                {status && (
                                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2 animate-fadeIn">
                                        <AlertCircle className="w-5 h-5" />
                                        {status}
                                    </div>
                                )}

                                {/* Error Message */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2 animate-fadeIn">
                                        <XCircle className="w-5 h-5" />
                                        {error}
                                    </div>
                                )}

                                {/* Form General Errors */}
                                {errors.email && errors.password && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2 animate-fadeIn">
                                        <XCircle className="w-5 h-5" />
                                        Invalid email or password. Please try again.
                                    </div>
                                )}

                                <form onSubmit={submit} className="animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
                                    {/* Email Address */}
                                    <div className="mb-3">
                                        <Label htmlFor="email" className="form-label font-semibold text-black">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            className="w-full transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            style={{
                                                borderRadius: '8px',
                                                border: '1px solid #ddd'
                                            }}
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoFocus
                                            placeholder="email@example.com"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password */}
                                    <div className="mb-3">
                                        <Label htmlFor="password" className="form-label font-semibold text-black">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                className="w-full pr-12 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #ddd'
                                                }}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                placeholder="Password"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePassword}
                                                className="absolute right-0 top-0 h-full px-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                                                style={{
                                                    borderRadius: '0 8px 8px 0',
                                                    border: '1px solid #ddd',
                                                    borderLeft: 'none',
                                                    backgroundColor: '#f8f9fa'
                                                }}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="remember_me"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                style={{ borderColor: '#ddd' }}
                                            />
                                            <label htmlFor="remember_me" className="ml-2 text-sm text-gray-600">
                                                Remember Me
                                            </label>
                                        </div>
                                        {canResetPassword && (
                                            <a 
                                                href={route('password.request')} 
                                                className="text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Forgot Password?
                                            </a>
                                        )}
                                    </div>

                                    {/* Login Button */}
                                    <Button
                                        type="submit"
                                        className="w-full font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                        style={{
                                            backgroundColor: '#42A5F5',
                                            border: 'none',
                                            borderRadius: '8px',
                                            padding: '12px'
                                        }}
                                        disabled={processing}
                                    >
                                        {processing && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                                        Login
                                    </Button>
                                    
                                    <a 
                                        href={route('register')} 
                                        className="text-sm text-blue-600 hover:text-blue-700 text-center block mt-3 transition-colors"
                                    >
                                        Don't have an account? Register
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
