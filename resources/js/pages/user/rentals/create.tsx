import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Package, Calendar, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { useState } from 'react';

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    approved_rental_requests?: string[];
    tankTypes?: string[];
}

export default function RentalRequestCreate({ breadcrumbs = [{ title: 'Dashboard', href: '/user/dashboard' }], approved_rental_requests = [], tankTypes = [] }: Props) {
    const [formData, setFormData] = useState({
        request_type: 'rental',
        tank_type: '',
        purpose: '',
        purpose_other: '',
        contact_number: '',
        address: '',
        pickup_type: 'delivery'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Remove address if pickup type is selected
        const submitData: any = { ...formData };
        if (submitData.pickup_type === 'pickup') {
            delete submitData.address;
        }

        // Combine purpose and purpose_other if "Others" is selected
        submitData.purpose = submitData.purpose === 'Others' ? submitData.purpose_other : submitData.purpose;

        router.post('/user/rentals', submitData, {
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

        // Clear tank type when switching request type
        if (field === 'request_type') {
            setFormData(prev => ({ ...prev, tank_type: '' }));
        }

        // Auto-fill purpose when tank type changes
        if (field === 'tank_type') {
            setFormData(prev => ({
                ...prev,
                purpose: getAutoPurpose(value as string),
                purpose_other: ''
            }));
        }
    };

    const handleTextAreaChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const breadcrumbsWithCreate: BreadcrumbItem[] = [
        ...breadcrumbs,
        { title: 'New Rental Request', href: '/user/rentals/create' }
    ];

    // Filter tank types based on request type
    const availableTankTypes = formData.request_type === 'refill'
        ? tankTypes.filter(type => approved_rental_requests.includes(type))
        : tankTypes;

    const getAutoPurpose = (tankType: string): string => {
        const lowerTankType = tankType.toLowerCase();
        if (lowerTankType.includes('medical') || lowerTankType.includes('oxygen')) {
            return 'Medical Use';
        } else if (lowerTankType.includes('industrial')) {
            return 'Industrial Use';
        } else if (lowerTankType.includes('welding') || lowerTankType.includes('argon') || lowerTankType.includes('acetylene')) {
            return 'Welding';
        } else if (lowerTankType.includes('construction')) {
            return 'Construction';
        } else if (lowerTankType.includes('laboratory') || lowerTankType.includes('nitro')) {
            return 'Laboratory';
        } else {
            return 'Others';
        }
    };

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
                        {/* Request Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Request Type *
                            </label>
                            <select
                                value={formData.request_type}
                                onChange={(e) => handleChange('request_type', e.target.value)}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.request_type ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="rental">New Rental</option>
                                <option value="refill">Refill</option>
                            </select>
                            {errors.request_type && (
                                <p className="mt-1 text-sm text-red-600">{errors.request_type}</p>
                            )}
                        </div>

                        {/* Tank Type */}
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
                                {availableTankTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.tank_type && (
                                <p className="mt-1 text-sm text-red-600">{errors.tank_type}</p>
                            )}
                        </div>

                        {/* Pickup Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Pickup Type *
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pickup_type"
                                        value="delivery"
                                        checked={formData.pickup_type === 'delivery'}
                                        onChange={(e) => handleChange('pickup_type', e.target.value)}
                                        className="mr-2"
                                    />
                                    <span>Delivery</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="pickup_type"
                                        value="pickup"
                                        checked={formData.pickup_type === 'pickup'}
                                        onChange={(e) => handleChange('pickup_type', e.target.value)}
                                        className="mr-2"
                                    />
                                    <span>Pickup</span>
                                </label>
                            </div>
                            {errors.pickup_type && (
                                <p className="mt-1 text-sm text-red-600">{errors.pickup_type}</p>
                            )}
                        </div>

                        {/* Purpose */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Purpose *
                            </label>
                            <select
                                value={formData.purpose}
                                onChange={(e) => handleChange('purpose', e.target.value)}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.purpose ? 'border-red-500' : 'border-gray-300'
                                }`}
                                required
                            >
                                <option value="">Select Purpose</option>
                                <option value="Medical Use">Medical Use</option>
                                <option value="Industrial Use">Industrial Use</option>
                                <option value="Construction">Construction</option>
                                <option value="Welding">Welding</option>
                                <option value="Laboratory">Laboratory</option>
                                <option value="Emergency">Emergency</option>
                                <option value="Others">Others</option>
                            </select>
                            {errors.purpose && (
                                <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
                            )}
                        </div>

                        {/* Purpose Other - Only show when Others is selected */}
                        {formData.purpose === 'Others' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Please Specify *
                                </label>
                                <textarea
                                    value={formData.purpose_other}
                                    onChange={(e) => handleTextAreaChange('purpose_other', e.target.value)}
                                    rows={3}
                                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.purpose_other ? 'border-red-500' : 'border-gray-300'
                                }`}
                                    placeholder="Please describe the purpose of your rental request..."
                                    required
                                />
                                {errors.purpose_other && (
                                    <p className="mt-1 text-sm text-red-600">{errors.purpose_other}</p>
                                )}
                            </div>
                        )}

                        {/* Contact Information */}
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

                        {/* Delivery Address - Only show when delivery is selected */}
                        {formData.pickup_type === 'delivery' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Address *
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
                                        placeholder="Enter your complete delivery address"
                                        required={formData.pickup_type === 'delivery'}
                                    />
                                </div>
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                )}
                            </div>
                        )}

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
