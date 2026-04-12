import React from 'react';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Package, Clock, CheckCircle, AlertCircle, XCircle, PlusCircle, ArrowLeft } from 'lucide-react';
import { type BreadcrumbItem } from '@/types';
import { router } from '@inertiajs/react';

interface RentalRequest {
    id: number;
    tank_type: string;
    quantity: number;
    start_date: string;
    end_date: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    created_at: string;
    updated_at: string;
    contact_number?: string;
    address?: string;
    rental?: {
        id: number;
        status: string;
        pickup_date?: string;
        return_date?: string;
        notes?: string;
    };
}

interface Stats {
    total_requests: number;
    pending_requests: number;
    approved_requests: number;
    rejected_requests: number;
    completed_requests: number;
}

interface PageProps {
    rentalRequests: RentalRequest[];
    stats: Stats;
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

export default function UserHistory() {
    const { props } = usePage<PageProps>();
    const { rentalRequests, stats, breadcrumbs, auth } = props;
    
    // Debug: Check if breadcrumbs are received
    console.log('History page breadcrumbs:', breadcrumbs);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-4 h-4" />;
            case 'pending':
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const calculateDuration = (startDate: string, endDate: string) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return `${days} days`;
    };

    const handleCreateRequest = () => {
        router.visit('/user/rentals/create');
    };

    const handleViewDetails = (id: number) => {
        router.visit(`/user/rentals/${id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Rental History" />

            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Rental History</h1>
                        <p className="text-gray-600">View your complete rental request history</p>
                    </div>
                    <Button
                        onClick={handleCreateRequest}
                        className="flex items-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" />
                        New Request
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-gray-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_requests}</p>
                            </div>
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Pending</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.pending_requests}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Approved</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.approved_requests}</p>
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
                                <p className="text-2xl font-bold text-gray-800">{stats.rejected_requests}</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Completed</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.completed_requests}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Complete History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {rentalRequests.length > 0 ? (
                            <div className="space-y-4">
                                {rentalRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                                        onClick={() => handleViewDetails(request.id)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    request.status === 'approved' ? 'bg-green-500' :
                                                    request.status === 'rejected' ? 'bg-red-500' :
                                                    request.status === 'completed' ? 'bg-blue-500' :
                                                    'bg-yellow-500'
                                                }`}></div>
                                                <div>
                                                    <span className="font-medium text-gray-800">{request.tank_type}</span>
                                                    <Badge className={`ml-2 ${getStatusColor(request.status)}`}>
                                                        {getStatusIcon(request.status)}
                                                        <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Request #{request.id}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                <div>
                                                    <div className="font-medium">Duration</div>
                                                    <div className="text-xs">{calculateDuration(request.start_date, request.end_date)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Package className="w-4 h-4 mr-2 text-gray-400" />
                                                <div>
                                                    <div className="font-medium">Quantity</div>
                                                    <div className="text-xs">{request.quantity} unit(s)</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                                <div>
                                                    <div className="font-medium">Requested</div>
                                                    <div className="text-xs">{formatDate(request.created_at)}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <CheckCircle className="w-4 h-4 mr-2 text-gray-400" />
                                                <div>
                                                    <div className="font-medium">Updated</div>
                                                    <div className="text-xs">{formatDate(request.updated_at)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="text-sm text-gray-500">
                                                Purpose: {request.purpose}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium mb-2">No rental requests yet</p>
                                <p className="text-sm mb-4">Create your first rental request to get started</p>
                                <Button onClick={handleCreateRequest}>
                                    <PlusCircle className="w-4 h-4 mr-2" />
                                    Create Your First Request
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
