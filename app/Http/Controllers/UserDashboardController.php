<?php

namespace App\Http\Controllers;

use App\Models\RentalRequest;
use App\Models\Rental;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserDashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Find customer record for this user (match by name or contact number)
        $customer = \App\Models\Customer::where('name', $user->name)
            ->orWhere('contact_number', $user->phone)
            ->first();
        
        $customerId = $customer ? $customer->id : null;
        
        // Get user's rental requests
        $rentalRequests = RentalRequest::where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get user's active rentals
        $activeRentals = Rental::where('customer_id', $customerId)
            ->where('status', 'active')
            ->with(['rentalRequest'])
            ->get();

        // Get rental statistics
        $stats = [
            'pending_requests' => RentalRequest::where('customer_id', $customerId)->where('status', 'pending')->count(),
            'approved_requests' => RentalRequest::where('customer_id', $customerId)->where('status', 'approved')->count(),
            'active_rentals' => Rental::where('customer_id', $customerId)->where('status', 'active')->count(),
            'completed_rentals' => Rental::where('customer_id', $customerId)->where('status', 'completed')->count(),
        ];

        // Get available tank types from inventory
        $tankTypes = \App\Models\Tank::where('status', 'available')
            ->where('quantity', '>', 0)
            ->pluck('tank_type')
            ->unique()
            ->values();

        return Inertia::render('user/dashboard', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/user/dashboard']
            ],
            'rentalRequests' => $rentalRequests,
            'activeRentals' => $activeRentals,
            'stats' => $stats,
            'tankTypes' => $tankTypes,
            'auth' => [
                'user' => $user
            ]
        ]);
    }
}
