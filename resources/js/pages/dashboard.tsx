import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, Package, DollarSign, TrendingUp, ShoppingCart, AlertCircle, CheckCircle, Clock, User, Calendar, Phone, ArrowLeft, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface RentalRequest {
    id: number;
    customer: {
        name: string;
        email: string;
    };
    tank_type: string;
    quantity: number;
    start_date: string;
    end_date: string;
    purpose: string;
    contact_number: string;
    address: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    created_at: string;
    days_until_return?: number;
    rental?: {
        pickup_date?: string;
    };
}

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    pendingRentalRequests?: RentalRequest[];
    rentalPagination?: {
        currentPage: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
    tanksDueForReturn?: RentalRequest[];
    overdueTanks?: RentalRequest[];
}

export default function Dashboard({ 
    breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }], 
    pendingRentalRequests = [], 
    rentalPagination = { currentPage: 1, totalPages: 1, hasNext: false, hasPrev: false },
    tanksDueForReturn = [],
    overdueTanks = []
}: Props) {
    const [tankPage, setTankPage] = useState(1);
    const [overduePage, setOverduePage] = useState(1);
    const tanksPerPage = 2;
    const overduePerPage = 2;
    
    const totalPages = Math.ceil((tanksDueForReturn?.length || 0) / tanksPerPage);
    const totalOverduePages = Math.ceil((overdueTanks?.length || 0) / overduePerPage);
    
    const startIndex = (tankPage - 1) * tanksPerPage;
    const endIndex = startIndex + tanksPerPage;
    const currentTanks = tanksDueForReturn?.slice(startIndex, endIndex) || [];
    
    const overdueStartIndex = (overduePage - 1) * overduePerPage;
    const overdueEndIndex = overdueStartIndex + overduePerPage;
    const currentOverdueTanks = overdueTanks?.slice(overdueStartIndex, overdueEndIndex) || [];
    
    const handleNextTankPage = () => {
        if (tankPage < totalPages) {
            setTankPage(tankPage + 1);
        }
    };
    
    const handlePrevTankPage = () => {
        if (tankPage > 1) {
            setTankPage(tankPage - 1);
        }
    };
    
    const handleNextOverduePage = () => {
        if (overduePage < totalOverduePages) {
            setOverduePage(overduePage + 1);
        }
    };
    
    const handlePrevOverduePage = () => {
        if (overduePage > 1) {
            setOverduePage(overduePage - 1);
        }
    };
    const handleApprove = (id: number) => {
        if (confirm('Are you sure you want to approve this rental request?')) {
            router.post(`/rentals/${id}/approve`, {}, {
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    const handleReject = (id: number) => {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            router.post(`/rentals/${id}/reject`, { rejected_reason: reason }, {
                onSuccess: () => {
                    router.reload();
                }
            });
        }
    };

    const handlePrevPage = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('rental_page', (rentalPagination.currentPage - 1).toString());
        router.visit(url.pathname + url.search);
    };

    const handleNextPage = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('rental_page', (rentalPagination.currentPage + 1).toString());
        router.visit(url.pathname + url.search);
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-gray-50 p-6 w-full max-w-none">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome to MV Oxygen Trading Management System</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Argon Tanks</p>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">NitroGen</p>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-green-600 text-sm mt-1">0</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Medical Oxygen</p>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-green-600 text-sm mt-1">0</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Flask Type Tank</p>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-green-600 text-sm mt-1">0</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Acetylene</p>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-green-600 text-sm mt-1">0</p>
                            </div>
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Industrial Oxygen</p>
                                <p className="text-2xl font-bold text-gray-800">0</p>
                                <p className="text-green-600 text-sm mt-1">0</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-indigo-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a
                            href="/customer"
                            className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Users className="w-5 h-5 mr-2" />
                            Manage Customers
                        </a>
                        <a
                            href="/rentals"
                            className="flex items-center justify-center p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <Package className="w-5 h-5 mr-2" />
                            View All Rentals
                        </a>
                    </div>
                </div>

                {/* Progress Bars Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Tank Inventory Status</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Argon Tanks</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">NitroGen</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Medical Oxygen</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-yellow-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Flask Type Tanks</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Acetylene</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-red-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Industrial Oxygen</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-indigo-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tanks Due for Return */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
                                Tanks Due for Return
                            </h2>
                            <div className="text-sm text-gray-600">
                                {tanksDueForReturn ? tanksDueForReturn.length : 0} tanks found
                            </div>
                        </div>
                    
                    {currentTanks && currentTanks.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {currentTanks.map((tank) => (
                                <div key={tank.id} className="border border-orange-200 rounded-lg overflow-hidden">
                                    <div className="bg-orange-50 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-2">
                                                    <User className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{tank.customer?.name}</h4>
                                                    <p className="text-xs text-gray-600">ID: #{tank.id.toString().padStart(4, '0')}</p>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 font-medium">
                                                {tank.days_until_return === 0 ? 'Due Today' : tank.days_until_return && tank.days_until_return > 0 ? `${tank.days_until_return} days` : `${Math.abs(tank.days_until_return || 0)} days overdue`}
                                            </span>
                                        </div>
                                        
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr className="border-b border-orange-100">
                                                    <td className="py-2 text-gray-600 flex items-center">
                                                        <Package className="w-3 h-3 mr-2 text-orange-400" />
                                                        Tank Type
                                                    </td>
                                                    <td className="py-2 text-gray-800 font-medium text-right">
                                                        {tank.tank_type} ({tank.quantity} unit(s))
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-orange-100">
                                                    <td className="py-2 text-gray-600 flex items-center">
                                                        <Calendar className="w-3 h-3 mr-2 text-orange-400" />
                                                        Due Date
                                                    </td>
                                                    <td className="py-2 text-gray-800 font-medium text-right">
                                                        {new Date(tank.end_date).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                                <tr className="border-b border-orange-100">
                                                    <td className="py-2 text-gray-600 flex items-center">
                                                        <Phone className="w-3 h-3 mr-2 text-orange-400" />
                                                        Contact
                                                    </td>
                                                    <td className="py-2 text-gray-800 font-medium text-right">
                                                        {tank.contact_number}
                                                    </td>
                                                </tr>
                                                {tank.rental && (
                                                    <tr>
                                                        <td className="py-2 text-gray-600 flex items-center">
                                                            <AlertCircle className="w-3 h-3 mr-2 text-orange-400" />
                                                            Status
                                                        </td>
                                                        <td className="py-2 text-gray-800 font-medium text-right">
                                                            For {tank.rental.pickup_date ? 'Pickup' : 'Delivery'}
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        
                                        <div className="mt-3 pt-3 border-t border-orange-100">
                                            <button 
                                                className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                                onClick={() => router.visit(`/rentals/${tank.id}`)}
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-orange-400" />
                            </div>
                            <p className="text-gray-500 text-lg">No tanks due for return</p>
                            <p className="text-gray-400 text-sm mt-2">All tanks are currently returned or within rental period</p>
                        </div>
                    )}
                    
                    {/* Pagination Navigation */}
                    {tanksDueForReturn && tanksDueForReturn.length > 0 && (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1}-{Math.min(endIndex, tanksDueForReturn.length)} of {tanksDueForReturn.length} tanks
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePrevTankPage}
                                    className={`px-3 py-1 text-sm rounded transition-colors flex items-center ${
                                        tankPage === 1 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                    disabled={tankPage === 1}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextTankPage}
                                    className={`px-3 py-1 text-sm rounded transition-colors flex items-center ${
                                        tankPage >= totalPages 
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                    disabled={tankPage >= totalPages}
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Overdue and Pending Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Overdue Tanks */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                            Overdue Tanks
                        </h2>
                        
                        <div className="space-y-3">
                            {currentOverdueTanks && currentOverdueTanks.length > 0 ? (
                                currentOverdueTanks.map((tank) => (
                                    <div key={tank.id} className="border border-red-200 rounded-lg p-3 bg-red-50">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <User className="w-4 h-4 mr-2 text-red-600" />
                                                    <span className="font-medium text-gray-800">{tank.customer?.name}</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Package className="w-4 h-4 mr-2 text-red-400" />
                                                        {tank.tank_type} - {tank.quantity} unit(s)
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-2 text-red-400" />
                                                        Was due: {new Date(tank.end_date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Phone className="w-4 h-4 mr-2 text-red-400" />
                                                        {tank.contact_number}
                                                    </div>
                                                    {tank.rental && (
                                                        <div className="flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
                                                            Status: For {tank.rental.pickup_date ? 'Pickup' : 'Delivery'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                                    {Math.abs(tank.days_until_return || 0)} day(s) overdue
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No overdue tanks</p>
                            )}
                        </div>
                        
                        {/* Pagination Navigation for Overdue Tanks */}
                        {overdueTanks && overdueTanks.length > 0 && (
                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    Showing {overdueStartIndex + 1}-{Math.min(overdueEndIndex, overdueTanks.length)} of {overdueTanks.length} overdue tanks
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => overduePage > 1 && handlePrevOverduePage()}
                                        className={`px-3 py-1 text-sm rounded transition-colors flex items-center ${
                                            overduePage === 1 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                        disabled={overduePage === 1}
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-1" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => overduePage < totalOverduePages && handleNextOverduePage()}
                                        className={`px-3 py-1 text-sm rounded transition-colors flex items-center ${
                                            overduePage >= totalOverduePages 
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                        disabled={overduePage >= totalOverduePages}
                                    >
                                        Next
                                        <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Rental Requests */}
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                                Pending Rental Requests
                            </h2>
                            <div className="text-sm text-gray-600">
                                {pendingRentalRequests ? pendingRentalRequests.length : 0} pending
                            </div>
                        </div>
                    
                    <div className="space-y-4">
                        {pendingRentalRequests.length > 0 ? (
                            pendingRentalRequests.map((request) => (
                                <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <User className="w-4 h-4 mr-2 text-gray-500" />
                                                <span className="font-medium text-gray-800">{request.customer.name}</span>
                                                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Package className="w-4 h-4 mr-2 text-gray-400" />
                                                    {request.tank_type} - {request.quantity} unit(s)
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    {request.contact_number}
                                                </div>
                                                <div className="text-gray-500">
                                                    Purpose: {request.purpose}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2 ml-4">
                                            <button 
                                                onClick={() => handleApprove(request.id)}
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Approve
                                            </button>
                                            <button 
                                                onClick={() => handleReject(request.id)}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex items-center"
                                            >
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No pending rental requests at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination Navigation */}
                    {pendingRentalRequests.length > 0 && rentalPagination.totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                Page {rentalPagination.currentPage} of {rentalPagination.totalPages}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!rentalPagination.hasPrev}
                                    className={`px-3 py-1 text-sm rounded flex items-center ${
                                        rentalPagination.hasPrev
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } transition-colors`}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={!rentalPagination.hasNext}
                                    className={`px-3 py-1 text-sm rounded flex items-center ${
                                        rentalPagination.hasNext
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    } transition-colors`}
                                >
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    )}
                    </div>
                </div>

                {/* Tank Inventory */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Tank Inventory</h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tank ID</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tank Type</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Capacity</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Pressure</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Inspection</th>
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">ARG-001</td>
                                    <td className="py-3 px-4 text-gray-800">Argon Tank</td>
                                    <td className="py-3 px-4 text-gray-800">50L</td>
                                    <td className="py-3 px-4 text-gray-800">200 bar</td>
                                    <td className="py-3 px-4 text-gray-600">2024-04-01</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">MED-002</td>
                                    <td className="py-3 px-4 text-gray-800">Medical Oxygen</td>
                                    <td className="py-3 px-4 text-gray-800">40L</td>
                                    <td className="py-3 px-4 text-gray-800">150 bar</td>
                                    <td className="py-3 px-4 text-gray-600">2024-04-05</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Use</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">NIT-003</td>
                                    <td className="py-3 px-4 text-gray-800">NitroGen</td>
                                    <td className="py-3 px-4 text-gray-800">30L</td>
                                    <td className="py-3 px-4 text-gray-800">180 bar</td>
                                    <td className="py-3 px-4 text-gray-600">2024-04-03</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">FLS-004</td>
                                    <td className="py-3 px-4 text-gray-800">Flask Type Tank</td>
                                    <td className="py-3 px-4 text-gray-800">10L</td>
                                    <td className="py-3 px-4 text-gray-800">200 bar</td>
                                    <td className="py-3 px-4 text-gray-600">2024-04-02</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Maintenance</span>
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">ACE-005</td>
                                    <td className="py-3 px-4 text-gray-800">Acetylene</td>
                                    <td className="py-3 px-4 text-gray-800">20L</td>
                                    <td className="py-3 px-4 text-gray-800">170 bar</td>
                                    <td className="py-3 px-4 text-gray-600">2024-04-06</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="py-3 px-4 text-gray-800">IND-006</td>
                                    <td className="py-3 px-4 text-gray-800">Industrial Oxygen</td>
                                    <td className="py-3 px-4 text-gray-800">100L</td>
                                    <td className="py-3 px-4 text-gray-800">250 bar</td>
                                    <td className="py-3 px-4 text-gray-600">2024-04-04</td>
                                    <td className="py-3 px-4">
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Refilling</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
