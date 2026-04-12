import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Phone, MapPin, Eye, Edit, Trash2, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddCustomerDialog from '@/components/add-customer-dialog';
import EditCustomerDialog from '@/components/edit-customer-dialog';
import DeleteCustomerDialog from '@/components/delete-customer-dialog';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem } from '@/types';

interface Transaction {
    id: number;
    customer_id: number;
    customer_name: string;
    tank_id: string;
    transaction_type: 'Rent' | 'Returned' | 'Refill';
    transaction_date: string;
    created_at: string;
}

interface TankDue {
    id: number;
    customer_id: number;
    customer?: {
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
    days_until_return?: number;
    created_at: string;
}

interface Customer {
    id: number;
    name: string;
    contact_number: string;
    address: string;
    status: 'active' | 'inactive';
    total_rentals: number;
    created_at: string;
    updated_at?: string;
    recent_transactions?: Transaction[];
}

interface CustomerPageProps {
    customers: Customer[];
    recent_transactions?: Transaction[];
    tanks_due_for_return?: TankDue[];
    overdue_tanks?: TankDue[];
    success?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function Customer({ customers: initialCustomers = [], recent_transactions: recentTransactions = [], tanks_due_for_return: tanksDueForReturn = [], overdue_tanks: overdueTanks = [], breadcrumbs = [], success }: CustomerPageProps) {
    console.log('Customer component - initialCustomers:', initialCustomers);
    console.log('Customer component - recentTransactions:', recentTransactions);
    console.log('Customer component - tanksDueForReturn:', tanksDueForReturn);
    console.log('Customer component - overdueTanks:', overdueTanks);
    console.log('Customer component - success:', success);
    
    // Log details of tanks due for return
    if (tanksDueForReturn && tanksDueForReturn.length > 0) {
        console.log('Tanks due for return details:', tanksDueForReturn.map(t => ({ id: t.id, status: t.status, customer: t.customer?.name })));
    }
    
    // Log details of overdue tanks
    if (overdueTanks && overdueTanks.length > 0) {
        console.log('Overdue tanks details:', overdueTanks.map(t => ({ id: t.id, status: t.status, customer: t.customer?.name })));
    }
    
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [tanksCurrentPage, setTanksCurrentPage] = useState(1);
    const tanksPerPage = 5;

    // Show success message when it exists
    useEffect(() => {
        if (success) {
            setShowSuccess(true);
            // Hide success message after 10 seconds
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [success]);
    
    // Handle case where customers might be undefined or null
    const customers = Array.isArray(initialCustomers) ? initialCustomers : [];
    
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact_number.includes(searchTerm) ||
        customer.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic for Tanks Due for Return
    const tanksTotalPages = Math.ceil((tanksDueForReturn?.length || 0) / tanksPerPage);
    const tanksStartIndex = (tanksCurrentPage - 1) * tanksPerPage;
    const tanksEndIndex = tanksStartIndex + tanksPerPage;
    const paginatedTanks = (tanksDueForReturn || []).slice(tanksStartIndex, tanksEndIndex);

    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;

    
    return (
        <AppLayout>
            <Head title="Customer Management" />
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {/* Success Alert */}
                {showSuccess && success && (
                    <Alert className="bg-green-50 border-green-200 text-green-800">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                            {success}
                        </AlertDescription>
                    </Alert>
                )}
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
                        <p className="text-muted-foreground">
                            Manage and view all customer information
                        </p>
                    </div>
                    <AddCustomerDialog onSuccess={() => router.visit('/customer')} />
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                            <div className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{initialCustomers.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Registered customers
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
                            <div className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{activeCustomers}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently active
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Inactive Customers</CardTitle>
                            <div className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{inactiveCustomers}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently inactive
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Rentals</CardTitle>
                            <div className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {initialCustomers.reduce((sum, c) => sum + c.total_rentals, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                All-time rentals
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search and Filter */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <CardTitle>Customer Directory</CardTitle>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Rentals</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow key={customer.id} className="hover:bg-muted/50">
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium">{customer.name}</div>
                                                    <div className="text-sm text-muted-foreground">ID: #{customer.id.toString().padStart(4, '0')}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span>{customer.contact_number}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 max-w-[200px]">
                                                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                                    <span className="truncate">{customer.address}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge 
                                                    variant={customer.status === 'active' ? 'default' : 'secondary'}
                                                    className={customer.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}
                                                >
                                                    {customer.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{customer.total_rentals}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm text-muted-foreground">
                                                    {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => router.visit(`/customer/${customer.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <EditCustomerDialog 
                                                        customer={customer} 
                                                        onSuccess={() => router.visit('/customer')} 
                                                    />
                                                    <DeleteCustomerDialog 
                                                        customer={customer} 
                                                        onSuccess={() => router.visit('/customer')} 
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {filteredCustomers.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                {customers.length === 0 
                                    ? "No customers found. Click 'Add Customer' to get started." 
                                    : "No customers found matching your search."
                                }
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-2 mt-6">
                    {/* Recent Transactions */}
                    {recentTransactions && recentTransactions.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Tank ID</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Date</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentTransactions.slice(0, 5).map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell className="font-medium">{transaction.customer_name}</TableCell>
                                                    <TableCell>{transaction.tank_id}</TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={
                                                                transaction.transaction_type === 'Rent' ? 'default' :
                                                                transaction.transaction_type === 'Returned' ? 'secondary' :
                                                                'outline'
                                                            }
                                                            className={
                                                                transaction.transaction_type === 'Rent' ? 'bg-blue-100 text-blue-800' :
                                                                transaction.transaction_type === 'Returned' ? 'bg-gray-100 text-gray-800' :
                                                                'bg-green-100 text-green-800'
                                                            }
                                                        >
                                                            {transaction.transaction_type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(transaction.transaction_date).toLocaleDateString()}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Tanks Due for Return */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <span>Tanks Due for Return</span>
                                {tanksDueForReturn && tanksDueForReturn.length > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                        {tanksDueForReturn.length}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {paginatedTanks.length > 0 ? (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Tank Type</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Days Until Return</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {paginatedTanks.map((tank) => (
                                                <TableRow key={tank.id}>
                                                    <TableCell className="font-medium">{tank.customer?.name || 'N/A'}</TableCell>
                                                    <TableCell>{tank.tank_type}</TableCell>
                                                    <TableCell>{tank.quantity}</TableCell>
                                                    <TableCell>
                                                        {new Date(tank.end_date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge 
                                                            variant={tank.days_until_return < 0 ? 'destructive' : 'secondary'}
                                                            className={
                                                                tank.days_until_return < 0 ? 'bg-red-100 text-red-800' :
                                                                tank.days_until_return === 0 ? 'bg-orange-100 text-orange-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                            }
                                                        >
                                                            {tank.days_until_return === 0 ? 'Due Today' : 
                                                             tank.days_until_return < 0 ? `${Math.abs(tank.days_until_return)} days overdue` :
                                                             `${tank.days_until_return} days`}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {tank.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => router.visit(`/customer/${tank.customer_id}`)}
                                                            >
                                                                View
                                                            </Button>
                                                            {tank.status === 'pending' && (
                                                                <>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="default"
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        onClick={() => {
                                                                            if (confirm('Are you sure you want to approve this rental request?')) {
                                                                                console.log('Approving rental:', tank.id, 'Current status:', tank.status);
                                                                                router.post(`/rentals/${tank.id}/approve`, {}, {
                                                                                    onSuccess: () => {
                                                                                        console.log('Approval successful, reloading page...');
                                                                                        router.reload();
                                                                                    },
                                                                                    onError: (errors) => {
                                                                                        console.error('Approval failed:', errors);
                                                                                        alert('Approval failed: ' + JSON.stringify(errors));
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="destructive"
                                                                        onClick={() => {
                                                                            const reason = prompt('Please provide a reason for rejection:');
                                                                            if (reason) {
                                                                                router.post(`/rentals/${tank.id}/reject`, { rejected_reason: reason }, {
                                                                                    onSuccess: () => {
                                                                                        router.reload();
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {tank.status === 'approved' && (
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="default"
                                                                    onClick={() => {
                                                                        if (confirm('Mark this tank as returned?')) {
                                                                            router.post(`/rentals/${tank.id}/return`, {}, {
                                                                                onSuccess: () => {
                                                                                    router.reload();
                                                                                }
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Mark Returned
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <div className="text-sm">
                                        No tanks due for return
                                    </div>
                                    <div className="text-xs mt-1">
                                        All tanks are currently returned or within rental period
                                    </div>
                                </div>
                            )}

                            {/* Pagination for Tanks Due for Return */}
                            {(tanksDueForReturn?.length || 0) > tanksPerPage && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {tanksStartIndex + 1} to {Math.min(tanksEndIndex, tanksDueForReturn?.length || 0)} of {tanksDueForReturn?.length || 0} tanks
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTanksCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={tanksCurrentPage === 1}
                                            className="flex items-center gap-1"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: tanksTotalPages }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={tanksCurrentPage === page ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setTanksCurrentPage(page)}
                                                    className="w-8 h-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTanksCurrentPage(prev => Math.min(prev + 1, tanksTotalPages))}
                                            disabled={tanksCurrentPage === tanksTotalPages}
                                            className="flex items-center gap-1"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Overdue Tanks */}
                    {overdueTanks && overdueTanks.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <span>Overdue Tanks</span>
                                    <Badge variant="destructive" className="text-xs">
                                        {overdueTanks.length}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Tank Type</TableHead>
                                                <TableHead>Quantity</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Days Overdue</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {overdueTanks.slice(0, 5).map((tank) => (
                                                <TableRow key={tank.id}>
                                                    <TableCell className="font-medium">{tank.customer?.name || 'N/A'}</TableCell>
                                                    <TableCell>{tank.tank_type}</TableCell>
                                                    <TableCell>{tank.quantity}</TableCell>
                                                    <TableCell>
                                                        {new Date(tank.end_date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                                                            {Math.abs(tank.days_until_return || 0)} days overdue
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {tank.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex space-x-2">
                                                            <Button 
                                                                size="sm" 
                                                                variant="outline"
                                                                onClick={() => router.visit(`/customer/${tank.customer_id}`)}
                                                            >
                                                                View
                                                            </Button>
                                                            {tank.status === 'pending' && (
                                                                <>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="default"
                                                                        className="bg-green-600 hover:bg-green-700"
                                                                        onClick={() => {
                                                                            if (confirm('Are you sure you want to approve this rental request?')) {
                                                                                console.log('Approving rental:', tank.id, 'Current status:', tank.status);
                                                                                router.post(`/rentals/${tank.id}/approve`, {}, {
                                                                                    onSuccess: () => {
                                                                                        console.log('Approval successful, reloading page...');
                                                                                        router.reload();
                                                                                    },
                                                                                    onError: (errors) => {
                                                                                        console.error('Approval failed:', errors);
                                                                                        alert('Approval failed: ' + JSON.stringify(errors));
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button 
                                                                        size="sm" 
                                                                        variant="destructive"
                                                                        onClick={() => {
                                                                            const reason = prompt('Please provide a reason for rejection:');
                                                                            if (reason) {
                                                                                router.post(`/rentals/${tank.id}/reject`, { rejected_reason: reason }, {
                                                                                    onSuccess: () => {
                                                                                        router.reload();
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </>
                                                            )}
                                                            {tank.status === 'approved' && (
                                                                <Button 
                                                                    size="sm" 
                                                                    variant="default"
                                                                    onClick={() => {
                                                                        if (confirm('Mark this tank as returned?')) {
                                                                            router.post(`/rentals/${tank.id}/return`, {}, {
                                                                                onSuccess: () => {
                                                                                    router.reload();
                                                                                }
                                                                            });
                                                                        }
                                                                    }}
                                                                >
                                                                    Mark Returned
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
