import React from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Bell, Shield, Palette, Globe } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';
import { useAppearance } from '@/hooks/use-appearance';

interface UserProfile {
    id: number;
    name: string;
    email: string;
    role: string;
    contact_number?: string;
    address?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

interface PageProps {
    user: UserProfile;
    breadcrumbs: BreadcrumbItem[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    [key: string]: any; // Add index signature for Inertia
}

export default function UserSettings() {
    const { props } = usePage<PageProps>();
    const { user, breadcrumbs, auth } = props;
    const { appearance, updateAppearance } = useAppearance();
    
    // Get flash messages from Inertia
    const flash = usePage().props.flash as any;
    const [successMessage, setSuccessMessage] = React.useState(flash?.success || '');
    
    // Clear success message after 3 seconds
    React.useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const [formData, setFormData] = React.useState({
        name: user.name || '',
        email: user.email || '',
        contact_number: user.contact_number || '',
        address: user.address || '',
    });

    const [notifications, setNotifications] = React.useState({
        email_notifications: true,
        push_notifications: false,
        sms_notifications: true,
    });

    const [preferences, setPreferences] = React.useState({
        theme: appearance,
        language: 'en',
        timezone: 'Asia/Manila',
    });

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('name', formData.name);
        data.append('contact_number', formData.contact_number);
        data.append('address', formData.address);

        router.post('/user/settings/profile', data, {
            onSuccess: () => {
                // Show success message (handled by flash session)
                console.log('Profile updated successfully');
            },
            onError: (errors) => {
                console.error('Profile update errors:', errors);
            }
        });
    };

    const handleNotificationChange = (key: string, value: boolean) => {
        setNotifications(prev => ({
            ...prev,
            [key]: value
        }));
        
        // Auto-save notification preferences
        const data = new FormData();
        data.append('email_notifications', notifications.email_notifications ? '1' : '0');
        data.append('push_notifications', notifications.push_notifications ? '1' : '0');
        data.append('sms_notifications', notifications.sms_notifications ? '1' : '0');

        router.post('/user/settings/notifications', data, {
            onSuccess: () => {
                console.log('Notification preferences updated');
            },
            onError: (errors) => {
                console.error('Notification update errors:', errors);
            }
        });
    };

    const handlePreferenceChange = (key: string, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }));
        
        // If theme changed, use appearance hook to handle it
        if (key === 'theme') {
            updateAppearance(value as 'light' | 'dark' | 'system');
        }
    };

    const handlePreferencesSave = () => {
        const data = new FormData();
        data.append('theme', preferences.theme);
        data.append('language', preferences.language);
        data.append('timezone', preferences.timezone);

        router.post('/user/settings/preferences', data, {
            onSuccess: () => {
                console.log('Preferences updated successfully');
            },
            onError: (errors) => {
                console.error('Preferences update errors:', errors);
            }
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Settings" />

            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Success Message */}
                {successMessage && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {successMessage}
                    </div>
                )}

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                {/* Profile Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                        disabled
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contact_number">Contact Number</Label>
                                    <Input
                                        id="contact_number"
                                        name="contact_number"
                                        type="tel"
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit">Update Profile</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            Notification Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Email Notifications</Label>
                                <p className="text-sm text-gray-500">Receive email updates about your rentals</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifications.email_notifications}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange('email_notifications', e.target.checked)}
                                className="w-4 h-4"
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Push Notifications</Label>
                                <p className="text-sm text-gray-500">Receive browser push notifications</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifications.push_notifications}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange('push_notifications', e.target.checked)}
                                className="w-4 h-4"
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>SMS Notifications</Label>
                                <p className="text-sm text-gray-500">Receive text message alerts</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={notifications.sms_notifications}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange('sms_notifications', e.target.checked)}
                                className="w-4 h-4"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="w-5 h-5" />
                            Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="theme">Theme</Label>
                                <select
                                    id="theme"
                                    value={appearance}
                                    onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="language">Language</Label>
                                <select
                                    id="language"
                                    value={preferences.language}
                                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="en">English</option>
                                    <option value="tl">Filipino</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="timezone">Timezone</Label>
                                <select
                                    id="timezone"
                                    value={preferences.timezone}
                                    onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="Asia/Manila">Asia/Manila</option>
                                    <option value="UTC">UTC</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={handlePreferencesSave}>Save Preferences</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div>
                                <Label>Change Password</Label>
                                <p className="text-sm text-gray-500 mb-2">Update your password to keep your account secure</p>
                                <Button variant="outline">Change Password</Button>
                            </div>
                            <Separator />
                            <div>
                                <Label>Two-Factor Authentication</Label>
                                <p className="text-sm text-gray-500 mb-2">Add an extra layer of security to your account</p>
                                <Button variant="outline">Enable 2FA</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Account Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label className="text-red-600">Delete Account</Label>
                                <p className="text-sm text-gray-500 mb-2">Permanently delete your account and all associated data</p>
                                <Button variant="destructive" size="sm">Delete Account</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
