<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\RentalController;
use App\Http\Controllers\UserDashboardController;
use App\Http\Controllers\UserRentalController;
use App\Http\Controllers\NotificationController;

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

        // Fetch latest activities
        $activities = \App\Models\Activity::with(['user', 'customer', 'rentalRequest'])
            ->latest()
            ->limit(20)
            ->get();

        // Determine date range based on period
        $startDate = now();
        switch ($period) {
            case 'daily':
                $startDate = now()->startOfDay();
                break;
            case 'weekly':
                $startDate = now()->subDays(7)->startOfDay();
                break;
            case 'monthly':
                $startDate = now()->startOfMonth();
                break;
        }

        // Fetch rental request status counts based on period
        $pendingCount = \App\Models\RentalRequest::where('status', 'pending')
            ->where('created_at', '>=', $startDate)
            ->count();
        $approvedCount = \App\Models\RentalRequest::where('status', 'approved')
            ->where('created_at', '>=', $startDate)
            ->count();
        $rejectedCount = \App\Models\RentalRequest::where('status', 'rejected')
            ->where('created_at', '>=', $startDate)
            ->count();
        $completedCount = \App\Models\RentalRequest::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->count();

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
    Route::get('refills', [RentalController::class, 'refills'])->name('refills.index');
    Route::get('refills/{rentalRequest}', [RentalController::class, 'show'])->name('refills.show');
    Route::get('rentals/{rentalRequest}', [RentalController::class, 'show'])->name('rentals.show');
    Route::post('refills', [RentalController::class, 'storeRefill'])->name('refills.store');
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
