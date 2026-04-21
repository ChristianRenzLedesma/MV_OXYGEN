<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\RefillController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\UserRentalController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\InventoryController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/faq', function () {
    return Inertia::render('faq');
})->name('faq');

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

Route::middleware(['auth'])->group(function () {
    // User Dashboard Routes
    Route::get('user/dashboard', [UserDashboardController::class, 'index'])->name('user.dashboard');
    Route::get('user/dashboard-test', function () {
        return Inertia::render('user/dashboard-test');
    })->name('user.dashboard.test');
    
    // User Rental Routes
    Route::get('user/rentals', [UserRentalController::class, 'index'])->name('user.rentals.index');
    Route::get('user/rentals/create', [UserRentalController::class, 'create'])->name('user.rentals.create');
    Route::post('user/rentals', [UserRentalController::class, 'store'])->name('user.rentals.store');
    Route::get('user/rentals/{rentalRequest}', [UserRentalController::class, 'show'])->name('user.rentals.show');
    Route::get('user/rentals/{rentalRequest}/edit', [UserRentalController::class, 'edit'])->name('user.rentals.edit');
    Route::put('user/rentals/{rentalRequest}', [UserRentalController::class, 'update'])->name('user.rentals.update');
    Route::post('user/rentals/{rentalRequest}/cancel', [UserRentalController::class, 'cancel'])->name('user.rentals.cancel');
    Route::get('user/rentals/{rentalRequest}/track', [UserRentalController::class, 'track'])->name('user.rentals.track');
    Route::get('user/history', [UserRentalController::class, 'history'])->name('user.history');
    Route::get('user/settings', [UserRentalController::class, 'settings'])->name('user.settings');
    Route::post('user/settings/profile', [UserRentalController::class, 'updateProfile'])->name('user.settings.profile');
    Route::post('user/settings/notifications', [UserRentalController::class, 'updateNotifications'])->name('user.settings.notifications');
    Route::post('user/settings/preferences', [UserRentalController::class, 'updatePreferences'])->name('user.settings.preferences');
    
    // Admin Dashboard Routes
    Route::get('dashboard', function () {
        $page = request()->get('rental_page', 1);
        $perPage = 2;
        $period = request()->get('period', 'daily');
        $month = request()->get('month', null); // Format: YYYY-MM

        // Fetch latest activities
        $activities = \App\Models\Activity::with(['user', 'customer', 'rentalRequest'])
            ->latest()
            ->limit(20)
            ->get();

        // Calculate rental statistics based on period
        $query = \App\Models\RentalRequest::query();

        switch ($period) {
            case 'daily':
                $query->whereDate('created_at', today());
                break;
            case 'weekly':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'monthly':
                if ($month) {
                    $query->whereYear('created_at', substr($month, 0, 4))
                          ->whereMonth('created_at', substr($month, 5, 2));
                } else {
                    $query->whereMonth('created_at', now()->month)
                          ->whereYear('created_at', now()->year);
                }
                break;
        }

        $pendingCount = (clone $query)->where('status', 'pending')->count();
        $approvedCount = (clone $query)->where('status', 'approved')->count();
        $rejectedCount = (clone $query)->where('status', 'rejected')->count();
        $completedCount = (clone $query)->where('status', 'completed')->count();

        $pendingRentalRequestsQuery = \App\Models\RentalRequest::with(['customer'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');

        $totalPending = $pendingRentalRequestsQuery->count();
        $pendingRentalRequests = $pendingRentalRequestsQuery
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        return Inertia::render('dashboard', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard']
            ],
            'activities' => $activities,
            'rentalStats' => [
                'pending' => $pendingCount,
                'approved' => $approvedCount,
                'rejected' => $rejectedCount,
                'completed' => $completedCount,
            ],
            'pendingRentalRequests' => $pendingRentalRequests,
            'rentalPagination' => [
                'currentPage' => $page,
                'totalPages' => ceil($totalPending / $perPage),
                'hasNext' => $page < ceil($totalPending / $perPage),
                'hasPrev' => $page > 1
            ],
            'tanks' => \App\Models\Tank::orderBy('tank_type')->get(),
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    })->name('dashboard');
    
    // Customer Routes
    Route::get('customer', [CustomerController::class, 'index'])->name('customer');
    Route::get('customer/{id}', [CustomerController::class, 'show'])->name('customer.show');
    Route::post('customer', [CustomerController::class, 'store'])->name('customer.store');
    Route::get('customer/{id}/edit', [CustomerController::class, 'edit'])->name('customer.edit');
    Route::put('customer/{id}', [CustomerController::class, 'update'])->name('customer.update');
    Route::post('customer/{id}/archive', [CustomerController::class, 'archive'])->name('customer.archive');
    Route::post('customer/{id}/restore', [CustomerController::class, 'restore'])->name('customer.restore');
    
    // Activity Routes
    Route::get('activities', [ActivityController::class, 'index'])->name('activities.index');
    
    // Rental Routes
    Route::get('rentals', [RentalController::class, 'index'])->name('rentals.index');
    Route::get('rentals/{rentalRequest}', [RentalController::class, 'show'])->name('rentals.show');

    // Refill Routes
    Route::get('refills', [RefillController::class, 'index'])->name('refills.index');
    Route::get('refills/{rentalRequest}', [RefillController::class, 'show'])->name('refills.show');
    Route::post('refills', [RefillController::class, 'store'])->name('refills.store');
    Route::post('refills/{rentalRequest}/approve', [RefillController::class, 'approve'])->name('refills.approve');
    Route::post('refills/{rentalRequest}/reject', [RefillController::class, 'reject'])->name('refills.reject');
    Route::post('refills/{rentalRequest}/return', [RefillController::class, 'markAsReturned'])->name('refills.return');
    Route::put('refills/{rentalRequest}/notes', [RefillController::class, 'updateNotes'])->name('refills.update-notes');

    // Supplier Routes
    Route::get('suppliers', [SupplierController::class, 'index'])->name('suppliers.index');
    Route::get('suppliers/create', [SupplierController::class, 'create'])->name('suppliers.create');
    Route::post('suppliers', [SupplierController::class, 'store'])->name('suppliers.store');
    Route::get('suppliers/{supplier}/edit', [SupplierController::class, 'edit'])->name('suppliers.edit');
    Route::put('suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update');
    Route::delete('suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy');

    // Deposit Routes
    Route::post('deposits', [DepositController::class, 'store'])->name('deposits.store');
    Route::put('deposits/{deposit}', [DepositController::class, 'update'])->name('deposits.update');
    Route::delete('deposits/{deposit}', [DepositController::class, 'destroy'])->name('deposits.destroy');
    Route::post('rentals/{rental}/deposit', [DepositController::class, 'updateRentalDeposit'])->name('rentals.deposit.update');

    // Inventory Routes
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory.index');
    Route::post('inventory', [InventoryController::class, 'store'])->name('inventory.store');
    Route::post('inventory/maintenance', [InventoryController::class, 'storeMaintenance'])->name('inventory.maintenance.store');

    // Rental Routes (Approve, Reject, etc.)
    Route::post('rentals/{rentalRequest}/approve', [RentalController::class, 'approve'])->name('rentals.approve');
    Route::post('rentals/{rentalRequest}/reject', [RentalController::class, 'reject'])->name('rentals.reject');
    Route::post('rentals/{rentalRequest}/cancel', [RentalController::class, 'cancel'])->name('rentals.cancel');
    Route::post('rentals/{rentalRequest}/return', [RentalController::class, 'markAsReturned'])->name('rentals.return');
    Route::put('rentals/{rentalRequest}/notes', [RentalController::class, 'updateNotes'])->name('rentals.update-notes');
    
    // Notification Routes
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
