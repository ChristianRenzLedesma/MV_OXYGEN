import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Users, Package, Calendar, Phone, MapPin, CheckCircle, AlertCircle, ArrowLeft, Edit } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Customer {
    id: number;
    name: string;
    email: string;
}

interface Product {
    id: number;
    name: string;
}

interface Rental {
    id: number;
    status: string;
    pickup_date?: string;
    return_date?: string;
    total_amount?: number;
    notes?: string;
}

interface RentalRequest {
    id: number;
    customer: Customer;
    product?: Product;
    tank_type: string;
    quantity: number;
    start_date: string;
    end_date: string;
    purpose: string;
    contact_number: string;
    address: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    admin_notes?: string;
    rejected_reason?: string;
    created_at: string;
    rental?: Rental;
}

interface Props {
    rentalRequest: RentalRequest;
}

export default function RentalShow({ rentalRequest }: Props) {
    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this rental request?')) {
            router.post(`/rentals/${rentalRequest.id}/approve`, {}, {
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    const handleReject = () => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            router.post(`/rentals/${rentalRequest.id}/reject`, { rejected_reason: reason }, {
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    const updateNotes = (notes: string) => {
        router.put(`/rentals/${rentalRequest.id}/notes`, { admin_notes: notes }, {
            onSuccess: () => {
                router.reload();
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Rentals', href: '/rentals' },
        { title: 'Request Details', href: `/rentals/${rentalRequest.id}` }
    ];

    return (
        <AppLayout>
            <Head title="Rental Request Details - Admin" />
            <div className="min-h-screen bg-gray-50 p-6" style={{ marginLeft: '2rem' }}>
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Rental Request Details</h1>
                            <p className="text-gray-600">View and manage rental request information</p>
                        </div>
                        <a
                            href="/rentals"
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Rentals
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-blue-600" />
                                Customer Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Name</label>
                                    <p className="text-gray-800">{rentalRequest.customer.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-gray-800">{rentalRequest.customer.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Contact Number</label>
                                    <p className="text-gray-800 flex items-center">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        {rentalRequest.contact_number}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Address</label>
                                    <p className="text-gray-800 flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                        {rentalRequest.address}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rental Details */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-blue-600" />
                                Rental Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Tank Type</label>
                                    <p className="text-gray-800">{rentalRequest.tank_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Quantity</label>
                                    <p className="text-gray-800">{rentalRequest.quantity} unit(s)</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Start Date</label>
                                    <p className="text-gray-800 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        {new Date(rentalRequest.start_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">End Date</label>
                                    <p className="text-gray-800 flex items-center">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        {new Date(rentalRequest.end_date).toLocaleDateString('en-US', { 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                    </p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-500">Purpose</label>
                                    <p className="text-gray-800">{rentalRequest.purpose}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rental Information (if approved) */}
                        {rentalRequest.rental && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                                    Active Rental Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Rental Status</label>
                                        <p className="text-gray-800">{rentalRequest.rental.status}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Pickup Date</label>
                                        <p className="text-gray-800">
                                            {rentalRequest.rental.pickup_date ? 
                                                new Date(rentalRequest.rental.pickup_date).toLocaleString() : 
                                                'Not set'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Total Amount</label>
                                        <p className="text-gray-800">
                                            {rentalRequest.rental.total_amount ? 
                                                `PHP ${rentalRequest.rental.total_amount}` : 
                                                'Not calculated'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Return Date</label>
                                        <p className="text-gray-800">
                                            {rentalRequest.rental.return_date ? 
                                                new Date(rentalRequest.rental.return_date).toLocaleString() : 
                                                'Not returned'
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status and Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Status & Actions</h2>
                            
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-500">Current Status</label>
                                <div className="mt-2">
                                    <span className={`px-3 py-1 text-sm rounded-full ${getStatusBadge(rentalRequest.status)}`}>
                                        {rentalRequest.status}
                                    </span>
                                </div>
                            </div>

                            {rentalRequest.status === 'pending' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleApprove}
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Request
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Reject Request
                                    </button>
                                </div>
                            )}

                            {rentalRequest.status === 'rejected' && rentalRequest.rejected_reason && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <label className="text-sm font-medium text-red-800">Rejection Reason</label>
                                    <p className="text-red-700 mt-1">{rentalRequest.rejected_reason}</p>
                                </div>
                            )}
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <Edit className="w-5 h-5 mr-2 text-blue-600" />
                                Admin Notes
                            </h2>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                placeholder="Add notes about this rental request..."
                                defaultValue={rentalRequest.admin_notes || ''}
                                onBlur={(e) => updateNotes(e.target.value)}
                            />
                        </div>

                        {/* Request Information */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Request Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Request ID</label>
                                    <p className="text-gray-800">#{rentalRequest.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Submitted On</label>
                                    <p className="text-gray-800">
                                        {new Date(rentalRequest.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
