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
    Route::get('user/history', [UserRentalController::class, 'history'])->name('user.history');
    Route::get('user/settings', [UserRentalController::class, 'settings'])->name('user.settings');
    Route::post('user/settings/profile', [UserRentalController::class, 'updateProfile'])->name('user.settings.profile');
    Route::post('user/settings/notifications', [UserRentalController::class, 'updateNotifications'])->name('user.settings.notifications');
    Route::post('user/settings/preferences', [UserRentalController::class, 'updatePreferences'])->name('user.settings.preferences');
    
    // Admin Dashboard Routes
    Route::get('dashboard', function () {
        $page = request()->get('rental_page', 1);
        $perPage = 2;
        
        $pendingRentalRequestsQuery = \App\Models\RentalRequest::with(['customer'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');
            
        $totalPending = $pendingRentalRequestsQuery->count();
        $pendingRentalRequests = $pendingRentalRequestsQuery
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();

        // Get tanks due for return
        $tanksDueForReturn = \App\Models\RentalRequest::getTanksDueForReturn(365);
        $overdueTanks = \App\Models\RentalRequest::getOverdueTanks();

        return Inertia::render('dashboard', [
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => '/dashboard']
            ],
            'pendingRentalRequests' => $pendingRentalRequests,
            'rentalPagination' => [
                'currentPage' => $page,
                'totalPages' => ceil($totalPending / $perPage),
                'hasNext' => $page < ceil($totalPending / $perPage),
                'hasPrev' => $page > 1
            ],
            'tanksDueForReturn' => $tanksDueForReturn,
            'overdueTanks' => $overdueTanks,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    })->name('dashboard');
    
    Route::get('customer', [CustomerController::class, 'index'])->name('customer');
    Route::get('customer/{id}', [CustomerController::class, 'show'])->name('customer.show');
    Route::post('customer', [CustomerController::class, 'store'])->name('customer.store');
    Route::get('customer/{id}/edit', [CustomerController::class, 'edit'])->name('customer.edit');
    Route::put('customer/{id}', [CustomerController::class, 'update'])->name('customer.update');
    Route::delete('customer/{id}', [CustomerController::class, 'destroy'])->name('customer.destroy');
    
    // Rental Routes
    Route::get('rentals', [RentalController::class, 'index'])->name('rentals.index');
    Route::get('rentals/{rentalRequest}', [RentalController::class, 'show'])->name('rentals.show');
    Route::post('rentals/{rentalRequest}/approve', [RentalController::class, 'approve'])->name('rentals.approve');
    Route::post('rentals/{rentalRequest}/reject', [RentalController::class, 'reject'])->name('rentals.reject');
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
