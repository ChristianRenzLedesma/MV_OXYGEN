import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Users, Package, Calendar, Phone, MapPin, CheckCircle, AlertCircle, ArrowLeft, Edit, X, RefreshCw } from 'lucide-react';
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
    request_type: string;
}

interface Props {
    rentalRequest: RentalRequest;
}

export default function RefillShow({ rentalRequest }: Props) {
    const handleApprove = () => {
        if (confirm('Are you sure you want to approve this refill request?')) {
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

    const handleMarkAsReturned = () => {
        if (confirm('Are you sure you want to mark this refill as returned/completed?')) {
            router.post(`/rentals/${rentalRequest.id}/return`, {}, {
                onSuccess: () => {
                    router.reload();
                },
                onError: (errors) => {
                    alert('Error marking as returned: ' + (errors.message || 'Please try again.'));
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
        { title: 'Refills', href: '/refills' },
        { title: 'Request Details', href: `/refills/${rentalRequest.id}` }
    ];

    return (
        <AppLayout>
            <Head title="Refill Request Details - Admin" />
            <div className="min-h-screen bg-gray-50 p-6" style={{ marginLeft: '2rem' }}>
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Refill Request Details</h1>
                            <p className="text-gray-600">View and manage refill request information</p>
                        </div>
                        <a
                            href="/refills"
                            className="flex items-center text-gray-600 hover:text-gray-800"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Refills
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Request Information */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-800">Request Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Request ID</label>
                                    <p className="font-medium text-gray-800">#{rentalRequest.id}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Request Type</label>
                                    <p className="font-medium text-gray-800 capitalize">{rentalRequest.request_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Status</label>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(rentalRequest.status)}`}>
                                        {rentalRequest.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Submitted On</label>
                                    <p className="font-medium text-gray-800">{new Date(rentalRequest.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Tank Type</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.tank_type}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Quantity</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.quantity} unit(s)</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Refill Period</label>
                                    <p className="font-medium text-gray-800">
                                        {new Date(rentalRequest.start_date).toLocaleDateString()} - {new Date(rentalRequest.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Purpose</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.purpose}</p>
                                </div>
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <Users className="w-5 h-5 mr-2 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-800">Customer Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Name</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.customer.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.customer.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Contact Number</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.contact_number}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Address</label>
                                    <p className="font-medium text-gray-800">{rentalRequest.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center mb-4">
                                <Edit className="w-5 h-5 mr-2 text-blue-600" />
                                <h2 className="text-xl font-bold text-gray-800">Admin Notes</h2>
                            </div>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                placeholder="Add admin notes..."
                                defaultValue={rentalRequest.admin_notes || ''}
                                onBlur={(e) => updateNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Actions</h2>

                            {rentalRequest.status === 'pending' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleApprove}
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve Refill
                                    </button>
                                    <button
                                        onClick={handleReject}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                                    >
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        Reject Refill
                                    </button>
                                </div>
                            )}

                            {rentalRequest.status === 'approved' && (
                                <div className="space-y-3">
                                    <button
                                        onClick={handleMarkAsReturned}
                                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Mark as Returned/Completed
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

                        {/* Refill Information */}
                        {rentalRequest.rental && (
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="flex items-center mb-4">
                                    <RefreshCw className="w-5 h-5 mr-2 text-blue-600" />
                                    <h2 className="text-xl font-bold text-gray-800">Refill Information</h2>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm text-gray-500">Rental ID</label>
                                        <p className="font-medium text-gray-800">#{rentalRequest.rental.id}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500">Status</label>
                                        <p className="font-medium text-gray-800">{rentalRequest.rental.status}</p>
                                    </div>
                                    {rentalRequest.rental.pickup_date && (
                                        <div>
                                            <label className="text-sm text-gray-500">Pickup Date</label>
                                            <p className="font-medium text-gray-800">{new Date(rentalRequest.rental.pickup_date).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    {rentalRequest.rental.return_date && (
                                        <div>
                                            <label className="text-sm text-gray-500">Return Date</label>
                                            <p className="font-medium text-gray-800">{new Date(rentalRequest.rental.return_date).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
