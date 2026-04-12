import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Package, Calendar, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useState } from 'react';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
}

export default function RentalRequestCreate({ breadcrumbs = [{ title: 'Dashboard', href: '/user/dashboard' }] }: Props) {
    const [formData, setFormData] = useState({
        tank_type: '',
        quantity: 1,
        start_date: '',
        end_date: '',
        purpose: '',
        contact_number: '',
        address: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        router.post('/user/rentals', formData, {
            onError: (errors) => {
                setErrors(errors as Record<string, string>);
            },
            onSuccess: () => {
                router.visit('/user/dashboard');
            }
        });
    };

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const breadcrumbsWithCreate: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: 'New Rental Request', href: '/user/rentals/create' }
    ];

    const tankTypes = [
        'Medical Oxygen',
        'Industrial Oxygen', 
        'Argon Tank',
        'NitroGen',
        'Flask Type Tank',
        'Acetylene'
    ];

    return (
        <AppLayout>
            <Head title="New Rental Request" />
            <div className="min-h-screen bg-gray-50 p-6 w-full">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbsWithCreate} />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">New Rental Request</h1>
                            <p className="text-gray-600">Submit a request for oxygen tank rental</p>
                        </div>
                        <a
                            href="/user/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </a>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tank Type and Quantity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tank Type *
                                </label>
                                <select
                                    value={formData.tank_type}
                                    onChange={(e) => handleChange('tank_type', e.target.value)}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.tank_type ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                >
                                    <option value="">Select tank type</option>
                                    {tankTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                                {errors.tank_type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tank_type}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.quantity && (
                                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                                )}
                            </div>
                        </div>

                        {/* Rental Period */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) => handleChange('start_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.start_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) => handleChange('end_date', e.target.value)}
                                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.end_date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                )}
                            </div>
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purpose *
                            </label>
                            <textarea
                                value={formData.purpose}
                                onChange={(e) => handleChange('purpose', e.target.value)}
                                rows={3}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.purpose ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Please describe the purpose of your rental request..."
                                required
                            />
                            {errors.purpose && (
                                <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                            )}
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contact Number *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.contact_number}
                                        onChange={(e) => handleChange('contact_number', e.target.value)}
                                        className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.contact_number ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="09XX-XXX-XXXX"
                                        required
                                    />
                                </div>
                                {errors.contact_number && (
                                    <p className="mt-1 text-sm text-red-600">{errors.contact_number}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Delivery Address *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.address ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                        placeholder="Enter delivery address"
                                        required
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-4">
                            <a
                                href="/user/dashboard"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </a>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <Package className="w-4 h-4 mr-2" />
                                Submit Request
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
