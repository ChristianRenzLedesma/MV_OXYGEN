import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Users, Package, DollarSign, TrendingUp, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="min-h-screen bg-gray-50 p-6" style={{ marginLeft: '2rem' }}>
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Welcome to MV Oxygen Trading Management System</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Business Performance</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Daily Sales Target</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-emerald-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Monthly Revenue</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Customer Satisfaction</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-teal-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Delivery Efficiency</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-orange-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Inventory Turnover</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-pink-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Service Response Time</span>
                                    <span className="text-gray-800 font-medium">0%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div className="bg-cyan-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
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
