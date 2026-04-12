<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\RentalRequest;
use App\Models\Rental;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class UserRentalController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Find customer record for this user
        $customer = Customer::where('name', $user->name)->first();
        
        if (!$customer) {
            $rentalRequests = collect([]);
        } else {
            $rentalRequests = RentalRequest::where('customer_id', $customer->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return Inertia::render('user/rentals/index', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/user/dashboard'],
                ['title' => 'My Rentals', 'href' => '/user/rentals']
            ],
            'rentalRequests' => $rentalRequests,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('user/rentals/create', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/user/dashboard'],
                ['title' => 'My Rentals', 'href' => '/user/rentals'],
                ['title' => 'New Request', 'href' => '/user/rentals/create']
            ],
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tank_type' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1|max:10',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'purpose' => 'required|string|max:1000',
            'contact_number' => 'required|string|max:20',
            'address' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        $user = Auth::user();

        // Find or create customer record for this user
        $customer = Customer::firstOrCreate(
            ['name' => $user->name], // Use name as identifier since there's no user_id field
            [
                'contact_number' => $request->contact_number,
                'address' => $request->address,
                'status' => 'active',
                'total_rentals' => 0,
                'join_date' => now(),
            ]
        );

        RentalRequest::create([
            'customer_id' => $customer->id,
            'product_id' => null,
            'tank_type' => $request->tank_type,
            'quantity' => $request->quantity,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'purpose' => $request->purpose,
            'contact_number' => $request->contact_number,
            'address' => $request->address,
            'status' => 'pending',
            'admin_notes' => null,
            'rejected_reason' => null
        ]);

        return redirect()->route('user.dashboard')
            ->with('success', 'Rental request submitted successfully!');
    }

    public function history()
    {
        $user = Auth::user();
        
        // Find customer record for this user
        $customer = Customer::where('name', $user->name)->first();
        
        if ($customer) {
            $rentalRequests = RentalRequest::where('customer_id', $customer->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $rentalRequests = collect([]);
        }

        // Calculate stats
        $stats = [
            'total_requests' => $rentalRequests->count(),
            'pending_requests' => $rentalRequests->where('status', 'pending')->count(),
            'approved_requests' => $rentalRequests->where('status', 'approved')->count(),
            'rejected_requests' => $rentalRequests->where('status', 'rejected')->count(),
            'completed_requests' => $rentalRequests->where('status', 'completed')->count(),
        ];

        return Inertia::render('user/history', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/user/dashboard'],
                ['title' => 'History', 'href' => '/user/history']
            ],
            'rentalRequests' => $rentalRequests,
            'stats' => $stats,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    public function settings()
    {
        $user = Auth::user();

        return Inertia::render('user/settings', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/user/dashboard'],
                ['title' => 'Settings', 'href' => '/user/settings']
            ],
            'user' => $user,
            'auth' => [
                'user' => $user
            ]
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
        ]);

        $user->update($validated);

        return redirect()->route('user.settings')
            ->with('success', 'Profile updated successfully!');
    }

    public function updateNotifications(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'push_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
        ]);

        // Store notification preferences in user metadata or separate table
        // For now, we'll store in session as placeholder
        session(['notification_preferences' => $validated]);

        return redirect()->route('user.settings')
            ->with('success', 'Notification preferences updated!');
    }

    public function updatePreferences(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'theme' => 'required|string|in:light,dark,system',
            'language' => 'required|string|in:en,tl',
            'timezone' => 'required|string',
        ]);

        // Store preferences in session or user metadata
        session(['user_preferences' => $validated]);

        return redirect()->route('user.settings')
            ->with('success', 'Preferences updated!');
    }

    public function show(RentalRequest $rentalRequest)
    {
        $user = Auth::user();
        
        // Find customer record for this user
        $customer = Customer::where('name', $user->name)->first();
        
        // Ensure user can only view their own requests
        if (!$customer || $rentalRequest->customer_id !== $customer->id) {
            abort(403);
        }

        $rentalRequest->load(['rental']);

        return Inertia::render('user/rentals/show', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/user/dashboard'],
                ['title' => 'My Rentals', 'href' => '/user/rentals'],
                ['title' => 'Request Details', 'href' => "/user/rentals/{$rentalRequest->id}"]
            ],
            'rentalRequest' => $rentalRequest,
            'auth' => [
                'user' => $user
            ]
        ]);
    }
}
