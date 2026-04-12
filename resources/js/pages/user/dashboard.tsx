import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Package, Calendar, CheckCircle, AlertCircle, Clock, PlusCircle, History, TrendingUp } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface RentalRequest {
    id: number;
    tank_type: string;
    quantity: number;
    start_date: string;
    end_date: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    created_at: string;
}

interface ActiveRental {
    id: number;
    tank_id: string;
    start_date: string;
    end_date: string;
    status: string;
    pickup_date?: string;
    rental_request?: RentalRequest;
}

interface Stats {
    pending_requests: number;
    approved_requests: number;
    active_rentals: number;
    completed_rentals: number;
}

interface Props {
    breadcrumbs?: BreadcrumbItem[];
    rentalRequests: RentalRequest[];
    activeRentals: ActiveRental[];
    stats: Stats;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function UserDashboard({ breadcrumbs = [{ title: 'Dashboard', href: '/user/dashboard' }], rentalRequests, activeRentals, stats, auth }: Props) {
    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
            active: 'bg-green-100 text-green-800'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const handleCreateRequest = () => {
        router.visit('/user/rentals/create');
    };

    return (
        <AppLayout>
            <Head title="User Dashboard" />
            <div className="min-h-screen bg-background p-6">
                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {auth.user.name}!</h1>
                        <p className="text-muted-foreground">Welcome to MV Oxygen Trading - Manage your rentals</p>
                    </div>

                    {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 dark:shadow-xl dark:border-yellow-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Pending Requests</p>
                                <p className="text-2xl font-bold text-foreground">{stats.pending_requests}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-lg p-6 border-l-4 border-green-500 dark:shadow-xl dark:border-green-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Active Rentals</p>
                                <p className="text-2xl font-bold text-foreground">{stats.active_rentals}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-lg p-6 border-l-4 border-blue-500 dark:shadow-xl dark:border-blue-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Approved Requests</p>
                                <p className="text-2xl font-bold text-foreground">{stats.approved_requests}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-card rounded-xl shadow-lg p-6 border-l-4 border-purple-500 dark:shadow-xl dark:border-purple-400">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm font-medium">Completed</p>
                                <p className="text-2xl font-bold text-foreground">{stats.completed_rentals}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <History className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-card rounded-xl shadow-lg p-6 mb-8 dark:shadow-xl">
                    <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={handleCreateRequest}
                            className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            New Rental Request
                        </button>
                        <a
                            href="/user/rentals"
                            className="flex items-center justify-center p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <History className="w-5 h-5 mr-2" />
                            View All Rentals
                        </a>
                    </div>
                </div>

                {/* Active Rentals */}
                {activeRentals.length > 0 && (
                    <div className="bg-card rounded-xl shadow-lg p-6 mb-8 dark:shadow-xl">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-green-600" />
                            Active Rentals
                        </h2>
                        <div className="space-y-4">
                            {activeRentals.map((rental) => (
                                <div key={rental.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-card/50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="font-semibold text-foreground">
                                                    {rental.rental_request?.tank_type || 'Oxygen Tank'}
                                                </span>
                                                <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                                    Active
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground/60" />
                                                    <span className="text-foreground/90">{new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Package className="w-4 h-4 mr-2 text-muted-foreground/60" />
                                                    <span className="text-foreground/90">Tank ID: {rental.tank_id || 'TBD'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            {rental.pickup_date ? `Picked up: ${new Date(rental.pickup_date).toLocaleDateString()}` : 'Ready for pickup'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Rental History */}
                <div className="bg-card rounded-xl shadow-lg p-6 dark:shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-foreground flex items-center">
                            <History className="w-5 h-5 mr-2 text-purple-600" />
                            Rental History
                        </h2>
                        <a href="/user/rentals" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View All
                        </a>
                    </div>
                    
                    <div className="space-y-4">
                        {rentalRequests.length > 0 ? (
                            rentalRequests.map((request) => (
                                <div 
                                    key={request.id} 
                                    className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30 dark:bg-card/50 dark:hover:bg-card/70"
                                    onClick={() => router.visit(`/user/rentals/${request.id}`)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                request.status === 'approved' ? 'bg-green-500 dark:bg-green-400' :
                                                request.status === 'rejected' ? 'bg-red-500 dark:bg-red-400' :
                                                request.status === 'completed' ? 'bg-blue-500 dark:bg-blue-400' :
                                                'bg-yellow-500 dark:bg-yellow-400'
                                            }`}></div>
                                            <div>
                                                <span className="font-semibold text-foreground">{request.tank_type}</span>
                                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground font-medium">
                                            Request #{request.id}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                        <div className="flex items-center text-muted-foreground">
                                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground/60" />
                                            <div>
                                                <div className="font-medium text-foreground/90">Rental Period</div>
                                                <div className="text-xs text-foreground/80">{new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Package className="w-4 h-4 mr-2 text-muted-foreground/60" />
                                            <div>
                                                <div className="font-medium text-foreground/90">Quantity</div>
                                                <div className="text-xs text-foreground/80">{request.quantity} unit(s)</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-muted-foreground">
                                            <Clock className="w-4 h-4 mr-2 text-muted-foreground/60" />
                                            <div>
                                                <div className="font-medium text-foreground/90">Requested</div>
                                                <div className="text-xs text-foreground/80">{new Date(request.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground/90">Purpose:</span> {request.purpose}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                                <p>No rental requests yet.</p>
                                <button
                                    onClick={handleCreateRequest}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Your First Request
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
