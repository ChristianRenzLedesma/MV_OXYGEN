import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Users, Package, Calendar, Phone, CheckCircle, AlertCircle, Eye, Edit, Clock } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface RentalRequest {
    id: number;
    customer: {
        id: number;
        name: string;
        email: string;
    };
    product?: {
        id: number;
        name: string;
    };
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
}

interface Props {
    rentalRequests: RentalRequest[];
}

export default function RentalIndex({ rentalRequests }: Props) {
    const { url } = usePage().props;
    const isRefillsPage = typeof url === 'string' && url.includes('/refills');
    const handleApprove = (id: number) => {
        if (confirm('Are you sure you want to approve this rental request?')) {
            router.post(`/rentals/${id}/approve`, {}, {
                onSuccess: () => {
                    alert('Rental request approved successfully!');
                }
            });
        }
    };

    const handleReject = (id: number) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            router.post(`/rentals/${id}/reject`, { rejected_reason: reason }, {
                onSuccess: () => {
                    alert('Rental request rejected successfully!');
                }
            });
        }
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
        { title: isRefillsPage ? 'Refills' : 'Rentals', href: isRefillsPage ? '/refills' : '/rentals' }
    ];

    return (
        <AppLayout>
            <Head title={isRefillsPage ? 'Refill Requests - Admin' : 'Rental Requests - Admin'} />
            <div className="min-h-screen bg-gray-50 p-6" style={{ marginLeft: '2rem' }}>
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{isRefillsPage ? 'Refill Requests' : 'Rental Requests'}</h1>
                    <p className="text-gray-600">{isRefillsPage ? 'Manage oxygen tank refill requests and approvals' : 'Manage oxygen tank rental requests and approvals'}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {rentalRequests.filter(r => r.status === 'pending').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Approved</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {rentalRequests.filter(r => r.status === 'approved').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Rejected</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {rentalRequests.filter(r => r.status === 'rejected').length}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-800">{rentalRequests.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rental Requests Table */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">All Rental Requests</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tank Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Quantity</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rental Period</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentalRequests.map((request) => (
                                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div>
                                                <div className="font-medium text-gray-800">{request.customer.name}</div>
                                                <div className="text-xs text-gray-500">{request.customer.email}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-800">{request.tank_type}</td>
                                        <td className="py-3 px-4 text-gray-800">{request.quantity}</td>
                                        <td className="py-3 px-4">
                                            <div className="text-gray-800">
                                                <div>{new Date(request.start_date).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-500">to {new Date(request.end_date).toLocaleDateString()}</div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="text-gray-800">
                                                <div className="flex items-center">
                                                    <Phone className="w-3 h-3 mr-1 text-gray-400" />
                                                    {request.contact_number}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex space-x-2">
                                                <a
                                                    href={`/rentals/${request.id}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                                {request.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(request.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(request.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                            title="Reject"
                                                        >
                                                            <AlertCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {rentalRequests.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No rental requests found.</p>
                            </div>
                        )}

                        {/* Pagination */}
                        {rentalRequests.length > 0 && (
                            <div className="flex justify-between items-center mt-4 px-4">
                                <button
                                    onClick={() => router.get(window.location.href, { page: Math.max(1, (usePage().props.page as number || 1) - 1) })}
                                    disabled={(usePage().props.page as number || 1) === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    Page {usePage().props.page as number || 1}
                                </span>
                                <button
                                    onClick={() => router.get(window.location.href, { page: (usePage().props.page as number || 1) + 1 })}
                                    disabled={rentalRequests.length < 10}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
